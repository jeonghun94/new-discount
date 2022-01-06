require("dotenv").config();

export const localsVariable = (req, res, next) => {
  console.log(req.cookies);

  res.locals.COOKIES = req.cookies;
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.CCTV_CNT = process.env.CCTV_CNT;
  res.locals.SERVER_IP = process.env.SERVER_IP;
  next();
};
