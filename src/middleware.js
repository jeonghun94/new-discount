require("dotenv").config();

export const localsVariable = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.COOKIES = req.cookies;
  res.locals.CCTV_CNT = process.env.CCTV_CNT;
  res.locals.SERVER_IP = process.env.SERVER_IP;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
