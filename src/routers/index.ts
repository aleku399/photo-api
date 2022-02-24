import * as express from "express";

import photos from "../photo/router";

const router = express.Router();

router.use("/api", photos);

export default router;
