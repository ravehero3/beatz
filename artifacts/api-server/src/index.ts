import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");

import app from "./app";
import { logger } from "./lib/logger";
import { runMigrations } from "./lib/migrate";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

runMigrations()
  .then(() => {
    logger.info("Migrations applied");
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    const dbUrl = process.env["DATABASE_URL"] ?? "";
    const ipv6Pattern = /\[?[0-9a-f]{4}:[0-9a-f]{4}:/i;
    if (err.code === "ENETUNREACH" && ipv6Pattern.test(dbUrl)) {
      logger.error(
        "DATABASE_URL contains an IPv6 address (Render Internal URL). " +
        "Go to your Render Postgres dashboard → Connections → copy the " +
        "External Database URL and set it as DATABASE_URL in your web service environment.",
      );
    } else {
      logger.error({ err }, "Migration failed, aborting startup");
    }
    process.exit(1);
  });
