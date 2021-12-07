import express from "express";
import { action, getRenderHome, postRenderHome } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/").post(postRenderHome).get(getRenderHome);
globalRouter.route("/gate").get(action);

export default globalRouter;