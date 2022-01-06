import express from "express";
import {
  login,
  logout,
  mypage,
  password,
} from "../controllers/globalController";

const globalRouter = express.Router();
globalRouter.route("/").post(login).get(login);
globalRouter.route("/my-page").get(mypage);
globalRouter.route("/password").get(password);
globalRouter.route("/logout").get(logout);

export default globalRouter;
