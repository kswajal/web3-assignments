import "./App.css";
import Navbar from "./components/Navbar";
import TokenForm from "./components/TokenForm";

function App() {
  return (
    <div className="app-container">
      <div className="noise-overlay" aria-hidden="true" />

      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <Navbar />

      <main className="main-content">
        <TokenForm />
      </main>

      <footer className="footer">
        <p className="footer-text">
          Built on{" "}
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Solana
          </a>{" "}
          · Devnet
        </p>
      </footer>
    </div>
  );
}

export default App;
