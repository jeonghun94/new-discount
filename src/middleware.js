// import config from "./mssqlConfig";
// import sql from "mssql";

// const lotName = (pool, res, next) => {
//     return pool.request()
//         .query('SELECT parkname as parkName FROM ps020')
//         .then(result => {
//             const arr = JSON.stringify(result.recordset);
//             const obj = JSON.parse(arr);
//             res.locals.lotName = obj[0].parkName;
//             next();
//         });
// };

// export const localsMiddleware = (req, res, next) => {
//     sql.connect(config).then(pool => {
//         lotName(pool,res,next);
//     });
// };

