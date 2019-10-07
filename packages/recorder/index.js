const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckElectron = require('@or-change/duck-electron');
const DuckWebpack = require('@or-change/duck-webpack');

const RecorderScreenshot = require('@lemonce3/recorder-screenshot');
const RecorderCroper = require('@lemonce3/recorder-croper');
const RecorderResolver = require('./src/resolver');
const RecorderWebpack = require('./src/Webpack');
const bootstrap = require('./src/bootstrap');
const Application = require('./src/Application');
const WorkSpace = require('./src/Workspace');
const WebSocket = require('./src/Websocket');
const ScreenshotQueue = require('./src/ScreenshotQueue');
const Mitm = require('./src/Mitm');

module.exports = function Recorder(options) {
	const recorder = {};

	Duck({
		id: 'com.orchange.recorder',
		name: 'Lemonce3 Recorder',
		version: '0.3.0',
		injection: {
			screenshot: RecorderScreenshot.main({
				productURL: '',
				devURL: 'http://localhost:8080/screenshot.html'
			}),
			croper: RecorderCroper.main({
				productURL: '',
				devURL: 'http://localhost:8080/croper.html'
			}),
			resolver: RecorderResolver,
			workspace: WorkSpace({
				store: options.store
			}),
			screenshotQueue: ScreenshotQueue({ length: 50 }),
			mitm: Mitm(options.mitm),
			util: {
				base64Encode(string) {
					return Buffer.from(string).toString('base64');
				},
				base64Decode(base64) {
					return Buffer.from(base64, 'base64').toString();
				}
			}
		},
		components: [
			DuckElectron(bootstrap),
			DuckWeb([
				{
					id: 'WebIPC',
					description: '',
					Application: Application()
				}
			]),
			DuckWebpack({
				recorder: RecorderWebpack,
				screenshot: RecorderScreenshot.renderer.Webpack,
				croper: RecorderCroper.renderer.Webpack
			})
		],
		installed({ workspace, Web, injection }) {
		}
	}, ({ workspace, Webpack, Web, mitm }) => {
		recorder.webpack = {
			recorder: Webpack('recorder'),
			croper: Webpack('croper'),
			screenshot: Webpack('screenshot')
		}

		if (typeof require('electron') === 'string') {
			return;
		}

		mitm.listen(options.mitm.port);
		const server = recorder.server = Web.Http.createServer(Web.Application('WebIPC'));
		const websocket = WebSocket({server});
		workspace.addListener('updated', () => {
			websocket.emit('updated');
		});
		server.listen(10110);
	});

	return recorder;
}

process.on('error', console.log);