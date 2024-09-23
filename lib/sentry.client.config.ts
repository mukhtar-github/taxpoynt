import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Replace with your actual Sentry DSN
  tracesSampleRate: 1.0,       // Adjust based on your needs
});