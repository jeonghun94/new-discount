export const LOCALS_QUERY = {
  USER_LIST: `SELECT ShopCode,
                            ShopName
                    FROM   ps130 `,
  USER_LOGGED_IN: (id, pw) => `SELECT *
                                FROM   ps130
                                WHERE  id = '${id}'
                                    AND pwd = '${pw}'`,
  USER_COUPON_STOCK_INFO: (obj) => {
    const nullCheck = obj.nullCheck ? "AND b.used IS NULL" : "AND b.used = 'Y'";
    return `SELECT a.DcName,
                    Replace(CONVERT(VARCHAR, CONVERT(MONEY, b.Stock), 1), '.00', '') AS Stock
            FROM   ps132 a
                  LEFT OUTER JOIN ps135 b
                                ON a.coupontype = b.coupontype
            WHERE  b.shopcode = '${obj.shopCode}'
                 ${nullCheck}
                  AND a.paytype = '02'`;
  },
  USER_PASSWORD_UPDATE: (shopCode, newPassword) => `UPDATE ps130
                                                    SET pwd = '${newPassword}',
                                                        updpgm = 'WEB',
                                                        upddate = (select convert(varchar, GETDATE(),120))
                                                    WHERE shopcode = '${shopCode}'`,
  SEARCH_IN_CAR: () => `SELECT TOP (10)*
                        FROM   ps500
                        WHERE  procdate = CONVERT(CHAR(8), Getdate(), 112)
                              AND tktype = '1'
                              AND intksts = '1'
                        ORDER  BY inseqno DESC `,
  SEARCH_SHOP_CODE_BY_NAME: (shopName) => `SELECT ShopCode
                                            FROM   ps130
                                            WHERE  shopname = '${shopName}'`,
  SEARCH_COUPON_TYPE_BY_NAME: (couponType) => `SELECT CouponType, 
                                                      SaleAmt
                                                FROM   ps132
                                                WHERE  dcname = '${couponType}'
                                                        AND paytype = '02' `,
  SEARCH_PAY_TYPE: (couponType) => `SELECT PayType
                                            FROM   ps132
                                            WHERE  coupontype = '${couponType}'`,
};

