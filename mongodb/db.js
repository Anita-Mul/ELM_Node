'use strict';

import mongoose from 'mongoose';
import config from 'config-lite';
import chalk from 'chalk';
mongoose.connect(config.url, {useMongoClient:true});
// https://stackoverflow.com/questions/51862570/mongoose-why-we-make-mongoose-promise-global-promise-when-setting-a-mongoo
mongoose.Promise = global.Promise;

// 访问默认连接 http://mongoosejs.net/docs/connections.html
const db = mongoose.connection;

db.once('open' ,() => {
	console.log(
    chalk.green('连接数据库成功')
  );
})

db.on('error', function(error) {
    console.error(
      chalk.red('Error in MongoDb connection: ' + error)
    );
    mongoose.disconnect();
});

db.on('close', function() {
    console.log(
      chalk.red('数据库断开，重新连接数据库')
    );
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

export default db;
