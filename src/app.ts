import * as bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import * as dotenv from "dotenv-safe";
import express from "express";
import helmet from "helmet";
import { corsOptions, expressLogger, logger, port } from "./config";
import { catchErrors } from "./errors";
import { cleanUpReqBody } from "./middleware/cleanUpReqBody";
import routers from "./routers";

dotenv.config();

const app = express();

app.set("trust proxy", "loopback");
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(expressLogger);
app.use(cleanUpReqBody);
app.use(routers);

app.use(catchErrors);

app.listen(port, () => {
  logger.info(`Listening on http://localhost:${port}. Press CTRL-C to stop\n`);
});

export default app;
