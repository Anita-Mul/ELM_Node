'use strict';

import express from 'express';
import Explain from '../controller/v3/explain'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.get('/profile/explain', Explain.getExpalin)

export default router