import express from "express";
import {
  saleCoupon,
  saleCouponExcel,
  settingAccount,
} from "../controllers/adminController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter
  .route("/sale-coupon")
  .all(protectorMiddleware)
  .get(saleCoupon)
  .post(uploadFiles.single("file"), saleCoupon);
adminRouter
  .route("/sale-coupon/excel")
  .all(protectorMiddleware)
  .get(saleCouponExcel);
adminRouter
  .route("/setting-account")
  .all(protectorMiddleware)
  .get(settingAccount);
export default adminRouter;
