<template>
	<v-app>
		<top-bar :status="status" @save-file="saveData(status.file.path)"/>
		<root-menu
			:category="categoryList"
			:length="menuLength"
			@selected-change="onSelectChange"
		/>
		<record :status="status"/>
		<router-view :status="status"></router-view>
	</v-app>
</template>

<script>
import io from 'socket.io-client';
import { nativeImage, remote } from 'electron';
import { actionStringify, actionListStringify } from './utils/action-util';

import TopBar from './components/TopBar';
import RootMenu from './components/RootMenu';
import Record from './components/EditArea/Record/index';

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
				file: '',
				recording: true
			},
			menuLength: 5,
			actionList: [],
			projectIndex: [],
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
			socket: null
		};
	},
	mounted() {
		this.projectIndex = this.$workspace.project.index;
	},
	methods: {
		saveData(filename) {
			console.log(JSON.stringify(this.actionList));
			// save(filename, this.actionList);
		},
		onSelectChange(categoryIndex) {
			this.activeCategoryIndex = categoryIndex;
		},
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