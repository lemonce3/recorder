const http = require('http');
const fs = require('fs');
const path = require('path');
const createMitm = require('../../../mitm-agent');
const rootCA = require('../../dev-cert.json');
const { app } = require('electron');
const injectPath = process.env.NODE_ENV === 'development'
	? path.resolve('bundle.js')
	: path.join(path.parse(app.getPath('exe')).dir, 'bundle.js');

const inject = fs.readFileSync(injectPath).toString();

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