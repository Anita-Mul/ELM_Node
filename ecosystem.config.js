module.exports = {
  apps : [{
    name: 'elm_node',
    script: 'NODE_LOG_DIR=./logs ENABLE_NODE_LOG=YES sudo node index.js',
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
    error_file: '/myproject/real_project/ELM_Node/logs/pm2/elm_node/ELMerr.log',
    out_file: '/myproject/real_project/ELM_Node/logs/pm2/elm_node/ELMout.log',
    pid_file: '/myproject/real_project/ELM_Node/logs/pm2/elm_node/app-pm_id.pid',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    instances : "max",
    kill_timeout : 3000,
    wait_ready: true,
    listen_timeout: 10000
  }, {
    name: 'mail_node',
    script: 'sudo node mailServer/index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    watch: ["mailServer/app.js", "mailServer/index.js"],
    watch_delay: 1000,
    max_memory_restart: '300M',
    exp_backoff_restart_delay: 100,
    error_file: '/myproject/real_project/ELM_Node/logs/pm2/mail_node/ELMerr.log',
    out_file: '/myproject/real_project/ELM_Node/logs/pm2/mail_node/ELMout.log',
    pid_file: '/myproject/real_project/ELM_Node/logs/pm2/mail_node/app-pm_id.pid',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    instances : "max",
    kill_timeout : 3000,
    wait_ready: true,
    listen_timeout: 10000
  }],
};

