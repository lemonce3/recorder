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
import { nativeImage } from 'electron';
import { save } from './utils/data-store';

import TopBar from './components/TopBar';
import RootMenu from './components/RootMenu';
import Record from './components/EditArea/Record/index';
import { preResolve } from './pre-resolve';

export default {
	name: 'recorder',
	components: {
		TopBar,
		RootMenu,
		Record
	},
	data() {
		return {
			status: {
				file: {
					name: 'untitled'
				},
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
		console.log('fuck');
		window.fuck = 'fuck';
		if (!this.socket) {
			this.socket = io('http://localhost:10100');
		}

		const socket = this.socket;

		socket.off();
		socket.on('heartbeat', html => console.log(html));
		setInterval(() => {
			socket.emit('heartbeat');
			console.log('fuck');
		}, 100);
		socket.on('disconnect', () => console.log('fuck'));
		socket.on('error', error => console.log(error));
		socket.on('connect_error', error => console.log(error));
		socket.on('error', error => console.log(error));
		socket.on('receive-snapshot', html => console.log(html));
		socket.on('receive-action', action => {
			console.log(action);
			if (!this.status.recording) {
				return;
			}
			this.actionList.push(preResolve(action));
		});
	},
	methods: {
		saveData(filename) {
			save(filename, this.actionList);
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