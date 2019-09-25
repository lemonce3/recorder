'use strict';

const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');
const DuckDatahub = require('@or-change/duck-datahub');

const router = require('./router');
const models = require('./models');
const koaBody = require('koa-body');

const APP_ID = 'recorderServer';

module.exports = function (options) {
	return DuckWebKoa((app, { AppRouter }) => {
		app.use(koaBody());
	
		app.use(AppRouter().routes());
	}, {
		plugins: [
			DuckWebKoaRouter(router),
			DuckDatahub([
				{
					id: APP_ID,
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			])
		],
		installed(context, { Datahub, injection }) {
			injection.Model = Datahub(APP_ID, options.store).model;
		}
	});
};