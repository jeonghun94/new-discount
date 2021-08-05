require("dotenv").config();

const mssqlConfig = {
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
	port : parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

export default mssqlConfig;
