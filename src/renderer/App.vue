<template>
	<v-app>
		<top-bar :height="topBarHeight" />
		<root-menu
			:category="categoryList"
			:length="menuLength"
			:height="menuHeight"
			@selected-change="onSelectChange"
		/>
		<record :category="activeCategory" :actionList="actionList" />
		<router-view></router-view>
	</v-app>
</template>

<script>
import getScreenshot from '../../../../or-change/electron-screenshot';
import { ipcRenderer } from 'electron';

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
			topBarHeight: 30,
			menuLength: 4,
			menuHeight: 30,
			actionList: [],
			activeCategoryIndex: 1,
			categoryList: ['file', 'record', 'genCode', 'editDoc', 'setting'],
			mockData,
			screenshotStack: [],
			a: null
		};
	},
	mounted() {
		ipcRenderer.removeAllListeners(
			'LEMONCE3_RECORDER::get-screenshot',
			this.onGetScreenshot
		);
		ipcRenderer.on('LEMONCE3_RECORDER::get-screenshot', this.onGetScreenshot);

		this.actionList = actionDataHandle(mockData);
	},
	methods: {
		async onGetScreenshot() {
			ipcRenderer.send(
				'LEMONCE3_RECORDER::screenshot-data',
				await getScreenshot()
			);
		},
		onSelectChange(categoryIndex) {
			const routeMap = {
				record: '/',
				genCode: '/genCode',
				editDoc: '/editDoc',
				setting: '/setting',
				file: '/file'
			};

			this.activeCategoryIndex = categoryIndex;
			this.$router.push(routeMap[this.categoryList[categoryIndex]]);
		}
	},
	computed: {
		activeCategory() {
			return this.categoryList[this.activeCategoryIndex];
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