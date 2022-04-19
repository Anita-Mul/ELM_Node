'use strict';

import express from 'express';
import VipCart from '../controller/member/vipcart'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';
const router = express.Router();

router.post('/v1/users/:user_id/delivery_card/physical_card/bind', logParam, VipCart.useCart)

export default router