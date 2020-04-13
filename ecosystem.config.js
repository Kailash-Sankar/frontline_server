module.exports = {
  apps: [
    {
      name: "frontline_server",
      script: "bin/www",
      instances: -2, // run on total cores - 2, set to 0 if system specs are low
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      },
      exec_mode: "cluster"
    }
  ]
};
