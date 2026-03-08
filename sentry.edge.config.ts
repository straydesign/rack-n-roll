import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c923b7ccca307788fc503bec7eb5508d@o4511007213289472.ingest.us.sentry.io/4511007319130112",
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
