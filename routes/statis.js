'use strict'

import express from 'express'
import Statis from '../controller/statis/statis'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router()

router.get('/api/:date/count', logParam, Statis.apiCount)
router.get('/api/count', Statis.apiAllCount)
router.get('/api/all', Statis.allApiRecord)
router.get('/user/:date/count', logParam,  Statis.userCount)
router.get('/order/:date/count', logParam, Statis.orderCount)
router.get('/admin/:date/count', logParam, Statis.adminCount)

export default router