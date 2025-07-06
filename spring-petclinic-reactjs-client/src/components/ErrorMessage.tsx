export interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">Error</h4>
      <p>{error}</p>
      {onRetry && (
        <button className="btn btn-outline-danger" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
