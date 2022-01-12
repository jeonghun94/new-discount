export const LOCALS_QUERY = {
  USER_LOGGED_IN: (id, pw) => `SELECT *
                                FROM   ps130
                                WHERE  id = '${id}'
                                    AND pwd = '${pw}'`,

  SEARCH_IN_CAR: () => `SELECT TOP (10)*
                        FROM   ps500
                        WHERE  procdate = CONVERT(CHAR(8), Getdate(), 112)
                              AND tktype = '1'
                              AND intksts = '1'
                        ORDER  BY inseqno DESC `,
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
  SEARCH_FREE_COUPON: `SELECT * FROM PS132 WHERE paytype = '01'`,
  SEARCH_PAY_COUPON: `SELECT * FROM PS132 WHERE paytype = '02'`,
  SEARCH_DISCOUNT_LIST: (inSeqNo) => {
    return `SELECT CONVERT(DATETIME, a.ProcDate + ' ' + STUFF(STUFF(a.proctime, 3, 0, ':'), 6, 0, ':'), 120) as InTime,
                b.InCarNo,
                a.Idx,
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
};
