function Layout(log4js) {
    var projectName = 'elm_node';

    // config     {"type":"json","separator":","}
    // logEvent   {"startTime":"2022-04-17T05:44:00.179Z","categoryName":"index","data":["返回数据成功,
    //             测试日志等级error"],"level":{"level":40000,"levelStr":"ERROR","colour":"red"},"context":{},"pid":23704}
    // 当调用日志函数时才会触发回调函数
    log4js.addLayout('json', config => function (logEvent) {
        return JSON.stringify({
            projectName,
            env: process.env.NODE_ENV || '',
            uid: logEvent.context.uid || '',            // uid
            trace_id: logEvent.context.trace || '',     // trace_id
            path: logEvent.context.path || '',          // request path
            cost: logEvent.context.cost || '',          // costtime
            // 里面有 startTime 等标识日志时间的字段
            ...logEvent,
        }, 0) + config.separator;
    });
}
  
export default Layout