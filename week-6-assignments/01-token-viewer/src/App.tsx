import { useState } from "react";

import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

import SearchBar from "./components/SearchBar";
import TokenCard from "./components/TokenCard";

import { getTokenMetadata } from "./lib/getTokenMetadata";
import { fetchJsonMetadata } from "./lib/fetchJsonMetadata";

function App() {
  const [walletAddress, setWalletAddress] = useState("");

  const [tokens, setTokens] = useState<any[]>([]);

  const connection = new Connection(clusterApiUrl("devnet"));

  async function getTokens() {
    try {
      const response = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(walletAddress),
        {
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          ),
        },
      );

      const tokenData = await Promise.all(
        response.value.map(async (token) => {
          const mint = token.account.data.parsed.info.mint;

          const balance = token.account.data.parsed.info.tokenAmount.uiAmount;

          const metadata = await getTokenMetadata(connection, mint);

          let name = "Unknown Token";
          let symbol = "UNKNOWN";
          let image = "";

          if (metadata?.uri) {
            const json = await fetchJsonMetadata(metadata.uri);

            name = json?.name || metadata.name;

            symbol = json?.symbol || metadata.symbol;

            image = json?.image || "";
          }

          return {
            ata: token.pubkey.toBase58(),
            mint,
            balance,
            name,
            symbol,
            image,
          };
        }),
      );

      setTokens(tokenData);
    } catch (err) {
      console.log(err);

      alert("Invalid wallet address");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12">
          Solana Token Viewer
        </h1>

        <SearchBar
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          getTokens={getTokens}
        />

        <div className="mt-10 space-y-6">
          {tokens.map((token, index) => (
            <TokenCard key={index} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
