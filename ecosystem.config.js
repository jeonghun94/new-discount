module.exports = {
  apps: [
    {
      name: "discount",
      script: "./build/init.js",
      env: {
        NODE_ENV: "production",
      },
      exec_mode: "fork",
    },
  ],
};
