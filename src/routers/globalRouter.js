import express from "express";
import { excel } from "../controllers/discountController";
import {
  login,
  logout,
  mypage,
  password,
  searchInCar,
} from "../controllers/globalController";
import { protectorMiddleware } from "../middleware";

const globalRouter = express.Router();
globalRouter.route("/").post(login).get(login);
globalRouter.route("/excel").get(excel);
globalRouter.route("/search-in-car").all(protectorMiddleware).post(searchInCar);
globalRouter.route("/my-page").all(protectorMiddleware).get(mypage);
globalRouter
  .route("/password")
  .all(protectorMiddleware)
  .get(password)
  .put(password);
globalRouter.route("/logout").all(protectorMiddleware).get(logout);

export default globalRouter;
