<template>
	<v-app>
		<top-bar :status="status" @save-file="saveData(status.file.path)"/>
		<root-menu
			:category="categoryList"
			:length="menuLength"
			@selected-change="onSelectChange"
		/>
		<record :actionList="actionList" />
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

import mockData from './dataMock';

const getId = (length = 5) =>
	Array(length)
		.fill('')
		.map(() =>
			Math.random()
				.toString(16)
				.substring(2, 8)
		)
		.join('-');

function preResolve(action) {
	action.id = getId();
	action.resolve = {
		image: nativeImage
			.createFromDataURL(action.screenshot.dataURL)
			.crop(action.data.rect)
			.toDataURL(),
		property: {
			text: {
				key: 'text',
				value: action.data.text
			}
		}
	};

	if (action.data.value) {
		action.resolve.property.value = {
			key: 'value',
			value: action.data.value
		};
	}

	return action;
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
			status: {
				file: {
					name: 'untitled'
				}
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
			mockData,
			socketPath: '',
			socket: null,
			heartbeatIntervalID: null
		};
	},
	mounted() {
		clearInterval(this.heartbeatIntervalID);
		// this.actionList = actionDataHandle(mockData);
		if (!this.socket) {
			this.socket = io('http://localhost:10100');
		}
		const socket = this.socket;

		socket.off();
		socket.on('receive-snapshot', html => console.log(html));
		socket.on('receive-action', action => {
			console.log(action);
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