import multer from "multer";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/sale-coupon");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const localsVariable = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.COOKIES = req.cookies;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    res.locals.user = req.session.user;
    return next();
  } else {
    res.redirect("/permission");
  }
};

export const uploadFiles = multer({ storage });
