'use strict';

const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');

const router = require('./router');
const koaBody = require('koa-body');

module.exports = function (options) {
	return DuckWebKoa((app, { AppRouter }) => {
		app.use(koaBody({
			// multipart: true,
			formLimit: "10mb",
			jsonLimit: "10mb",
			textLimit: "10mb",
			enableTypes: ['json', 'form', 'text']
	}));
	
		app.use(AppRouter().routes());
	}, {
		plugins: [
			DuckWebKoaRouter(router)
		],
		installed(context, { injection }) {
			
		}
	});
};