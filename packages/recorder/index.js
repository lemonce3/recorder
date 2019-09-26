const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckElectron = require('@or-change/duck-electron');
const DuckWebpack = require('@or-change/duck-web');

const RecorderScreenshot = require('@lemonce3/recorder-screenshot');
const RecorderCroper = require('@lemonce3/recorder-croper');
const RecorderResolver = require('./src/resolver');
const bootstrap = require('./src/bootstrap');
const Application = require('./src/Application');
const WorkSpace = require('./src/Workspace');
const WebSocket = require('./src/Websocket');
const ScreenshotQueue = require('./src/ScreenshotQueue');
const Mitm = require('./src/Mitm');



function Recorder(options) {
	const recorder = {};

	Duck({
		id: 'com.orchange.recorder',
		name: 'Lemonce3 Recorder',
		version: '0.3.0',
		injection: {
			screenshot: RecorderScreenshot.main,
			croper: RecorderCroper.main,
			resolver: RecorderResolver,
			workspace: WorkSpace({
				store: options.store
			}),
			screenshotQueue: ScreenshotQueue({ length: 50 }),
			mitm: Mitm(options.mitm)
		},
		components: [
			DuckElectron(bootstrap),
			DuckWeb([
				{
					id: 'WebIPC',
					description: '',
					Application: Application()
				},
				options.store
			]),
			DuckWebpack({
				recorder: {},
				croper: RecorderScreenshot.renderer.Webpack,
				capturer: RecorderCroper.renderer.Webpack
			})
		],
		installed({ Web, workspace, injection }) {
			const server = Web.Http.createServer(Web.Application('WebIPC'));
			const websocket = WebSocket({server});
			workspace.addListener('update', () => websocket.send('updated'));
		}
	}, ({ Webpack }) => {
		recorder.webpack = {
			recorder: Webpack('recorder'),
			croper: Webpack('croper'),
			screenshot: Webpack('screenshot')
		}
	});

	return recorder;
}