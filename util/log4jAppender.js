import Redis from "ioredis";
import sendMail from "./sendMail";

// By default, it will connect to localhost:6379.
const defaultRedisClient = new Redis();


async function sendAlert(title, data, chatid) {
    const msgId = data.msg.length > 100 ? data.msg.slice(0, 100) : data.msg;
    
    // 先判断有没有锁
    const lockKey = `${msgId}_lock`;
    const lock = await defaultRedisClient.get(lockKey);

    if (lock) {
        console.log('lock exsit, skip alert', title, data);
        return;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

    // 进行计数
    let rawCounter = await defaultRedisClient.get(msgId);
    // 如果之前没有发送过，初始化
    if (!rawCounter) {
        rawCounter = '0';
    }

    const counter = parseInt(rawCounter, 10);

    // 如果已经发送 3次或以上，加锁，禁止此次发送
    if (counter > 2) {
        // rm counter
        // 要先 rm，可以 rm 失败，下次还会进入告警计数
        await defaultRedisClient.del(msgId);
        // add lock
        await defaultRedisClient.set(lockKey, data ? data.trace : '', "EX", 1 * 24 * 60 * 60);
        // 可以推送提示：
        // (`三次未处理告警: ${msgId}  \n\n\n
            // 已终止该告警推送，24h 时后恢复！
        // `, undefined, chatid);
        return;
    }

    // 否则仅仅是计数加一，注意加过期时间
    await defaultRedisClient.set(msgId, String(counter + 1),  "EX", 1 * 24 * 60 * 60);

    const copyedData = {
        'env': process.env.NODE_ENV,
        ...data,
    };

    let htmlData = `### ${title} \n`;
    Object.keys(copyedData).forEach((key) => {
      htmlData += `> **${key}**: <font color="comment">${copyedData[key]}</font> \n\n\n`;
    });
    
    // 要发送的数据
    let send = {
        "name": `reject_${data?data.trace : ''}`,   // 全链路 id，建 bug 单需要，用于到日志系统追查
        "value": msgId,       // msg 的前 100 字节，是加锁的必须信息，也是建 bug 单的必须字段
        "text": copyedData,
    };
    
    // 接收到的数据
    let recv = {
        "name": `reject_${data?data.trace : ''}`,   // 全链路 id，建 bug 单需要，用于到日志系统追查
        "value": msgId,       // msg 的前 100 字节，是加锁的必须信息，也是建 bug 单的必须字段
        "text": copyedData,
    };

    const recvLockkey = `${recv.value}_lock`;
    const [actualName, trace] = recv.name.split('_');
    // 如果存在 counter，先移除
    await defaultRedisClient.del(recv.value);

    try {
      // 接受告警的处理
      if (actualName === 'accept') {
        // 加不失效锁
        await defaultRedisClient.set(lockKey, Name);
        const now = Date.now();
        // 这里使用 ORM prisma 往 MYSQL 数据插一条 bug 数据
        // await prisma.bug_list.create({
        //   data: {
        //     assign: Alias,
        //     trace,
        //     msgId: Value,
        //     status: BugStatus.Created,
        //     updatedAt: now,
        //     createdAt: now,
        //   },
        // });
      } else {
        // 拒绝告警的处理
        // redis 加锁，3天有效期，后面都不在提醒
        // 如果推送连续三条，用户不处理，加锁一天
        await defaultRedisClient.set(recvLockkey, 3 * 24 * 60 * 60 * 1000, Name);
      }
    } catch (e) {
      console.error('执行加锁出错', e);
    }
}


function mailAppender(layout, timezoneOffset) {
    return (loggingEvent) => {
        if(loggingEvent.level.level >= 40000) {
            var log = layout(loggingEvent, timezoneOffset);

            // sendAlert(loggingEvent.data[0], {                         // title 就是 req.errLogger.error(`获取数据失败`); 中的 `获取数据失败`
            //     path: loggingEvent.context.path || '',                // path
            //     msg: log || '',                                       // msg
            //     trace: loggingEvent.context.trace || '',              // trace_id
            // });
            sendMail();

            return true;
        }
    };
}


function mailConfigure(config, layouts) {
    let layout = layouts.layout('json', { type: 'json' });

    return mailAppender(layout, config.timezoneOffset);
}

module.exports = {
    mailConfigure
};