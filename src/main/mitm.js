const http = require('http');
const fs = require('fs');
const path = require('path');
const createMitm = require('../../../mitm-agent');
const rootCA = require('../../dev-cert.json');
const inject = fs.readFileSync(path.resolve('bundle.js')).toString();

const config = {
	observer: 'http://localhost:10120',
	tracker: 'http://localhost:10110',
	ssl: {
		rootCA,
		enableIntercept: true
	},
	inject
};

const server = module.exports = http.createServer();

createMitm(server, config);

server.listen(6788);