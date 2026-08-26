type Props = {
  walletAddress: string;
  setWalletAddress: (value: string) => void;
  getTokens: () => void;
};

export default function SearchBar({
  walletAddress,
  setWalletAddress,
  getTokens,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
      <input
        type="text"
        placeholder="Enter wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full md:flex-1 p-4 rounded-2xl bg-zinc-900 border border-zinc-700 outline-none focus:border-purple-500"
      />

      <button
        onClick={getTokens}
        className="bg-gradient-to-r from-purple-600 to-fuchsia-500 px-8 py-4 rounded-2xl font-medium hover:scale-105 transition-all"
      >
        Get Tokens
      </button>
    </div>
  );
}
