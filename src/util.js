import path from "path";
import { camelCase } from "lodash";
import { Workbook } from "exceljs";
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
  const rows = [];
  worksheet.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      if (row.number > 1) {
        rows.push(row.values);
      }
    });
  });
  console.log(`Excel Data Return: ${rows}`);
  return rows;
};

export const excelSaleCoupon = async (list, user) => {
  const erroList = [];
  for (const item of list) {
    try {
      const shopCode = await executeQuery(
        LOCALS_QUERY.SEARCH_SHOP_CODE_BY_NAME(item[1])
      );

      const couponInfo = await executeQuery(
        LOCALS_QUERY.SEARCH_COUPON_TYPE_BY_NAME(item[2])
      );

      if (shopCode.length === 0) {
        throw new SaleCouponException(1, "매장명 오류");
      }

      if (couponInfo.length === 0) {
        throw new SaleCouponException(2, `할인권명 오류`);
      }

      if (typeof item[3] !== "number") {
        throw new SaleCouponException(3, `수량 오류`);
      }

      const stock = item[3];

      const obj = {
        ...couponInfo[0],
        ...user,
        stock,
        shopCodeIn: shopCode[0].shopCode,
      };

      await executeUpdate(DISCOUNT_QUERY.ADD_DISCOUNT_COUPON(obj));
      await executeUpdate(DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY(obj));
    } catch (error) {
      erroList.push(error.message);
    }
  }

  let failList = "";
  const result = erroList.reduce((accu, curr) => {
    accu.set(curr, (accu.get(curr) || 0) + 1);
    return accu;
  }, new Map());

  for (let [key, value] of result.entries()) {
    failList += `${key} ${value}건, `;
  }

  const failMessage =
    failList.length > 0 ? `사유: ${failList.slice(0, -2)}` : "";

  return `${list.length}건중 ${list.length - erroList.length}건 등록, ${
    erroList.length
  }건 실패\n${failMessage}`;
};

function SaleCouponException(code, message) {
  this.code = code;
  this.message = message;
}
