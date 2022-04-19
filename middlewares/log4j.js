var uuid = require('uuid');

// 每个请求都要一个新的 logger 实例，以便有一个全新的 log context
// logger 实例同时挂载 req 上，方便取用
/**
 *  req.logger = {
 *    category: 'default',
      context: { trace: 'd47f291d-92d2-4277-b46e-7876296bca39', path: '/' },
      parseCallStack: [Function: defaultParseCallStack]
 *  }
 */
async function reqMiddleware (req, res, next, log4js) {
    /**
     * Memory usage
     * https://log4js-node.github.io/log4js-node/file.html
     * https://github.com/seeLuck/pinus-logger/blob/master/lib/logger.ts
     * https://github.com/node-pinus/pinus/issues/167
     */
    let pause = false;
    process.on('log4js:pause', (val) => {
        pause = val;
    }); 
    if(pause) { return; }


    if (!req.logger) req.logger = log4js.getLogger('http');
    // 添加 trace id
    const traceId = req.get('X-Request-Id') || uuid.v4();
    // 附加 trace id 到 logger 的 context 上，这样后续每个 log 都会携带 trace id
    req.logger.addContext('trace', traceId);
    // 同时附加请求的 path 
    req.logger.addContext('path', req.path);

    await next();
}

export default {
    reqMiddleware,
}
