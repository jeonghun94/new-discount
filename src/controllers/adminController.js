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
    res.render("admin/sale-coupon", { pageTitle: "관리기능" });
  }
};
