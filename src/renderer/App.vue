<template>
	<v-app>
		<top-bar />
		<root-menu
			:category="categoryList"
			:length="menuLength"
			@selected-change="onSelectChange"
		/>
		<record :actionList="actionList" />
		<router-view :actionList="actionList"></router-view>
	</v-app>
</template>

<script>
import io from 'socket.io-client';

import TopBar from './components/TopBar';
import RootMenu from './components/RootMenu';
import Record from './components/EditArea/Record/index';

import mockData from './dataMock';

function actionDataHandle(raw) {
	raw.forEach(action => {
		const data = {};
		Object.keys(action.data).forEach(
			key => (data[key] = { key, value: action.data[key] })
		);
		action.data = data;
	});
	return raw;
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
			menuLength: 5,
			menuHeight: 30,
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
		this.actionList = actionDataHandle(mockData);
		const socket = this.socket = io('http://localhost:10000');

		socket.on('newRaw', data => this.actionList.push(data));
	},
	methods: {
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