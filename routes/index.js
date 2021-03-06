'use strict';

import v1 from './v1'
import v2 from './v2'
import v3 from './v3'
import v4 from './v4'
import ugc from './ugc'
import bos from './bos'
import eus from './eus'
import admin from './admin'
import payapi from './payapi'
import statis from './statis'
import member from './member'
import shopping from './shopping'
import promotion from './promotion'

export default app => {
	// app.use('/', (req, res, next) => { 
	// 	logger.info(`query:${JSON.stringify(req.query)}`);
	// 	logger.info(`body:${JSON.stringify(req.body)}`);
	// 	logger.info(`params:${JSON.stringify(req.params)}`);
	// 	logger.info(`cookies:${JSON.stringify(req.cookies)}`);
	// });
	app.use('/v1', v1);
	app.use('/v2', v2);
	app.use('/v3', v3);
	app.use('/v4', v4);
	app.use('/ugc', ugc);
	app.use('/bos', bos);
	app.use('/eus', eus);
	app.use('/admin', admin);
	app.use('/payapi', payapi);
	app.use('/member', member);
	app.use('/statis', statis);
	app.use('/shopping', shopping);
	app.use('/promotion', promotion);
}