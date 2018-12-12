const redis = require('redis')
const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { promisify } = require('util');

const client = redis.createClient(6379, '127.0.0.1');

client.on('error', (err) => {
    console.log('Error ' + err);
});

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function read(path) {
    const file = await readFile(path, 'utf8');
    return file;
}
async function write(path, data) {
  const file = await writeFile(path, data);
  return file;
}


const sort = (res) => {
    const  args = [ 'rankdata', 1, 200, 'WITHSCORES'];
    client.zrevrange(args, function (err, response) {
        if (err) throw err;
        //console.log('example1', response);
        const list = [];
        for (let i = 0; i < response.length; i=i+2) {
            list.push({score: response[i+1], player: response[i]});
        }

        res.end(JSON.stringify({
            success: true,
            data: list,
            message: '',
        }));
    });
}


async function isSetnxFuc (key) {
    return new Promise (resolve => {
        client.setnx([key, 1], (err, isSetnx) => {
            if (err) throw err;
            resolve(isSetnx);
        });
    }) 
};
async function isExistsFuc (key) {
    return new Promise (resolve => {
        client.exists(key, (err, isExists) => {
            if (err) throw err;
            resolve(isExists);
        });
    });
};
const httpServer = http.createServer( async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const pathname = url.parse(req.url).pathname;
    if (pathname === '/goods') {
       const isExists = await isExistsFuc('goods_num'); 
       if (!isExists) {
            const isSetnx = await isSetnxFuc('goods_setnx');
            if (isSetnx) {
                await read('/tmp/goods.data').then( async(data) => {
                    console.log('库存'+ data);
                    await client.set(['goods_num', +data]);
                });
            } 
        }

        client.decr('goods_num', (err, num) => {
            if (err) throw err;
            if (num <= -1) {
                res.end(JSON.stringify({
                    success: false,
                    data: 0,
                    message: '库存不足',
                }));
            } else {
                res.end(JSON.stringify({
                    success: true,
                    data: num + 1,
                    message: '',
                }));

                 write('/tmp/goods.data', num).then((res, err) => {
                    fs.appendFile('/var/log/redis-test-goods.log', '剩余库存:' + num + ',操作时间:' + new Date() + '\n');
                });
                
            }
        });
    } 
    if (pathname === '/rank') {
        const multi = client.multi();
        const isSetnx = await isSetnxFuc('rank_setnx');
        if (isSetnx) {
            client.expire(['rank_setnx', 10]);
            multi.exec();
            read('/tmp/rank.data').then((data) => {
                const rankData = JSON.parse(data);
                const tmp = ['rankdata'];  
                rankData.forEach((item) => {
                    tmp.push(item.score, item.name);
                });

                client.zadd(tmp, function (err, response) {
                    if (err) throw err;
                    console.log('added '+ response + ' items.');
                    sort(res);
                });
            });
        } else {
            sort(res);
        }
    };
});



const PORT = 3377;
httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://47.107.188.55:%s', PORT);
});
