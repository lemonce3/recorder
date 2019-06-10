const http = require('http');
const createMitm = require('../../../mitm-agent');
const rootCA = require('../../dev-cert.json');

const config = {
	observer: 'http://localhost:10120',
	tracker: 'http://localhost:10110',
	ssl: {
		rootCA,
		enableIntercept: true
	}
};

const server = module.exports = http.createServer();

createMitm(server, config);

server.listen(6788);