'use strict';

import express from 'express'
import Admin from '../controller/admin/admin'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router()

router.post('/login', Admin.login);
// router.post('/register', Admin.register);
router.get('/signout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);

export default router
