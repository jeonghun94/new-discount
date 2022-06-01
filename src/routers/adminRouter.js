import express from "express";
import {
  saleCoupon,
  saleCouponExcel,
  settingAccount,
  userAuth,
} from "../controllers/adminController";
import { uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter
  .route("/sale-coupon")
  .get(saleCoupon)
  .post(uploadFiles.single("file"), saleCoupon);
adminRouter.route("/sale-coupon/excel").get(saleCouponExcel);
adminRouter.route("/setting-account").get(settingAccount);
adminRouter.route("/discount/user-auth").get(userAuth).post(userAuth);
export default adminRouter;
