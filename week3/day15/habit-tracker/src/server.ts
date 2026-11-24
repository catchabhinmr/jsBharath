import { buildApp } from "./app.js";
const app = buildApp();
import { config } from "./config.js";
const start = async () => {
  try {
    await app.listen({
      port: (config.PORT) || 3000,
      host: config.HOST
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();