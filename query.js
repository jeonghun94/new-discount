export const QUERY = {
    SEARCH_DISCOUNT_IN_CAR_NO: inCarNo => {
        return `
            SELECT result.*
            FROM   (SELECT Row_number()
                            OVER (
                            partition BY a.incarno
                            ORDER BY a.procdate ASC, a.proctime ASC)AS row_no,
                        a.incarno,
                        a.tktype,
                        a.procdate,
                        a.proctime,
                        a.inseqno,
                        a.incarpicname,
                        b.parkname,
                        c.unitname
                    FROM   ps500 a
                        LEFT OUTER JOIN ps020 b
                                        ON a.systemno = b.systemno
                        LEFT OUTER JOIN ps070 c
                                        ON a.mainunitno = c.mainunitno
                    WHERE  a.incarno LIKE '%${inCarNo}%'
                        AND a.intksts IN( '1', '3' )
                        AND a.tktype IN( '1', '3' )
                        AND a.procdate > Dateadd(ww, -1, Getdate())) result
            WHERE  result.row_no = '1'
            ORDER  BY procdate DESC,
                    proctime DESC 
        `}, 
}