import express from "express";
import { action, getRenderHome, postRenderHome, test } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/").post(postRenderHome).get(test);
// globalRouter.route("/gate").get(action);
// globalRouter.route("/:level").get(getRenderHome);

export default globalRouter;