export const DISCOUNT_QUERY = {
  SEARCH_IN_CAR_NO: (inCarNo) => {
    return `SELECT result.*
            FROM   (SELECT Row_number()
                            OVER (
                              partition BY a.incarno
                              ORDER BY a.procdate ASC, a.proctime ASC)AS RowNo,
                          a.InCarNo,
                          CASE a.tktype
                            WHEN 1 THEN '일반차량'
                            WHEN 2 THEN '정기차량'
                            WHEN 3 THEN '방문차량'
                            ELSE '미지정차량'
                          END                                         AS TkType,
                          a.ProcDate,
                          a.ProcTime,
                          a.InSeqNo,
                          a.InCarPicName,
                          b.ParkName,
                          c.UnitName,
                          a.InsDate
                    FROM   ps500 a
                          LEFT OUTER JOIN ps020 b
                                        ON a.systemno = b.systemno
                          LEFT OUTER JOIN ps070 c
                                        ON a.mainunitno = c.mainunitno
                    WHERE  a.incarno LIKE '%${inCarNo}%'
                          AND a.intksts IN( '1', '3' )
                          AND a.tktype IN( '1', '3' )
                          AND a.procdate > Dateadd(ww, -1, Getdate())) result
            WHERE  result.rowno = '1'
            ORDER  BY procdate DESC,
                      proctime DESC 
        `;
  },
  SEARCH_IN_SEQ_NO: (inSeqNo) => {
    return `SELECT * FROM PS500 WHERE inseqno = ${inSeqNo}`;
  },
  SEARCH_FREE_COUPON: (obj) => {
    const opiton = obj ? `AND b.shopCode = '${obj.shopCode}'` : "";
    const nullCheck = obj.nullCheck ? "AND b.used IS NULL" : "AND b.used = 'Y'";
    return `SELECT a.dcName,
                    a.couponType,
                    Replace(CONVERT(VARCHAR, CONVERT(MONEY, b.stock), 1), '.00', '') AS stock
            FROM   ps132 a
                  LEFT OUTER JOIN ps135 b
                                ON a.coupontype = b.coupontype
            WHERE  a.paytype = '01'
                    ${nullCheck}
                    ${opiton}`;
  },
  SEARCH_PAY_COUPON: (obj) => {
    const opiton = obj ? `AND b.shopCode = '${obj.shopCode}'` : "";
    const nullCheck = obj.nullCheck ? "AND b.used IS NULL" : "AND b.used = 'Y'";
    // const holidayCoupons =
    //   obj.holidayCoupons !== null
    //     ? `AND a.couponType in (${obj.holidayCoupons})`
    //     : "";
    const user = `SELECT a.dcName,
                          a.couponType,
                          Replace(CONVERT(VARCHAR, CONVERT(MONEY, b.stock), 1), '.00', '') AS stock
                  FROM   ps132 a
                        LEFT OUTER JOIN ps135 b
                                      ON a.coupontype = b.coupontype
                  WHERE  a.paytype = '02'
                          ${holidayCoupons + nullCheck + opiton}`;

    const admin = `SELECT * FROM PS132 WHERE paytype = '02'`;
    return obj ? user : admin;
  },
  SEARCH_DISCOUNT_LIST: (inSeqNo) => {
    return `SELECT CONVERT(DATETIME, a.ProcDate + ' ' + STUFF(STUFF(a.proctime, 3, 0, ':'), 6, 0, ':'), 120) as InTime,
                b.InCarNo,
                a.Idx,
                a.CouponType,
                c.DcName,
                d.ShopName
            FROM   ps134 a
                  LEFT OUTER JOIN ps500 b
                              ON a.inseqno = b.inseqno
                  LEFT OUTER JOIN ps132 c
                              ON a.coupontype = c.coupontype
                  LEFT OUTER JOIN ps130 d
                              ON a.shopcode = d.shopcode 
            WHERE a.InSeqNo = '${inSeqNo}'
            ORDER  BY a.idx DESC`;
  },
  DELETE_LIST: (idx) => `DELETE FROM PS134 WHERE idx = ${idx}`,
  INSERT_LIST: (obj) => {
    return `INSERT INTO ps134 
                    (procdate, 
                    proctime, 
                    inseqno, 
                    dcseqno, 
                    shopcode,  
                    coupontype, 
                    dcstatus) 
            VALUES  ((SELECT CONVERT(VARCHAR, Getdate(), 112)), 
                    (SELECT Replace(CONVERT(VARCHAR, Getdate(), 8), ':', '') ), 
                    '${obj.inSeqNo}', 
                    (SELECT Isnull(Max(dcseqno), 0) + 1 
                    FROM   ps134 
                    WHERE  inseqno = '${obj.inSeqNo}'), 
                    '${obj.shopCode}',
                    '${obj.couponType}',
                    '0')
      `;
  },
  UPDATE_COUPON_CNT: (obj) => {
    return `UPDATE ps135
            SET    stock = stock ${obj.payCnt !== undefined ? "-" : "+"} 1
            WHERE  shopcode = '${obj.shopCode}'
                  AND coupontype = '${obj.couponType}' `;
  },
  SEARCH_DISCOUNT_HISTORY: (obj) => {
    obj.startDate = obj.startDate.replace(/-/g, "");
    obj.endDate = obj.endDate.replace(/-/g, "");
    obj.inCarNo =
      obj.inCarNo === undefined ? "" : `AND a.incarno LIKE '%${obj.inCarNo}%'`;
    return `SELECT a.InCarNo, 
                  b.DcName, 
                  d.dcode_name as DcodeName,
                  CONVERT(DATETIME, c.procdate + ' ' + STUFF(STUFF(c.proctime, 3, 0, ':'), 6, 0, ':'), 120) as DcTime,
                  CONVERT(DATETIME, a.procdate + ' ' + STUFF(STUFF(a.proctime, 3, 0, ':'), 6, 0, ':'), 120) as InTime,
                  CONVERT(DATETIME, e.procdate + ' ' + STUFF(STUFF(e.proctime, 3, 0, ':'), 6, 0, ':'), 120) as OutTime,
                  a.InCarPicName,
                  e.OutCarPicName,
                  e.TotParkTime
            FROM   ps500 a 
                  LEFT OUTER JOIN ps134 c  
                                ON a.inseqno = c.inseqno  
                  LEFT OUTER JOIN ps132 b 
                                ON c.coupontype = b.coupontype  
                  LEFT OUTER JOIN ps011 d 
                                ON b.paytype = '0' + d.dcode_seq  
                                  AND d.mcode = 'z01' 
                  LEFT OUTER JOIN ps510 e 
                                ON a.inseqno = e.inseqno and e.TKPrtSts in ('2', '10', '11')
            WHERE c.procdate+c.ProcTime BETWEEN '${obj.startDate}'+'000000' AND '${obj.endDate}'+'235959'
                  AND c.shopcode = '${obj.shopCode}' 
                  ${obj.inCarNo}
            ORDER  BY c.procdate DESC, 
                      c.proctime DESC`;
  },
  CONDITION_CHECK: (obj) => {
    const option =
      obj.shopDuplication === "Y" ? `AND a.shopcode = '${obj.shopCode}'` : "";
    return `DECLARE @inSeqNo    INT,
                    @couponType INT,
                    @shopCode   VARCHAR(4)

            SET @couponType = ${obj.couponType}
            SET @inSeqNo = ${obj.inSeqNo}
            SET @shopCode = '${obj.shopCode}'

            SELECT  (SELECT paytype
                      FROM   ps132
                      WHERE  coupontype = @couponType) AS PayType,
                    (SELECT Isnull (Sum(CONVERT(INT, stock)), 0)
                      FROM   ps135
                      WHERE  coupontype = @couponType
                            AND shopcode = @shopCode)    AS CouponCnt,
                    (SELECT Isnull(Sum(CONVERT(INT, b.dcval) ), 0 )
                            + (SELECT dcval
                                FROM   ps132
                                WHERE  coupontype = @couponType)
                      FROM   ps134 a
                            LEFT OUTER JOIN ps132 b
                                          ON a.coupontype = b.coupontype
                      WHERE  a.inseqno = @inSeqNo ${option})     AS TotalDcVal,
                    (SELECT Count(*)
                      FROM   ps134 a
                            LEFT OUTER JOIN ps132 b
                                          ON a.coupontype = b.coupontype
                      WHERE  a.inseqno = @inSeqNo ${option})     AS TotalCnt,
                    (SELECT Count(*)
                      FROM   ps134 a
                            LEFT OUTER JOIN ps132 b
                                          ON a.coupontype = b.coupontype
                      WHERE  a.inseqno = @inSeqNo ${option}
                            AND b.paytype = '01')     AS FreeCnt,
                    (SELECT Count(*)
                      FROM   ps134 a
                            LEFT OUTER JOIN ps132 b
                                          ON a.coupontype = b.coupontype
                      WHERE  a.inseqno = @inSeqNo ${option}
                            AND b.paytype = '02')     AS PayCnt `;
  },
  SEARCH_DISCOUNT_REGISTER_CODE: (shopCode) => {
    return `select ShopCode as RegisterCode from PS134 where Idx = ${shopCode}`;
  },
  ADD_DISCOUNT_COUPON: (obj) => `UPDATE ps135 
                                  SET    stock = '${obj.stock}' 
                                  WHERE  coupontype = '${obj.couponType}'
                                  AND    shopcode = '${obj.shopCodeIn}' `,
  ADD_DISCOUNT_COUPON_HISTORY: (obj) => {
    return `INSERT INTO ps131
                                                      (systemno,
                                                      parkno,
                                                      procdate,
                                                      proctime,
                                                      coupontype,
                                                      shopcode,
                                                      salecouponqty,
                                                      salecouponamt,
                                                      inspgm,
                                                      insid,
                                                      insdate,
                                                      updpgm,
                                                      updid,
                                                      upddate,
                                                      dctype)
                                          VALUES      ('0001',
                                                      '01',
                                                      (SELECT CONVERT(VARCHAR, Getdate(), 112)),
                                                      (SELECT Replace(CONVERT(VARCHAR, Getdate(), 8), ':', '')),
                                                      '${obj.couponType}',
                                                      '${obj.shopCodeIn}',
                                                      '${obj.stock}',
                                                      ${Number(
                                                        obj.stock
                                                      )} * (SELECT saleamt
                                                            FROM   ps132
                                                            WHERE  coupontype = '${
                                                              obj.couponType
                                                            }'
                                                                    AND paytype = '02') ,
                                                      'WEB',
                                                      '${obj.shopName}',
                                                      (SELECT CONVERT (CHAR(19), Getdate(), 120)),
                                                      'WEB',
                                                      '${obj.shopName}',
                                                      (SELECT CONVERT (CHAR(19), Getdate(), 120)),
                                                      '2' )`;
  },
};

