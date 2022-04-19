'use strict';

import express from 'express'
import CityHandle from '../controller/v1/cities'
import SearchPlace from '../controller/v1/search'
import Carts from '../controller/v1/carts'
import Address from '../controller/v1/address'
import Remark from '../controller/v1/remark'
import BaseComponent from '../prototype/baseComponent'
import Captchas from '../controller/v1/captchas'
import User from '../controller/v2/user'
import Order from '../controller/v1/order'
import Hongbao from '../controller/promotion/hongbao'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';
const baseHandle = new BaseComponent();
const router = express.Router();

router.get('/cities', logQuery, CityHandle.getCity);
router.get('/cities/:id', logParam, CityHandle.getCityById);
router.get('/exactaddress', CityHandle.getExactAddress);
router.get('/pois', SearchPlace.search);
router.post('/addimg/:type', logBodyParam, baseHandle.uploadImg);
router.post('/carts/checkout', logBody, Carts.checkout);
router.get('/carts/:cart_id/remarks', logParam, Remark.getRemarks);
router.post('/captchas', logBody, Captchas.getCaptchas);
router.get('/user', User.getInfo);
router.get('/user/:user_id', logParam, User.getInfoById);
router.get('/users/list', User.getUserList);
router.get('/users/count', User.getUserCount);
router.get('/users/:user_id/addresses', logParam, Address.getAddress);
router.post('/users/:user_id/addresses', logBodyParam, Address.addAddress);
router.get('/user/city/count', User.getUserCity);
router.get('/addresse/:address_id', logParam, Address.getAddAddressById);
router.delete('/users/:user_id/addresses/:address_id', logParam, Address.deleteAddress);
router.post('/users/:user_id/carts/:cart_id/orders', logBodyParam, Order.postOrder);
router.post('/users/:user_id/hongbao/exchange', logBody, Hongbao.exchange);

 
export default router