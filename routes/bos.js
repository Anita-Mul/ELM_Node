'use strict';

import express from 'express';
import Order from '../controller/v1/order'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.get('/v2/users/:user_id/orders', logParam, Order.getOrders)
router.get('/v1/users/:user_id/orders/:order_id/snapshot', logParam, Order.getDetail)
router.get('/orders', Order.getAllOrders)
router.get('/orders/count', Order.getOrdersCount)

export default router