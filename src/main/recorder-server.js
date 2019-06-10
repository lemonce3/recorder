const { recorderServer } = module.exports = require('../../../recoder-server');

const url = new URL('http://localhost:10110');

recorderServer.listen(url.port, url.hostname);