export interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{message}</span>
        </div>
        <div className="mt-2">{message}</div>
      </div>
    </div>
  );
}
