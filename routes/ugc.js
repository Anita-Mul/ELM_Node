'use strict';

import express from 'express';
import Rating from '../controller/ugc/rating'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';
const router = express.Router();

router.get('/v2/restaurants/:restaurant_id/ratings', logParam , Rating.getRatings)
router.get('/v2/restaurants/:restaurant_id/ratings/scores', logParam, Rating.getScores)
router.get('/v2/restaurants/:restaurant_id/ratings/tags', logParam, Rating.getTags)

export default router