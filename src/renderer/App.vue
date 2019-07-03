<template>
	<v-app>
		<top-bar :status="status" @save-file="saveData(status.file.path)"/>
		<root-menu
			:category="categoryList"
			:length="menuLength"
			@selected-change="onSelectChange"
		/>
		<record :actionList="actionList" :status="status"/>
		<keep-alive>
			<router-view :actionList="actionList" :status="status"></router-view>
		</keep-alive>
	</v-app>
</template>

<script>
import io from 'socket.io-client';
import { nativeImage, remote } from 'electron';
import { save } from './utils/data-store';
import { newFile, saveFile, saveAs, openFile, fileStatus } from './utils/file';
import { actionToBuffer, bufferToAction, actionStringify, actionListStringify } from './utils/action-util';

import TopBar from './components/TopBar';
import RootMenu from './components/RootMenu';
import Record from './components/EditArea/Record/index';
import resolver from '../../../recoder-resolver/';
import preResolve from './pre-resolve';

const fs = remote.require('fs').promises;
const path = remote.require('path');
const tempPath = path.join(remote.app.getPath('temp'), 'recorder');

const getId = (length = 5) =>
		Array(length)
			.fill('')
			.map(() =>
				Math.random()
					.toString(16)
					.substring(2, 8)
			)
			.join('-');

function pickScreenshot(action, name) {
	const { bounds, dataURL } = action.screenshot;
	const { rect } = action.data;

	const offsetRect = {
		x: Math.floor(rect.x) - bounds.x,
		y: Math.floor(rect.y) - bounds.y,
		width: Math.round(rect.width),
		height: Math.round(rect.height)
	};

	const imageId = getId();
	const image = nativeImage.createFromDataURL(dataURL);
	const filename = path.join(tempPath, imageId) + '.png';
	fs.writeFile(filename, image.toPNG()).catch(error => console.log(error));

	delete action.screenshot.dataURL;
	action.screenshot.id = imageId;
	
	action.extend = {
		image: image.crop(offsetRect).toDataURL()
	};
}

export default {
	name: 'recorder',
	components: {
		TopBar,
		RootMenu,
		Record
	},
	data() {
		return {
			rawList: [],
			status: {
				file: fileStatus,
				recording: true
			},
			menuLength: 5,
			actionList: [],
			activeCategoryIndex: 1,
			categoryList: [
				'file',
				'record',
				'resolve',
				// 'genCode',
				'editDoc'
				// 'setting'
			],
			socketPath: '',
			socket: null,
			heartbeatIntervalID: null
		};
	},
	mounted() {
		if (!this.socket) {
			this.socket = io('http://localhost:10100');
		}

		const socket = this.socket;

		socket.off();

		socket.on('disconnect', () => console.log('fuck'));
		socket.on('error', error => console.log(error));
		socket.on('connect_error', error => console.log(error));
		socket.on('error', error => console.log(error));
		socket.on('receive-snapshot', snapshot => {
			console.log(snapshot);
			this.rawList.push({ type: 'snapshot', data: snapshot });
			resolver.emit('snapshot', snapshot);
		});
		socket.on('receive-action', action => {
			if (!this.status.recording) {
				return;
			}

			pickScreenshot(action, this.status.file.name);
			this.rawList.push({ type: 'action', data: action });
			resolver.emit('action', action);
		});

		resolver.on('resolved-action', action => {
			this.actionList.push(preResolve(action));
		});
	},
	methods: {
		saveData(filename) {
			console.log(JSON.stringify(this.actionList));
			// save(filename, this.actionList);
		},
		onSelectChange(categoryIndex) {
			this.activeCategoryIndex = categoryIndex;
		}
	},
	computed: {
		activeCategory() {
			return this.categoryList[this.activeCategoryIndex];
		}
	},
	watch: {
		activeCategoryIndex(index) {
			const routeMap = {
				file: '/fileManage',
				record: '/',
				resolve: '/resolve',
				genCode: '/genCode',
				editDoc: '/editDoc',
				setting: '/setting'
			};

			this.$router.push(routeMap[this.categoryList[index]]);
		}
	}
};
</script>

<style lang="less">
#app {
	height: 100%;
	#record {
		position: absolute;
		top: 60px;
		bottom: 0px;
		z-index: 0;
		width: 100%;
	}

	.edit-area {
		position: relative;
		z-index: 1;
		height: 100%;
	}
}
</style>