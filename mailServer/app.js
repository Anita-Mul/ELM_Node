import express from 'express';
import Redis from 'ioredis';
import path, { dirname, resolve} from 'path';
import fs from 'fs';
import ejs from 'ejs';
import db from '../mongodb/db.js';
import BugModel from '../models/bug/bug.js';
import sendMail from '../util/sendMail.js';

// By default, it will connect to localhost:6379.
const defaultRedisClient = new Redis();


const BugStatus = {
    Created: 1,
    Processing: 2,
    Done: 3
}
var app = express();

app.set('port', process.env.PORT || 3005);

app.get('/solve', async function(req, res){
    var {trace, msgId, who} = req.query;
    const lockKey = `${msgId}_lock`;
    
    // 如果存在 counter，先移除
    await defaultRedisClient.del(msgId);

    try {
        // 加不失效锁
        await defaultRedisClient.set(lockKey, trace ? trace :'');
        
        // 插一条 bug 数据
        await BugModel.create({
            assign: who,
            trace,
            msgId,
            status: BugStatus.Created,
        });
    } catch (e) {
      console.error('执行加锁出错', e);
    }

    res.end('Thank you, you must solve this bug!');
});

app.get('/reject', async function(req, res){
    var {trace, msgId} = req.query;
    const lockKey = `${msgId}_lock`;
    
    // 如果存在 counter，先移除
    await defaultRedisClient.del(msgId);

    try {
        // 拒绝告警的处理
        // redis 加锁，3天有效期，后面都不在提醒
        // 如果推送连续三条，用户不处理，加锁一天
        await defaultRedisClient.set(lockKey, trace ? trace :'',  "EX", 1 * 24 * 60 * 60);
    } catch (e) {
        console.error('执行加锁出错', e);
    }

    res.end('You are a lazy person, I hate you!');
});

/**
 * [
        {
            _id: 6260151b7a8a5478b7aac804,
            createdAt: 2022-04-20T14:13:25.824Z,
            updatedAt: 2022-04-20T14:13:25.824Z,
            status: 1,
            msgId: '{"projectName":"elm_node","env":"development","uid":"","trace_id":"372fd445-82ad-4551-a0e2-229e21598',
            trace: '372fd445-82ad-4551-a0e2-229e21598a08',
            assign: '2659580957@qq.com',
            __v: 0
        }
    ]   
 */
app.get('/show', async function(req, res) {
    var who = req.query.who;
    var userBugs = await BugModel.find({assign:who, status: {$in: [BugStatus.Created, BugStatus.Processing]}}).lean();
    
    if(userBugs.length == 0) {
        res.end('Congratulations on your name is not yet to handle the bug, continue!');
    } else if (userBugs.length > 0) {
        for(let userBug of userBugs) {
            // 要发送的数据
            let send = {
                "trace": userBug.trace ? userBug.trace : '',            // 全链路 id，建 bug 单需要，用于到日志系统追查
                "id": userBug._id,
                "title": '此bug期待您的解决！',
            };
            
            // const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'ejs/sendBug.ejs'), 'utf8'));
            const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../util/ejs/pullBug.ejs'), 'utf8'));

            const HtmlData = template(send);

            var sendData = {
                solvePeople: who,
                HtmlData,
                "subject": '狗蛋，解决掉你的 bug 再去吃肉!',
            };

            sendMail(sendData);
        };

        res.end('You will receive all unresolved bugs, please check in time');
    }
});


app.get('/userSolved', async function(req, res) {
    var bug = await BugModel.find({ _id: req.query.id }).lean();
    // 移除锁
    const { msgId } = bug;
    defaultRedisClient.del(`${msgId}_lock`);
    await BugModel.findByIdAndUpdate(req.query.id, { status: BugStatus.Done });
    res.end('You are so handsome!');
});

app.get('/userSolving', async function(req, res) {
    await BugModel.findByIdAndUpdate(req.query.id, { status: BugStatus.Processing });
    res.end('Cheer!');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' + 
        app.get('port') + '; press Ctrl-C to terminate.' );
        
    if(process.send) {
        process.send('ready');
    }
});