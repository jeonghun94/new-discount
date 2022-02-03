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

    //console.log({ ...user, ...body });
    await executeUpdate(
      DISCOUNT_QUERY.ADD_DISCOUNT_COUPON({ ...user, ...body })
    );
    await executeUpdate(
      DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY({ ...user, ...body })
    );
    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...body })
    );

    res.send({ saleCouponList });
    // try {
    //   excelUpload(file.originalname, user);
    //   res.redirect("/discount/main2");
    // } catch (error) {
    //   res.send(error.message);
    // }
  } else {
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
