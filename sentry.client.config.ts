import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://your-sentry-dsn",
  tracesSampleRate: 1.0,
  // other configurations
});
