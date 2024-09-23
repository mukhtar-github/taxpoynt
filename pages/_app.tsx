import '../lib/sentry.server.config';  // Initialize Sentry for server
import '../lib/sentry.client.config';  // Initialize Sentry for client
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;