<template>
	<div id="record">
		<v-toolbar height="30px" flat class="bb1">
			<v-btn
				class="cut-button"
				@click="startRecord"
				:ripple="false"
				color="red"
				flat
				:input-value="status.recording"
				:disabled="selectmode"
			>
				<!-- <i class="ms-Icon ms-Icon--Record2"></i> -->
				<i class="ms-Icon ms-Icon--CircleFill"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="stopRecord"
				:ripple="false"
				flat
				:disabled="selectmode"
			>
				<i class="ms-Icon ms-Icon--StopSolid"></i>
			</v-btn>
			<v-divider class="mx-1" vertical></v-divider>
			<v-btn
				class="cut-button"
				@click="switchSelectMode"
				:ripple="false"
				flat
				:input-value="selectmode"
			>
				<i class="ms-Icon ms-Icon--GroupedList"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="switchSelectAll"
				:ripple="false"
				flat
				:input-value="selected.length === actionList.length"
				:disabled="!selectmode"
			>
				<i class="ms-Icon ms-Icon--CheckList"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="deleteSelected"
				:ripple="false"
				flat
				:disabled="!selectmode"
			>
				<i class="ms-Icon ms-Icon--Delete"></i>
			</v-btn>
		</v-toolbar>
		<div id="action-list">
			<v-list>
				<v-list-tile
					v-for="(item, index) in actionList"
					:key="item.id"
					class="raw-item bb1"
				>
					<div v-show="selectmode" class="select-mode-item br1">
						<v-btn
							class="cut-button select-mode-button"
							@click.stop="switchSelected(index)"
							:ripple="false"
							flat
						>
							<i
								:class="[
									'ms-Icon ',
									selected.includes(index)
										? 'ms-Icon--CheckboxComposite'
										: 'ms-Icon--Checkbox'
								]"
							></i>
						</v-btn>
					</div>
					<div class="raw-type">
						<div>{{ item.type }}</div>
					</div>
					<div class="raw-image" :style="{ width: rawImageWidth }">
						<img :src="item.extend.image" />
					</div>
					<div class="cut-button raw-delete">
						<v-btn class="cut-button raw-button" flat>
							<i class="ms-Icon ms-Icon--Delete"></i>
						</v-btn>
					</div>
				</v-list-tile>
			</v-list>
		</div>
	</div>
</template>

<script>
import { nativeImage } from 'electron';
import io from 'socket.io-client';
import resolver from '../../../../../../recoder-resolver/';

const getId = (length = 5) =>
		Array(length)
			.fill('')
			.map(() =>
				Math.random()
					.toString(16)
					.substring(2, 8)
			)
			.join('-');

export default {
	props: ['status'],
	data() {
		return {
			caseId: '',
			actionList: [],
			actionIndex: [],
			activeActionIndex: 1,
			selectmode: false,
			selected: [],
			socket: null,
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
			snapshot.id = getId();
			this.$workspace.project.list[this.projectId].IDocument.addTrace(snapshot);
			resolver.emit('snapshot', snapshot);
		});

		socket.on('receive-action', action => {
			if (!this.status.recording) {
				return;
			}

			const { bounds, dataURL } = action.screenshot;
			const { rect } = action.data;

			const offsetRect = {
				x: Math.floor(rect.x) - bounds.x,
				y: Math.floor(rect.y) - bounds.y,
				width: Math.round(rect.width),
				height: Math.round(rect.height)
			};

			action.id = getId();
			const image = nativeImage.createFromDataURL(dataURL);
			action.screenshot.id = action.id
			delete action.screenshot.dataURL;

			this.$workspace.project.list[this.projectId].IDocument.addTrace(action, image.toPNG());

			action.extend = {
				image: image.crop(offsetRect).toDataURL()
			};

			resolver.emit('action', action);
		});

		resolver.on('resolved-action', action => {
			this.$workspace.project.list[this.projectId].document.caseList[this.caseId].addAction(action);
		});
	},
	methods: {
		createCase(casename) {

		},
		startRecord() {
			this.status.recording = true;
		},
		stopRecord() {
			this.status.recording = false;
		},
		switchSelectMode() {
			this.selected = [];
			this.selectmode = !this.selectmode;
		},
		switchSelected(id) {
			const index = this.selected.indexOf(id);

			index === -1 ? this.selected.push(id) : this.selected.splice(index, 1);
		},
		switchSelectAll() {
			if (this.selected.length === this.actionList.length) {
				this.selected = [];
			} else {
				this.actionList.forEach((action, index) => this.selected.push(index));
			}
		},
		deleteSelected() {
			if (this.selected.length === this.actionList.length) {
				this.actionList.splice(0, this.actionList.length);
			} else {
				this.selected.forEach(index => this.actionList.splice(index, 1));
			}

			this.selected = [];
		},
		showDialog(p) {
			this.p = p;
			this.dialogReadOnly = !this.editableProperty.includes(p);
			this.dialogContent = this.activeAction.data[p].value;
			this.dialog = true;
		},
		comfirmEdit() {
			this.activeAction.data[this.p].value = this.dialogContent;
			this.dialog = false;
		},
		showSnackbar() {
			this.snackbar = true;
		},
		update(action) {
			this.$workspace.project.list[filename].document.caseList[casename].updateAction(action);
		},
		delete(action) {
			this.$workspace.project.list[filename].document.caseList[casename].deleteAction(action.id);
		},
		add(action) {
			this.$workspace.project.list[filename].document.caseList[casename].addAction(prevId, action);
		}
	},
	computed: {
		activeAction() {
			return this.activeActionIndex !== null
				? this.actionList[this.activeActionIndex]
				: {};
		},
		rawImageWidth() {
			return this.selectmode ? '60%' : '70%';
		},
		projectId() {
			return this.$store.state.workspace.project;
		}
	},
	watch: {
		projectId() {
			const caseList = this.$workspace.project.list[this.projectId].document.caseList;
			console.log(caseList, this.projectId);
			this.caseId = Object.keys(caseList).find(id => caseList[id].name === '__default__');
			
			this.actionIndex = this.$workspace.getter.actionIndex(this.projectId, this.caseId);
		},
		caseId() {
			this.actionIndex = this.$workspace.getter.actionIndex(this.projectId, this.caseId);
		},
		actionIndex() {
			if (this.projectId && this.caseId) {
				this.actionList.splice(0, this.actionList.length, ...JSON.parse(this.$workspace.getter.actionList(this.projectId, this.caseId)));
			}
		}
	}
};
</script>

<style lang="less">
#record {
	.v-toolbar .v-btn {
		font-size: 16px;
		height: 30px;
		width: 30px;
	}

	#action-list {
		height: 506px;
		overflow-y: scroll;

		.v-list {
			padding: 0;
		}

		.raw-item {
			height: 80px;

			.v-list__tile {
				height: 100%;
				padding: 0;

				div {
					text-align: center;
				}

				.select-mode-item {
					height: 100%;
					width: 10%;

					.select-mode-button {
						height: 100%;
						width: 100%;
					}
				}

				.raw-type {
					width: 20%;
				}

				.raw-image {
					max-height: 100%;

					img {
						max-width: 100%;
						max-height: 80px;
					}
				}

				.raw-delete {
					height: 100%;
					width: 10%;
				}

				.raw-button {
					color: white;
					background-color: rgba(255, 0, 0, 0.7);
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
