const config = {
  user: "sa",
  password: "key0123",
  server: "smcity.iptime.org",
  database: "PCMS",
  stream: true,
  encrypt: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export default config;
