module.exports = {
  apps: [
    {
      name: "frontline_server",
      script: "bin/www",
      instances: 0, // run on all cores
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
