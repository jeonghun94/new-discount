import sql from "mssql";
const config = { 
    user: 'sa',
    password: 'key0123', 
    server: '59.15.58.143',
    database: 'PCMS', 
    stream: true,
    encrypt:false,
    pool: { 
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 30000 
    }
}; 

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.log(err, 'WTF!!!');
});

export const executeQuery = async() => {
    await poolConnect; // ensures that the pool has been created
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query('select * from ps130')
        const arr = result.recordset;
        arr.map((x, idx) => {
            console.log(`${idx}: ${x.ShopName}`);
        })
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
}