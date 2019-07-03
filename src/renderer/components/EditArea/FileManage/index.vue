<template>
	<div id="file-manage" class="edit-area">
		<v-dialog content-class="assert-dialog" v-model="showDialog">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					新建文件
				</v-card-title>

				<v-card-text>
					<v-textarea label="文件名" placeholder="未命名lcrc记录" v-model="newFileName"></v-textarea>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" :ripple="false" flat @click="newFile">
						确定
					</v-btn>
					<v-btn
						color="error"
						:ripple="false"
						flat
						@click="showDialog = false"
					>
						取消
					</v-btn>
				</v-card-actions>
				<v-divider></v-divider>
			</v-card>
		</v-dialog>
		<div class="file-manage-menu br1 bt1">
			<div v-for="(item, index) in buttonList">
				<v-btn
					:key="item"
					:input-value="active === item"
					@click="active = item"
					class="cut-button"
					:ripple="false"
					flat
					>{{ item }}</v-btn
				>
			</div>
		</div>
		<div class="file-manage-content" v-show="active === 'open'">
			<div class="file-card" @click="showDialog = true">
				<div class="file-card-icon">
					<i class="ms-Icon ms-Icon--PageAdd"></i>
				</div>
				<div class="file-card-content">
					<div class="headline">创建新文件</div>
				</div>
			</div>
			<div class="file-card" @click="openFile">
				<div class="file-card-icon">
					<i class="ms-Icon ms-Icon--FabricOpenFolderHorizontal"></i>
				</div>
				<div class="file-card-content">
					<div class="headline">打开其他文件</div>
				</div>
			</div>

			<div class="recent-title">最近打开</div>
			<div
				v-for="(file, index) in recentList"
				@click="loadData(file.path)"
				class="file-card"
			>
				<div class="file-card-icon">
					<i class="ms-Icon ms-Icon--FilePDB"></i>
				</div>
				<div class="file-card-content">
					<div class="headline">{{ file.name }}</div>
					<p>...{{ file.path.slice(-44) }}</p>
				</div>
				<v-btn @click="removeRecent(index)" class="cut-button card-close-button" flat>
					<i class="ms-Icon ms-Icon--ChromeClose"></i>
				</v-btn>
			</div>
		</div>
		<div class="file-manage-content" v-show="active === 'saveAs'">
			<div class="file-card" @click="saveAs">
				<div class="file-card-icon">
					<i class="ms-Icon ms-Icon--PageAdd"></i>
				</div>
				<div class="file-card-content">
					<div class="headline">另存为新文件</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { remote } from 'electron';
import { config, syncConfig } from '../../../utils/config-data';
import { actionStringify, actionListStringify } from '../../../utils/action-util';
import { newFile, saveFile, saveAs, openFile, fileStatus } from '../../../utils/file';
const path = remote.require('path');

function parseFilename(filename) {
	const result = path.parse(filename);

	return {
		name: result.name,
		base: result.base,
		dir: result.dir,
		path: filename
	};
}

export default {
	props: [ 'actionList' ],
	data() {
		return {
			showDialog: false,
			buttonList: ['open', 'saveAs'],
			active: 'open',
			recentList: [],
			newFileName: ''
		};
	},
	mounted() {
		this.recentList = config.recentList;
	},
	methods: {
		newFile() {
			newFile(newFileName);
		},
		saveFile() {
			saveFile(Buffer.from(actionStringify(this.actionList)));
		},
		saveAs() {
			saveAs(Buffer.from(actionStringify(this.actionList)));
		},
		async openFile() {
			const { filename, buffer } = await openFile();
			const newActionList = JSON.parse(buffer.toString());
			this.actionList.splice(0, this.actionList.length, ...newActionList);
			this.pushRecent(filename);
		},
		pushRecent(filename) {
			const exist = this.recentList.findIndex(file => file.path === filename);

			if (exist !== -1) {
				this.recentList.splice(exist, 1);
			} else {
				if (this.recentList.length > 2) {
					this.recentList.pop();
				}
			}

			this.recentList.unshift(parseFilename(filename));
			syncConfig();
		},
		removeRecent(index) {
			this.recentList.splice(index);
			syncConfig();
		}
	}
};
</script>


<style lang="less">
#file-manage {
	border-top: 10px solid #f5f5f5;
	height: 100%;
	width: 100%;
	background-color: #f5f5f5;

	.file-manage-menu {
		width: 30%;
		height: 100%;
		float: left;

		div .v-btn {
			width: 100%;
		}
	}

	.file-manage-content {
		width: 70%;
		height: 100%;
		float: left;

		.recent-title {
			margin: 0 0 20px 10px;
			font-size: 30px;
		}
		.file-card {
			position: relative;
			margin: 0 20px 10px 20px;
			color: white;
			background-color: #0097a7;
			height: 80px;

			.card-close-button {
				color: white;
				position: absolute;
				top: 5px;
				right: 5px;
				width: 20px;
				height: 20px;
			}

			.file-card-icon {
				width: 35%;
				height: 100%;
				float: left;
				text-align: center;

				i {
					font-size: 50px;
				}
			}

			.file-card-content {
				padding: 2px 4px 0 0;
				width: 65%;
				height: 100%;
				float: left;

				p {
					word-break: break-all;
					height: 40px;
					margin: 0;
				}
			}
		}
	}
}
</style>