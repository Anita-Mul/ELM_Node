'use strict';

import express from 'express';
import Hongbao from '../controller/promotion/hongbao'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.get('/v2/users/:user_id/hongbaos', logParam, Hongbao.getHongbao)
router.get('/v2/users/:user_id/expired_hongbaos', logParam, Hongbao.getExpiredHongbao)

export default router