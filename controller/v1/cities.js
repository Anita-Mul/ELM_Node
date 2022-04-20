'use strict';

import Cities from '../../models/v1/cities'
import pinyin from "pinyin"
import AddressComponent from '../../prototype/addressComponent'


class CityHandle extends AddressComponent{
	constructor(){
		super()
		this.getCity = this.getCity.bind(this);
		this.getExactAddress = this.getExactAddress.bind(this);
		this.pois = this.pois.bind(this);
	}
	
	async getCity(req, res, next){
		const type = req.query.type;
		let cityInfo;
		console.log(111111111);
		try{
			switch (type){
				case 'guess': 
					const city = await this.getCityName(req);
					cityInfo = await Cities.cityGuess(city);
					break;
				case 'hot': 
					cityInfo = await Cities.cityHot();
					break;
				case 'group': 
					cityInfo = await Cities.cityGroup();
					break;
				default: 
					req.logger.error(`参数错误`);
					res.json({
						name: 'ERROR_QUERY_TYPE',
						message: '参数错误',
					})
					return
			}
			res.send(cityInfo);
		}catch(err){
			req.logger.error(`获取数据失败`);
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
		}
	}
	async getCityById(req, res, next){
		const cityid = req.params.id;
		if (isNaN(cityid)) {
			req.errLogger.error(`获取数据失败`);

			req.logger.error(`参数错误`);
			res.json({
				name: 'ERROR_PARAM_TYPE',
				message: '参数错误',
			})
			return
		}
		try{
			const cityInfo = await Cities.getCityById(cityid);
			res.send(cityInfo);
		}catch(err){
			req.logger.error(`获取数据失败`);

			/**
			 * Logger {
			 *		category: 'error',
			 *		context: { trace: '41f801cd-e5fc-4f25-bac0-79ebc99b0aae' },
			 *		parseCallStack: [Function: defaultParseCallStack]
			 * }
			 */
			console.log(req.errLogger);
			// [2022-04-20T11:36:24.769][ERROR   6086  error] 获取数据失败
			req.errLogger.error(`获取数据失败`);
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
		}
	}
	async getCityName(req){
		try{
			const cityInfo = await this.guessPosition(req);
			/*
			汉字转换成拼音
			 */
			const pinyinArr = pinyin(cityInfo.city, {
				style: pinyin.STYLE_NORMAL,
			});

			let cityName = '';

			pinyinArr.forEach(item => {
				cityName += item[0];
			})
			
			return cityName;
		}catch(err){
			return '北京';
		}
	}
	async getExactAddress(req, res, next){
		try{
			const position = await this.geocoder(req)
			res.send(position);
		}catch(err){
			console.log('获取精确位置信息失败');
			res.send({
				name: 'ERROR_DATA',
				message: '获取精确位置信息失败',
			});
		}
	}
	async pois(req, res, next){
		try{
			const geohash = req.params.geohash || '';
			if (geohash.indexOf(',') == -1) {
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: '参数错误',
				})
				return;
			}
			const poisArr = geohash.split(',');
			const result = await this.getpois(poisArr[0], poisArr[1]);
			const address = {
				address: result.result.address,
				city: result.result.address_component.province,
				geohash,
				latitude: poisArr[0],
				longitude: poisArr[1],
				name: result.result.formatted_addresses.recommend,
			}
			res.send(address);
		}catch(err){
			console.log('getpois返回信息失败', err);
			res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '获取数据失败',
			})
		}
	}
}
export default new CityHandle()