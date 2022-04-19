'use strict';

import express from 'express';
import Shop from '../controller/shopping/shop'
import Food from '../controller/shopping/food'
import Category from '../controller/shopping/category'
import Check from '../middlewares/check'
import {logParam, logBody, logQuery, logcookie, logBodyParam} from '../middlewares/log4j.js';

const router = express.Router();

router.post('/addshop', logBody, Check.checkAdmin, Shop.addShop);
router.get('/restaurants', Shop.getRestaurants);
router.get('/restaurants/count', Shop.getShopCount);
router.post('/updateshop', logBody, Check.checkAdmin, Shop.updateshop);
router.delete('/restaurant/:restaurant_id', logParam, Check.checkSuperAdmin, Shop.deleteResturant);
router.get('/restaurant/:restaurant_id', logParam, Shop.getRestaurantDetail);
router.post('/addfood', logBody, Check.checkAdmin, Food.addFood);
router.get('/getcategory/:restaurant_id', logParam, Food.getCategory);
router.post('/addcategory', logBody, Check.checkAdmin, Food.addCategory);
router.get('/v2/menu', Food.getMenu);
router.get('/v2/menu/:category_id', logParam, Food.getMenuDetail);
router.get('/v2/foods', Food.getFoods);
router.get('/v2/foods/count', Food.getFoodsCount);
router.post('/v2/updatefood', logBody, Check.checkAdmin, Food.updateFood);
router.delete('/v2/food/:food_id', logParam, Check.checkSuperAdmin, Food.deleteFood);
router.get('/v2/restaurant/category', Category.getCategories);
router.get('/v1/restaurants/delivery_modes', Category.getDelivery);
router.get('/v1/restaurants/activity_attributes', Category.getActivity);

export default router