import moduleAlias from "module-alias";

const isProd = process.env.NODE_ENV === "production";
const aliases = {
  "@src/*": isProd ? "dist/*" : "src/*",
  "@common/*": isProd ? "dist/common/*" : "src/common/*",
  "@models/*": isProd ? "dist/models/*" : "src/models/*",
  "@routes/*": isProd ? "dist/routes/*" : "src/routes/*",
  "@services/*": isProd ? "dist/services/*" : "src/services/*",
  "@repos/*": isProd ? "dist/repos/*" : "src/repos/*",
};

moduleAlias.addAliases(aliases);

import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";
import BaseRouter from "@src/routes/index";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/util/route-errors";
import { NodeEnvs } from "@src/common/constants";
import cors from "cors";
import Paths from "@src/common/constants/Paths";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "https://api.justin.intebec.ca", "https://justin.intebec.ca", "https://devweb3-final-frontend.onrender.com"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (NodeEnvs.Dev) {
  app.use(morgan("dev"));
}

if (NodeEnvs.Production) {
  app.use(helmet());
}

app.get("/api-docs/", async (req, res) => {
  res.set("Content-Security-Policy", "script-src blob:");
  res.set("Content-Security-Policy", "worker-src blob:");
  res.sendFile(path.join(__dirname, "index.html"));
});

// redirige vers api-docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
app.use(Paths.Base, BaseRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (NodeEnvs.Dev) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

export default app;
