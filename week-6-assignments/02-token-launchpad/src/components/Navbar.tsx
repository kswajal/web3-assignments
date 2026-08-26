import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo" aria-hidden="true">
          SOL
        </span>
        <span className="navbar-title">Token Launchpad</span>
        <span className="navbar-dot" aria-hidden="true" />
        <span className="navbar-subtitle">Solana</span>
      </div>

      <WalletMultiButton />
    </nav>
  );
}
