import { camelCase } from "lodash";
import { Workbook } from "exceljs";

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
