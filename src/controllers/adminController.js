import { ADMIN_QUERY, DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { excelDownload, excelSaleCoupon, excelUpload } from "../util";

export const saleCoupon = async (req, res) => {
  const { method } = req;
  let resultMessage;

  if (method === "POST") {
    const {
      file,
      session: { user },
      body,
    } = req;

    if (file === undefined) {
      await executeUpdate(
        DISCOUNT_QUERY.ADD_DISCOUNT_COUPON({ ...user, ...body })
      );
      await executeUpdate(
        DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY({ ...user, ...body })
      );
    } else {
      const list = await excelUpload(file.originalname, user);
      resultMessage = await excelSaleCoupon(list, user);
    }

    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...body })
    );

    res.send({ saleCouponList, resultMessage });
  } else if (method === "GET") {
    const { type } = req.query;
    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...req.query })
    );
    const payCouponList = await executeQuery(
      DISCOUNT_QUERY.SEARCH_PAY_COUPON()
    );
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

// 할인 내역 엑셀 다운로드
export const saleCouponExcel = async (req, res) => {
  const obj = {
    ...req.query,
    shopCode: req.session.user.shopCode,
    header: (style) => [
      { header: "매장명", key: "shopName", width: 20 },
      {
        header: "할인권명",
        key: "dcName",
        width: 15,
        style: { alignment: { horizontal: "left" } },
      },
      { header: "등록개수", key: "saleCouponQty", width: 15 },
      {
        header: "등록금액",
        key: "saleCouponAmt",
        width: 20,
        style,
      },
      {
        header: "출차일시",
        key: "insDate",
        width: 20,
        style,
      },
    ],
    fileName: "할인권판매내역",
  };
  const data = await executeQuery(
    ADMIN_QUERY.SALE_COUPON_LIST({ ...req.query })
  );
  await excelDownload(res, obj, data);
  console.log(`HISTORY EXCEL PS131 ${JSON.stringify(req.query)}`);
};
