'use strict';

import express from 'express';
import User from '../controller/v2/user'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';
const router = express.Router();

router.post('/v1/users/:user_id/avatar', logBodyParam, User.updateAvatar)

export default router