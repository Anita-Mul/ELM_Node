import express from 'express';
import config from 'config-lite';
import router from './routes/index.js';
import db from './mongodb/db.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';

import history from 'connect-history-api-fallback';
import chalk from 'chalk';

import log4js from 'log4js';
import { reqMiddleware } from './middlewares/log4j.js';
import Layout from './util/log4jLayout.js';
import logConfig from './config/log4j.js';


process.setMaxListeners(0)

const app = express();

app.all('*', (req, res, next) => {
	// CORS 跨域
  	const { origin, Origin, referer, Referer } = req.headers;
  	const allowOrigin = origin || Origin || referer || Referer || '*';
	res.header("Access-Control-Allow-Origin", allowOrigin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", 'Express');

	if (req.method == 'OPTIONS') {   
  		res.sendStatus(200);      // /*让options请求快速返回*/
	} else {
    	next();
	}
});



const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
	name: config.session.name,         // 'SID'
	secret: config.session.secret,     // 'SID'
	resave: true,
	saveUninitialized: false,
	cookie: config.session.cookie,     
	store: new MongoStore({
		url: config.url				   // 'mongodb://localhost:27017/elm'
									   // connect-mongo会在该database下创建一个sessions的数据表
	})
}))

// 设置日志中间件
app.use(async (req, res, next) => {
    reqMiddleware(req, res, next, log4js);
});

// 设置日志的输出格式
Layout(log4js);

// 设置日志输出的目的地
log4js.configure(logConfig);



// app.get('/', function(req, res){
// 	const logger = req.logger;
// 	logger.info('This will use the default category and go to stdout');
// });

// 路由
router(app);

app.use(history());
app.use(express.static('./public'));


app.listen(process.env.PORT || config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	);

	if(process.send) {
		process.send('ready');
	}
});
