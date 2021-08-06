require("dotenv").config();

export const localsVariable = (req, res, next) => {
    res.locals.CCTV_CNT = process.env.CCTV_CNT;
    res.locals.SERVER_IP = process.env.SERVER_IP;
    next();
};