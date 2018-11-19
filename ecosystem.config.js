module.exports = {
  apps : [{
    name: 'node_server_1',
    script:'/test/node_server.js',
    args: 'one two',
    instances: 1,
    // 输出日志
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
    name: 'node_server_2',
    script: '/test/node_server2.js',
    args: 'one two',
    instances: 1,
    // 输出日志
    out_file: '/var/log/node_server_2/out.log',
    error_file: '/var/log/node_server_2/err.log',
    log_file: '/var/log/node_server_2/log.log',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
 }],
}
