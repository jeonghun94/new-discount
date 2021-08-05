import express from "express";
import { action, home } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/gate/:action").get(action);

export default globalRouter;