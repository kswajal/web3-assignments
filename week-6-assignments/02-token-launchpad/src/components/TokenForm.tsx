import { useState } from "react";
import type { FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createToken } from "../lib/createToken";
import { uploadToIPFS, uploadMetadata } from "../lib/uploadToIPFS";
import ImageUpload from "./ImageUpload";
import TokenSuccess from "./TokenSuccess";

interface TokenFormData {
  name: string;
  symbol: string;
  supply: string;
  decimals: number;
  freezeAuthority: boolean;
}

const initialFormState: TokenFormData = {
  name: "",
  symbol: "",
  supply: "",
  decimals: 9,
  freezeAuthority: true,
};

export default function TokenForm() {
  const wallet = useWallet();
  const [formData, setFormData] = useState<TokenFormData>(initialFormState);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [tokenResult, setTokenResult] = useState<{
    tokenAddress: string;
    explorerUrl: string;
  } | null>(null);

  const updateField = <K extends keyof TokenFormData>(
    field: K,
    value: TokenFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!wallet.connected || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    if (!formData.name.trim() || !formData.symbol.trim()) {
      alert("Please fill in token name and symbol");
      return;
    }

    if (!formData.supply || Number(formData.supply) <= 0) {
      alert("Please enter a valid supply amount");
      return;
    }

    if (!image) {
      alert("Please upload a token image");
      return;
    }

    try {
      setLoading(true);
      setTokenResult(null);

      const imageUrl = await uploadToIPFS(image);

      const metadataUrl = await uploadMetadata({
        name: formData.name.trim(),
        symbol: formData.symbol.trim(),
        description: `${formData.name.trim()} token`,
        image: imageUrl,
      });

      const result = await createToken(
        wallet,
        formData.name.trim(),
        formData.symbol.trim(),
        metadataUrl,
        Number(formData.supply),
        formData.decimals,
        formData.freezeAuthority,
      );

      if (result) {
        setTokenResult(result);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <span className="card-label">Solana Devnet</span>
        <h1 className="card-title">Create Token</h1>
        <p className="card-subtitle">Create an SPL token on Solana devnet.</p>
      </div>

      <form onSubmit={handleSubmit} className="token-form">
        <div className="input-group">
          <label htmlFor="token-name" className="input-label">
            Token Name
          </label>
          <input
            id="token-name"
            className="input-field"
            type="text"
            placeholder="e.g. Super Coin"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="token-symbol" className="input-label">
            Symbol
          </label>
          <input
            id="token-symbol"
            className="input-field"
            type="text"
            placeholder="e.g. SPC"
            value={formData.symbol}
            onChange={(e) => updateField("symbol", e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="token-supply" className="input-label">
              Initial Supply
            </label>
            <input
              id="token-supply"
              className="input-field"
              type="number"
              placeholder="1000000"
              value={formData.supply}
              onChange={(e) => updateField("supply", e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="token-decimals" className="input-label">
              Decimals
            </label>
            <input
              id="token-decimals"
              className="input-field"
              type="number"
              placeholder="9"
              value={formData.decimals}
              onChange={(e) => updateField("decimals", Number(e.target.value))}
              min="0"
              max="9"
              required
            />
          </div>
        </div>

        <div
          className="toggle-group"
          onClick={() => updateField("freezeAuthority", !formData.freezeAuthority)}
          role="switch"
          aria-checked={formData.freezeAuthority}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              updateField("freezeAuthority", !formData.freezeAuthority);
            }
          }}
          id="freeze-authority-toggle"
        >
          <span className="toggle-text">Freeze Authority</span>
          <div className={`toggle-track ${formData.freezeAuthority ? "active" : ""}`}>
            <div className="toggle-thumb" />
          </div>
        </div>

        <ImageUpload image={image} onImageChange={setImage} />

        <button
          type="submit"
          className="submit-btn"
          disabled={loading || !wallet.connected}
          id="create-token-btn"
        >
          {loading && <span className="spinner" />}
          {loading
            ? "Creating Token..."
            : !wallet.connected
              ? "Connect Wallet to Continue"
              : "Create Token"}
        </button>

        {tokenResult && (
          <TokenSuccess
            tokenAddress={tokenResult.tokenAddress}
            explorerUrl={tokenResult.explorerUrl}
          />
        )}
      </form>
    </div>
  );
}
