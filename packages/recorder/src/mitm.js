const createMitm = require('../../../../lemonce3/mitm-agent');
const { Normalizer, Validator } = require('@or-change/duck');
const http = require('http');

module.exports = function (options) {
	//TODO normalize

	const server = module.exports = http.createServer();

	createMitm(server, options);

	return server;
}