export const ADMIN_QUERY = {
  USER_LIST: () => `SELECT * FROM PS130`,
  SALE_COUPON_LIST: (obj) => {
    const today = "(SELECT CONVERT(VARCHAR(8), Getdate(), 112))";

    const objKeys = Object.keys(obj).length;
    let option = "";
    if (objKeys > 0) {
      if (obj.type === "shop" && obj.typeValue !== "선택") {
        option = `AND a.shopcode = ${obj.typeValue}`;
      } else if (obj.type === "coupon" && obj.typeValue !== "선택") {
        option = `AND a.coupontype = ${obj.typeValue}`;
      }
    }

    return `SELECT b.ShopName, 
                    c.DcName, 
                    Replace(CONVERT(VARCHAR, CONVERT(MONEY, a.SaleCouponQty), 1), '.00', '') AS SaleCouponQty,
                    Replace(CONVERT(VARCHAR, CONVERT(MONEY, a.salecouponamt), 1), '.00', '') AS SaleCouponAmt,
                    a.InsId, 
                    a.InsDate 
            FROM   ps131 a
                  LEFT OUTER JOIN ps130 b
                                ON a.shopcode = b.shopcode
                  LEFT OUTER JOIN ps132 c
                                ON a.coupontype = c.coupontype
            WHERE  a.procdate + a.proctime BETWEEN 
                  ${
                    objKeys !== 0 ? `'${obj.startDate}'` : today
                  } + '000000' AND 
                  ${objKeys !== 0 ? `'${obj.endDate}'` : today} + '235959'
                  ${option}
            ORDER  BY a.insdate DESC`;
  },
  USERS_AUTH: () => {
    return `SELECT ShopCode,
                  ShopName,
                  MainPage,
                  AuthLevel,
                  ApprovalSts,
                  KeyPad,
                  Notification,
                  ShopDuplication,
                  TimeLimit,
                  TimeLimitMinutes,
                  MaxCnt,
                  FreeCnt,
                  PayCnt,
                  UpdId,
                  UpdDate
            FROM   ps130
            WHERE ShopName  != '' and ShopName is not null
          `;
  },
};
