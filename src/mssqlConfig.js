const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_ADRESS,
  database: process.env.DB_NAME,
  stream: true,
  encrypt: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export default config;
