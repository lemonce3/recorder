const path = require('path');

module.exports = {
	main: require('./src/MainProcess'),
	renderer: {
		Webpack: require('./src/Webpack')
	}
}