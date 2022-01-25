import express from "express";
import { saleCouponExcel } from "../controllers/adminController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter.route("/").all(protectorMiddleware).get(saleCouponExcel);
// masterRouter
//   .route("/sale-coupon")
//   .all(protectorMiddleware)
//   .get(main2)
//   .post(uploadFiles.single("saleCoupon"), saleCouponExcel);

export default adminRouter;
