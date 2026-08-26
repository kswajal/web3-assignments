interface TokenSuccessProps {
  tokenAddress: string;
  explorerUrl: string;
}

export default function TokenSuccess({ tokenAddress, explorerUrl }: TokenSuccessProps) {
  return (
    <div className="success-card" id="success-card">
      <div className="success-header">
        <div className="success-icon" aria-hidden="true">
          ✓
        </div>
        <span className="success-title">Token Created</span>
      </div>

      <div className="success-address">{tokenAddress}</div>

      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="success-link"
        id="explorer-link"
      >
        View on Explorer
        <span className="success-link-arrow">→</span>
      </a>
    </div>
  );
}
