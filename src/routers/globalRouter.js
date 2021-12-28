import express from "express";
import { login, postRenderHome, searchDiscountInCarNo, test } from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/").post(postRenderHome).get(test);
globalRouter.route("/main2").post(searchDiscountInCarNo);
globalRouter.route("/main").post(login);

export default globalRouter;