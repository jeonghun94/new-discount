import express from "express";
import {
  login,
  logout,
  mypage,
  notSupport,
  password,
  searchInCar,
} from "../controllers/globalController";
import { protectorMiddleware } from "../middleware";

const globalRouter = express.Router();
globalRouter.route("/").post(login).get(login);
globalRouter.route("/logout").get(logout);
globalRouter.route("/search-in-car").post(searchInCar);

// 프로텍트 미들웨어를 사용하는 경우
globalRouter.route("/my-page").all(protectorMiddleware).get(mypage);
globalRouter
  .route("/password")
  .all(protectorMiddleware)
  .get(password)
  .put(password);
globalRouter.route("/not-support").all(protectorMiddleware).get(notSupport);

export default globalRouter;
