<template>
	<div id="menu"
		@mouseleave.self="hiddenSubMenu()">
		<button v-for="(menuItem, index) in render.left" :key="`left_${index}`"
			:title="menuItem.message" @mouseover="showSubMenu(index)"
			:class="{'active': activeMenu === index}">
			<i :class="menuItem.class"></i>
		</button>
		<div class="float-right">
			<button v-for="(menuItem, index) in render.right" :key="`right_${index}`"
				:title="menuItem.message" @click="run(menuItem.action)">
				<i :class="menuItem.class"></i>
			</button>
		</div>
		<div id="sub-menu" v-if="subMenuList">
			<button v-for="(menuItem, index) in subMenuList" :key="`sub_${index}`"
				:title="menuItem.message" @click="run(menuItem.action)">
				<i :class="menuItem.class"></i>
			</button>
		</div>
	</div>
</template>

<script>
import menuContent from './menu.yaml';
import electron from 'electron';

const fs = electron.remote.require("fs");

export default {
	name: 'recorder-menu',
	data() {
		return {
			render: menuContent,
			activeMenu: null
		}
	},
	computed: {
		subMenuList() {
			const activeMenu = this.render.left[this.activeMenu];

			if (activeMenu) {
				return activeMenu.subMenu;
			}
		}
	},
	methods: {
		showSubMenu(index) {
			const {action} = this.render.left[index];

			this.hiddenSubMenu();

			if (action) {
				this.run(action);
			}

			this.activeMenu = index;
		},
		hiddenSubMenu() {
			this.activeMenu = null;
		},
		run(name) {
			if (this[name]) {
				this[name]();
			}
		},
		topWindow() {
			
		},
		closeWindow() {

		},
		openFile() {
			this.$openFile([
				{
					name: 'All Files', extensions: ['*']
				}
			], (file) => {
				const filename = file[0];

				const data = fs.readFileSync(filename, "utf8");

				try {
					this.$store.commit('setAction', JSON.parse(data));
				} catch (e) {
					console.log(e);
				}
			});
		},
		saveFile() {

		},
		startRecord() {

		},
		endRecord() {

		},
		restartRecord() {

		},
		getScreenShot() {

		},
		clearWorkbench() {

		},
		exportResult() {

		},
		configure() {

		}
	}
}
</script>

<style lang="less">
#menu {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	-webkit-app-region: drag;
	background-color: #fff;

	button {
		width: 30px;
		border: none;
		background-color: transparent;
		-webkit-app-region: no-drag;
		&:focus {
			outline: none;
		}
		&:hover, &.active {
			background-color: #dedede;
		}
	}

	#sub-menu {
		width: 100%;
		text-align: center;
		border-bottom: 1px solid #dedede;
		position: absolute;
		top: 100%;
		background-color: #fff;
	}
}
</style>


