'use strict';

import express from 'express';
import Entry from '../controller/v2/entry'
import CityHandle from '../controller/v1/cities'
import User from '../controller/v2/user'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.get('/index_entry', Entry.getEntry);
router.get('/pois/:geohash', logParam, CityHandle.pois);
router.post('/login', logBody, User.login);
router.get('/signout', User.signout);
router.post('/changepassword', logBody, User.chanegPassword);


export default router