'use client';

import { FallbackProps } from 'react-error-boundary';
import * as Sentry from '@sentry/browser';

export default function GlobalError({ error, resetErrorBoundary }: FallbackProps) {
  // Capture the exception with Sentry
  Sentry.captureException(error);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}