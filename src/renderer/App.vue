<template>
	<v-app>
		<top-bar :height="topBarHeight" />
		<root-menu
			:category="categoryList"
			:length="menuLength"
			:height="menuHeight"
			@selected-change="onSelectChange"
		/>
		<edit-area
			:category="activeCategory"
			:actionList="mockData"
		/>
		<!-- <router-view></router-view> -->
	</v-app>
</template>

<script>
import getScreenshot from "../../../../or-change/electron-screenshot";
import { ipcRenderer } from "electron";

import TopBar from "./components/TopBar";
import RootMenu from "./components/RootMenu";
import EditArea from "./components/EditArea/Record";

import mockData from "./actionMock";

export default {
	name: "recorder",
	components: {
		TopBar,
		RootMenu,
		EditArea
	},
	data() {
		return {
			topBarHeight: 30,
			menuLength: 4,
			menuHeight: 30,
			activeCategoryIndex: 1,
			categoryList: ["file", "record", "genCode", "editDoc", "setting"],
			mockData
		};
	},
	mounted() {
		ipcRenderer.removeAllListeners(
			"LEMONCE3_RECORDER::get-screenshot",
			this.onGetScreenshot
		);
		ipcRenderer.on("LEMONCE3_RECORDER::get-screenshot", this.onGetScreenshot);
	},
	methods: {
		async onGetScreenshot() {
			ipcRenderer.send(
				"LEMONCE3_RECORDER::screenshot-data",
				await getScreenshot()
			);
		},
		onSelectChange(categoryIndex) {
			this.activeCategoryIndex = categoryIndex;
		}
	},
	computed: {
		activeCategory() {
			return this.categoryList[this.activeCategoryIndex];
		}
	}
};
</script>

<style>
/* CSS */
</style>
