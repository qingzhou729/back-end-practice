module.exports = {
  apps:[{ 
    name: 'node_server_1',
    args: 'one two',
    script:'/data/back-end-practice/node_server.js',
    instances: 1,
    out_file: '/var/log/node_server_1/out.log',
    error_file: '/var/log/node_server_1/err.log',
    log_file: '/var/log/node_server_1/log.log',
    autorestart: true,
    watch: true,
    watch_options: {
      usePolling: true
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev'
    },
  },{
    name: 'node_server_1',
    args: 'one two',
    script:'/data/back-end-practice/node_server.js',
    instances: 1,
    out_file: '/var/log/node_server_1/out.log',
    error_file: '/var/log/node_server_1/err.log',
    log_file: '/var/log/node_server_1/log.log',
    autorestart: true,
    watch: true,
    watch_options: {
      usePolling: true
    },
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev'
    },
  },{
    name: 'node_back_server',
    script:'/data/back-end-practice/back.js',
    args: 'one two',
    instances: 1,
    // 输出日志
    out_file: '/var/log/node_back/out.log',
    error_file: '/var/log/node_back/err.log',
    log_file: '/var/log/node_back/log.log',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
 }],
}
