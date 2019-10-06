<template>
	<div id="record">
		<v-snackbar v-model="$store.state.workspace.traceArchived" :timeout="0" :bottom="true" color="blue">
			<v-spacer></v-spacer>
			<span>已归档，无法继续录制。</span>
			<v-spacer></v-spacer>
			<v-btn color="white" flat @click="snackbar = false">
				<i class="fas fa-times-circle"></i>
			</v-btn>
		</v-snackbar>
		<v-toolbar height="30px" flat class="bb1">
			<v-btn
				class="cut-button"
				@click="startRecord"
				:ripple="false"
				color="red"
				flat
				:input-value="status.recording"
				:disabled="selectmode || $store.state.workspace.traceArchived"
			>
				<!-- <i class="ms-Icon ms-Icon--Record2"></i> -->
				<i class="ms-Icon ms-Icon--CircleFill"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="stopRecord"
				:ripple="false"
				flat
				:disabled="selectmode || $store.state.workspace.traceArchived"
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
				:disabled="selectmode || $store.state.workspace.traceArchived"
			>
				<i class="ms-Icon ms-Icon--GroupedList"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="switchSelectAll"
				:ripple="false"
				flat
				:input-value="selected.length === actionList.length && selected.length !== 0"
				:disabled="!selectmode || $store.state.workspace.traceArchived"
			>
				<i class="ms-Icon ms-Icon--CheckList"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="deleteSelected"
				:ripple="false"
				flat
				:disabled="!selectmode || $store.state.workspace.traceArchived"
			>
				<i class="ms-Icon ms-Icon--Delete"></i>
			</v-btn>
			<!-- <span>
				第{{activeActionIndex + 1}}/{{actionList.length}}个
			</span> -->
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
						<div>{{ $t(`action.type.${item.type}`) }}</div>
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
	data() {
		return {
			caseId: '',
			actionList: [],
			actionIndex: [],
			activeActionIndex: -1,
			selectmode: false,
			selected: [],
			socket: null,
			status: {
				recording: false,
				traceArchived: false
			}
		};
	},
	mounted() {
		
	},
	methods: {
		startRecord() {
			this.$workspace.status.startRecord();
		},
		async stopRecord() {
			this.$$workspace.status.stopRecord();
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
		async deleteSelected() {
			if (this.selected.length === this.actionList.length) {
				await this.$workspace.project.list[this.projectId].document.caseList[this.caseId].emptyAction();
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
		delete(action) {
			this.$workspace.action.delete(projectPath, caseName, action.id);
		},
		getActionList() {
			this.actionList = this.$workspace.actionList.get(projectPath, caseName);
		},
		async updateData() {
			console.log('topbar')
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
