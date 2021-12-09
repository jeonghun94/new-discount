import express from "express";
import { action, getRenderHome, postRenderHome } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/gate").get(action);
globalRouter.route("/").post(postRenderHome);
globalRouter.route("/:level").get(getRenderHome);

export default globalRouter;