# Solana Devnet Token Launchpad

A lightweight Web3 application to create and launch custom SPL tokens on Solana Devnet with on-chain Metaplex metadata and IPFS image hosting.

---

## What this project does

This launchpad allows you to create an SPL token on Solana devnet in a single transaction:
1. Uploads token image & metadata JSON to IPFS (via Pinata).
2. Generates a new Mint keypair and calculates minimum rent exemption lamports.
3. Initializes the token mint with custom decimals and freeze authority settings.
4. Derives and creates the Associated Token Account (ATA) for your connected wallet.
5. Mints the initial token supply directly to your ATA.
6. Attaches on-chain metadata (name, symbol, IPFS URI) using the Metaplex Token Metadata program.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Solana SDKs**: `@solana/web3.js`, `@solana/spl-token`
- **Metadata**: `@metaplex-foundation/mpl-token-metadata`
- **Wallet Connection**: `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`
- **Decentralized Storage**: Pinata (IPFS)

---

## Transaction Flow

All necessary instructions are bundled into a single atomic Solana transaction:

```
[Connect Wallet]
       │
       ▼
[Upload Image & Metadata to IPFS] ──► Returns IPFS URI
       │
       ▼
[Build Atomic Transaction]
  ├── 1. SystemProgram.createAccount (Mint account with rent exemption)
  ├── 2. createInitializeMintInstruction (Decimals & mint/freeze authority)
  ├── 3. createAssociatedTokenAccountInstruction (User's ATA)
  ├── 4. createMintToInstruction (Mint initial supply to ATA)
  └── 5. Metaplex CreateMetadataAccountV3 (Attach name, symbol, IPFS URI)
       │
       ▼
[Sign & Send Transaction] ──► Confirmed on Solana Devnet
```

---

## Project Structure

```txt
src/
├── assets/
├── components/
│   ├── ImageUpload.tsx      # Image file picker & preview with memory cleanup
│   ├── Navbar.tsx           # Header with wallet connect button
│   ├── TokenForm.tsx        # Main token configuration form
│   ├── TokenSuccess.tsx     # Created token address & explorer link
│   └── WalletProvider.tsx   # Solana wallet context setup
├── lib/
│   ├── createToken.ts       # Solana web3 & Metaplex instruction builder
│   └── uploadToIPFS.ts      # Pinata IPFS file & metadata JSON uploaders
├── App.tsx                  # Root layout
├── App.css                  # Custom styling
├── bootstrap.tsx            # App entry with WalletProvider
├── main.tsx                 # Polyfills & bootstrap launcher
└── polyfills.ts             # Buffer polyfill for browser Web3
```

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd 02-token-launchpad
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PINATA_JWT=your_pinata_jwt_token_here
```

> Get a free API JWT token from [Pinata Cloud](https://app.pinata.cloud/developers/api-keys).

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

---

## Testing on Devnet

1. Install [Phantom Wallet](https://phantom.app/) (or Solflare).
2. Open wallet settings -> **Developer Settings** -> Turn on **Testnet / Devnet mode**, then switch active network to **Solana Devnet**.
3. Request devnet SOL to your wallet address:
   ```bash
   solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
   ```
   *(Or use the [Solana Faucet](https://faucet.solana.com/))*
4. Connect wallet on the launchpad, fill in token details, upload an image, and click **Create Token**.
5. Approve the transaction in your wallet and view your new token on [Solana Explorer](https://explorer.solana.com/?cluster=devnet).

---

## License

MIT
