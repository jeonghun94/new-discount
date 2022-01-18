import { DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { ExcelJS, Workbook } from "exceljs";

export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;
  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_CAR_NO(inCarNo));
  res.send({ result });
};

export const searchInSeqNo = async (req, res) => {
  const { inSeqNo } = req.body;

  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_SEQ_NO(inSeqNo));
  const freeCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_FREE_COUPON);
  const payCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_PAY_COUPON);
  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );
  res.send({ result, freeCouponList, payCouponList, discountList });
};

export const deleteList = async (req, res) => {
  const { idx, inSeqNo } = req.body;

  await executeUpdate(DISCOUNT_QUERY.DELETE_LIST(idx));
  console.log(`DELETE PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

export const insertList = async (req, res) => {
  const { inSeqNo, couponType } = req.body;
  const { shopCode } = req.session.user;
  const obj = {
    shopCode,
    inSeqNo,
    couponType,
  };

  await executeUpdate(DISCOUNT_QUERY.INSERT_LIST(obj));
  console.log(`INSERT PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

export const main = async (req, res) => {
  res.render("discount/main", { pageTitle: "할인 등록" });
};

export const excel = async (req, res) => {
  const { startDate, endDate, inCarNo } = req.query;

  const obj = {
    startDate: "2022-01-18",
    endDate: "2022-01-18",
    inCarNo: "",
    shopCode: req.session.user.shopCode,
  };

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");

  worksheet.columns = [
    { header: "차량번호", key: "inCarNo", width: 15 },
    { header: "할인종류", key: "dcName", width: 15 },
    { header: "할인일시", key: "dcTime", width: 20 },
    { header: "입차일시", key: "inTime", width: 20 },
    { header: "출차일시", key: "outTime", width: 20 },
  ];

  const result = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_HISTORY(obj)
  );

  result.map((item) => {
    worksheet.addRow(item);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader("Content-Disposition", "attachment; filename=sdsds.xlsx");

  await workbook.xlsx.write(res);

  res.end();
};

export const history = async (req, res) => {
  const {
    method,
    body: { startDate, endDate, inCarNo },
  } = req;

  if (method === "POST") {
    const obj = {
      startDate,
      endDate,
      inCarNo,
      shopCode: req.session.user.shopCode,
    };

    const result = await executeQuery(
      DISCOUNT_QUERY.SEARCH_DISCOUNT_HISTORY(obj)
    );

    res.send({ result });
  } else {
    res.render("discount/history", { pageTitle: "할인 내역" });
  }
};
