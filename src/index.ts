import logger from "jet-logger";

import ENV from "@src/common/constants/ENV";
import server from "@src/server";
import { connect } from "mongoose";

const port = process.env.PORT || ENV.Port;

const SERVER_START_MSG = "Express server started on port: " + ENV.Port.toString();

console.log("Connecting to MongoDB...");

connect(ENV.Mongodb)
  .then(() => {
    console.log("MongoDB connected!");
    const port = process.env.PORT || ENV.Port;
    server.listen(port, () => {
      console.log("Server listening on port " + port);
      logger.info(SERVER_START_MSG);
    });
  })
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.err("Erreur de connexion MongoDB: " + message);
    process.exit(1);
  });
