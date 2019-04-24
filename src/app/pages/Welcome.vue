<template>
	<div id="welcome">
		<h2>录制器</h2>

		<div class="mt-4">
			<h4 class="mb-2">开始</h4>
			<button @click="openFile">打开文件</button>
			<button @click="createWorkbench">新建工作区</button>
		</div>

		<div class="mt-5">
			<h4 class="mb-2">近期</h4>
			<button>暂无</button>
		</div>
	</div>
</template>

<script>
import electron from 'electron';

const fs = electron.remote.require("fs");

export default {
	name: 'welcome',
	methods: {
		createWorkbench() {
			this.$router.push('/recorder');
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
		}
	}
}
</script>

<style lang="less">
#welcome {
	margin: 30px auto;
	width: 80%;
	button {
		width: auto;
		border: none;
		padding: 0px;
		display: block;
		background-color: transparent;
		font-size: 14px;
		color: #0000EE;
		&:focus {
			outline: none;
		}
		&:hover {
			text-decoration: underline;
		}
	}
}
</style>


