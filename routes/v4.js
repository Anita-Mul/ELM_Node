'use strict';

import express from 'express';
import Food from '../controller/shopping/shop'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.get('/restaurants', Food.searchResaturant);

export default router