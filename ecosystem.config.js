module.exports = {
  apps: [{
  name: 'app',
  script: '.src/server.js',
  instances: 0,
  exec_mode: 'cluster'
  }]
}