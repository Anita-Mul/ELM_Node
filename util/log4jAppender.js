import Redis from "ioredis";
import sendMail from "./sendMail";
import path, { dirname, resolve} from 'path';
import fs from 'fs';
import ejs from 'ejs';

// By default, it will connect to localhost:6379.
const defaultRedisClient = new Redis();


async function sendAlert(title, data) {
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

    
    var solvePeoples = ['2659580957@qq.com'];
    var who = parseInt(Math.random()*solvePeoples.length);
    var solvePeople = solvePeoples[who]; 

    // 要发送的数据
    let send = {
        "trace": data ? data.trace : '',            // 全链路 id，建 bug 单需要，用于到日志系统追查
        "msgId": msgId,                             // msg 的前 100 字节，是加锁的必须信息，也是建 bug 单的必须字段
        "who": solvePeople,
        "text": {
            'title': title,
            ...data,
        },
    };
    
    const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'ejs/sendBug.ejs'), 'utf8'));

    const HtmlData = template(send);

    var sendData = {
        solvePeople,
        HtmlData,
        subject: "狗蛋，出 bug 了！别摸鱼啦！"
    };

    sendMail(sendData);
}


function mailAppender(layout, timezoneOffset) {
    return (loggingEvent) => {
        if(loggingEvent.level.level >= 40000) {
            var log = layout(loggingEvent, timezoneOffset);

            sendAlert(loggingEvent.data[0], {                         // title 就是 req.errLogger.error(`获取数据失败`); 中的 `获取数据失败`
                path: loggingEvent.context.path || '',                // path
                msg: log || '',                                       // msg
                trace: loggingEvent.context.trace || '',              // trace_id
            });

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