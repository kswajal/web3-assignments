import { useState } from "react";

type Props = {
  token: any;
};

export default function TokenCard({ token }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = Boolean(token.image) && !imageFailed;
  const tokenName = token.name || "Unknown Token";
  const symbol = token.symbol || "UNKNOWN";

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-lg hover:border-purple-500 transition-all">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800">
            {hasImage ? (
              <img
                src={token.image}
                alt={tokenName}
                className="h-full w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <span className="text-lg font-bold text-purple-300">
                {symbol.charAt(0)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-2xl font-bold text-white">
              {tokenName}
            </h2>

            <p className="break-words text-zinc-400 uppercase">{symbol}</p>
          </div>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="text-zinc-400 text-sm">Balance</p>

          <p className="break-all text-3xl font-bold">{token.balance}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-purple-400 text-sm break-all">ATA: {token.ata}</p>

        <p className="text-zinc-500 text-sm break-all mt-2">
          Mint: {token.mint}
        </p>
      </div>
    </div>
  );
}
