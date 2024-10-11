import React from 'react';

// Update the ErrorProps interface to make `error` optional
interface ErrorProps {
  error?: Error; // Changed from `error: Error;` to `error?: Error;`
  reset: () => void;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset }) => {
  return (
    <div>
      <h1>Something went wrong!</h1>
      {/* Add a check to ensure `error` is defined before accessing `error.message` */}
      {error ? <p>{error.message}</p> : <p>An unexpected error occurred.</p>}
      <button onClick={reset}>Try Again</button>
    </div>
  );
}

export default ErrorPage;