import { ADMIN_QUERY, DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery } from "../server";
import { excelUpload } from "../util";

export const saleCouponExcel = async (req, res) => {
  const { method } = req;

  if (method === "POST") {
    const {
      file,
      session: { user },
    } = req;

    try {
      excelUpload(file.originalname, user);
      res.redirect("/discount/main2");
    } catch (error) {
      res.send(error.message);
    }
  } else {
    const saleCouponList = await executeQuery(ADMIN_QUERY.SALE_COUPON_LIST());
    const payCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_PAY_COUPON);
    const shopList = await executeQuery(LOCALS_QUERY.USER_LIST);
    const tableHead = [
      "매장명",
      "할인권명",
      "등록개수",
      "등록금액",
      "등록일시",
    ];

    res.render("admin/sale-coupon", {
      pageTitle: "관리자",
      saleCouponList,
      payCouponList,
      shopList,
      tableHead,
    });
  }
};
