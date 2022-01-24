import { camelCase } from "lodash";
import { Workbook } from "exceljs";
import path from "path";
import { executeQuery, executeUpdate } from "./server";
import { DISCOUNT_QUERY, LOCALS_QUERY } from "./query";
const root = path.dirname(__dirname);

export const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

export const excelDownload = async (res, obj, data) => {
  const style = {
    numFmt: "yyyy-mm-dd hh:mm:ss",
    alignment: { horizontal: "left" },
  };

  const date = new Date();
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const today = `${year}${month}${day}`;

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Sheet");
  worksheet.columns = obj.header(style);

  data.map((item) => {
    worksheet.addRow(item);
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${encodeURI(obj.fileName)}_${today}.xlsx`
  );

  await workbook.xlsx.write(res);

  res.end();
};

export const excelUpload = async (fileName, user) => {
  const workbook = new Workbook();
  const worksheet = await workbook.xlsx.readFile(
    `${root}\\uploads\\${fileName}`
  );
  worksheet.eachSheet((sheet) => {
    sheet.eachRow(async (row) => {
      const list = row.values;

      // shopName으로 shopCode 조회
      const shopCode = await executeQuery(
        LOCALS_QUERY.SEARCH_SHOP_CODE_BY_NAME(list[1])
      );

      // dcName으로 couponType 조회
      const couponInfo = await executeQuery(
        LOCALS_QUERY.SEARCH_COUPON_TYPE_BY_NAME(list[2])
      );

      // stock 조회
      const stock = list[3];

      const obj = {
        shopCode: shopCode[0].shopCode,
        ...couponInfo[0],
        stock,
        ...user,
      };

      console.log(obj);
      await executeUpdate(DISCOUNT_QUERY.ADD_DISCOUNT_COUPON(obj));
      await executeUpdate(DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY(obj));
    });
  });
};
