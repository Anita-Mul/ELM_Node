'use strict';

module.exports = {
	port: parseInt(process.env.PORT, 10) || 8001,
	url: 'mongodb://Anita_Sun:yan3933835@elmdata-shard-00-00.xtxqu.mongodb.net:27017,elmdata-shard-00-01.xtxqu.mongodb.net:27017,elmdata-shard-00-02.xtxqu.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-10hanu-shard-0&authSource=admin&retryWrites=true&w=majority',
	// url: 'mongodb://localhost:27017/elm',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
			secure:   false,
			maxAge:   365 * 24 * 60 * 60 * 1000,
		}
	}
}




