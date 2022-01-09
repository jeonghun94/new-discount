import express from "express";
import {
  login,
  logout,
  mypage,
  password,
  searchInCar,
} from "../controllers/globalController";

const globalRouter = express.Router();
globalRouter.route("/").post(login).get(login);
globalRouter.route("/search-in-car").post(searchInCar);
globalRouter.route("/my-page").get(mypage);
globalRouter.route("/password").get(password);
globalRouter.route("/logout").get(logout);

export default globalRouter;
