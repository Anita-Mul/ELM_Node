module.exports = {
  apps : [{
    name: 'elm_node',
    script: 'ENABLE_NODE_LOG=YES node index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    watch: ["app.js", "ecosystem.config.js", "prototype", "config", "elmConfig.json", "middlewares", "controller", "index.js", "models", "mongodb", "routes"],
    watch_delay: 1000,
    ignore_watch: ["node_modules", "logs", "yarn.lock", "public", "package.json", "README.md", "COPYING", "InitData", "package-lock.json"],
    max_memory_restart: '300M',
    exp_backoff_restart_delay: 100,
    error_file: '/myproject/real_project/ELM_Node/logs/pm2/ELMerr.log',
    out_file: '/myproject/real_project/ELM_Node/logs/pm2/ELMout.log',
    pid_file: '/myproject/real_project/ELM_Node/logs/pm2/app-pm_id.pid',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    instances : "max",
    kill_timeout : 3000,
    wait_ready: true,
    listen_timeout: 10000
  }],
};

