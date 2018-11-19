//使用nodejs自带的http、https模块
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

//根据项目的路径导入生成的证书文件
const privateKey  = fs.readFileSync(path.join(__dirname, '/certificate/private.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '/certificate/ca.cer'), 'utf8');
const credentials = {key: privateKey, cert: certificate};

//创建http与HTTPS服务器
const httpServer = http.createServer((req, res) => {
    let path = req.url;	
    if (path == "/") {
	path = "/test/static/index2.html";
    }
    const server_from = req.headers.server_from === undefined ? '' : req.headers.server_from;
    sendFile(res,path,server_from);
});

const httpsServer = https.createServer(credentials, (req, res) => {
    let path = req.url;
    if(path == "/"){
         path = "/test/static/index.html";
     }
     sendFile(res,path);
});
 
function sendFile(res, path_name,server_from){
   const path_tmp = path.resolve(path_name);   
   fs.readFile(path_tmp, (err, data) => {
       if (!err) { 
	    const type = path_name.substr(path_name.lastIndexOf(".") + 1, path_name.length)
            res.writeHead(200, {'Content-type':"text/"+type,"server_from":server_from});	//在这里设置文件类型，告诉浏览器解析方式
	    if (server_from) {
               res.write("SERVER_FROM: "+ server_from);
            }
            res.write(data);
        }
	res.end();
    });
}
const PORT = 8082;
const SSLPORT = 3001;

//创建http服务器
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://47.107.188.55:%s', PORT);
});

//创建https服务器
 httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://47.107.188.55:%s', SSLPORT);
});
