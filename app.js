import express from 'express';
import db from './mongodb/db.js';
import config from 'config-lite';
import router from './routes/index.js';
import cookieParser from 'cookie-parser'
import session from 'express-session';
import connectMongo from 'connect-mongo';
// 日志库
import winston from 'winston';
import expressWinston from 'express-winston';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';
// import Statistic from './middlewares/statistic'

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

// app.use(Statistic.apiRecord)
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

// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/success.log'
//         })
//     ]
// }));

router(app);

// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//           json: true,
//           colorize: true
//         }),
//         new winston.transports.File({
//           filename: 'logs/error.log'
//         })
//     ]
// }));

app.use(history());
app.use(express.static('./public'));
app.listen(config.port, () => {
	console.log(
		chalk.green(`成功监听端口：${config.port}`)
	)
});