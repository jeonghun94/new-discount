import { ADMIN_QUERY, DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { excelUpload } from "../util";

export const saleCoupon = async (req, res) => {
  const { method } = req;

  if (method === "POST") {
    const {
      file,
      session: { user },
      body,
    } = req;

    try {
      if (file === undefined) {
        await executeUpdate(
          DISCOUNT_QUERY.ADD_DISCOUNT_COUPON({ ...user, ...body })
        );
        await executeUpdate(
          DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY({ ...user, ...body })
        );
      } else {
        console.log("업로드시작");
        await excelUpload(file.originalname, user);
        console.log("업로드완료");
      }
    } catch (error) {
      res.send(error.message);
    } finally {
      console.log("쿠폰 등록 완료");
      const saleCouponList = await executeQuery(
        ADMIN_QUERY.SALE_COUPON_LIST({ ...body })
      );

      console.log(saleCouponList.length, "리스트개수");
      res.send({ saleCouponList });
    }
  } else if (method === "GET") {
    const { type } = req.query;
    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...req.query })
    );
    const payCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_PAY_COUPON);
    const shopList = await executeQuery(LOCALS_QUERY.USER_LIST);
    const tableHead = [
      "매장명",
      "할인권명",
      "등록개수",
      "등록금액",
      "등록일시",
    ];

    if (type === undefined) {
      res.render("admin/sale-coupon", {
        pageTitle: "관리자",
        saleCouponList,
        payCouponList,
        shopList,
        tableHead,
      });
    } else {
      res.send({ saleCouponList });
    }
  }
};

const getSaleCoupon = (req, res) => {
  console.log(req, "함수화");
};