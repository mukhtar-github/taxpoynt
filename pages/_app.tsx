import type { AppProps } from 'next/app';
import * as Sentry from '@sentry/nextjs';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;