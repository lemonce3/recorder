<template>
	<div id="record">
		<v-snackbar v-model="snackbar" :timeout="1000" :bottom="true" color="green">
			<v-spacer></v-spacer>
			<span>已复制到剪贴板</span>
			<v-spacer></v-spacer>
			<v-btn color="white" flat @click="snackbar = false">
				<i class="fas fa-times-circle"></i>
			</v-btn>
		</v-snackbar>
		<v-dialog v-model="dialog">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					编辑
				</v-card-title>

				<v-card-text>
					<v-textarea v-model="dialogContent" :readonly="dialogReadOnly" />
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-menu bottom>
						<template v-slot:activator="{ on }">
							<v-btn :ripple="false" v-on="on">
								<i class="fas fa-chevron-down"></i>
							</v-btn>
						</template>
						<v-list>
							<v-list-tile v-for="(item, index) in mode" :key="index" @click>
								<v-list-tile-title>{{ item }}</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
					<v-spacer></v-spacer>
					<v-btn color="primary" :ripple="false" flat @click="comfirmEdit">
						确定
					</v-btn>
					<v-btn color="error" :ripple="false" flat @click="dialog = false">
						取消
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-toolbar height="30px" flat class="bb1">
			<v-btn
				class="cut-button"
				@click="onStartClick"
				:ripple="false"
				color="red"
				flat
				:input-value="recording"
				:disabled="selectmode"
			>
				<!-- <i class="ms-Icon ms-Icon--Record2"></i> -->
				<i class="ms-Icon ms-Icon--CircleFill"></i>
			</v-btn>
			<v-btn
				class="cut-button"
				@click="onStopClick"
				:ripple="false"
				flat
				:disabled="selectmode"
			>
				<i class="ms-Icon ms-Icon--StopSolid"></i>
			</v-btn>
			<v-divider class="mx-1" vertical></v-divider>
			<v-btn
				class="cut-button"
				@click="onListClick"
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
			<v-divider class="mx-1" vertical></v-divider>
			<v-btn
				class="cut-button"
				@click="onSaveClick"
				:ripple="false"
				flat
				:disabled="selectmode"
			>
				<i class="ms-Icon ms-Icon--Save"></i>
			</v-btn>
		</v-toolbar>
		<div id="action-list">
			<v-expansion-panel v-model="activeActionIndex">
				<v-expansion-panel-content
					expand-icon="ms-Icon ms-Icon--ChevronDown"
					v-for="(action, index) in actionList"
					:key="action.id"
				>
					<template v-slot:header>
						<v-container
							grid-list-md
							text-xs-center
							fill-height
							class="bl1 br1"
						>
							<v-layout row wrap fill-height>
								<v-flex v-show="selectmode" xs1 align-self-center br1>
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
								</v-flex>
								<v-flex xs1 align-self-center>
									<i :class="iconClass[action.type]"></i>
								</v-flex>
								<v-flex xs3 align-self-center>
									{{ action.type }}
								</v-flex>
								<v-flex :xs7="selectmode" :xs8="!selectmode" align-self-center>
									{{ action.data.text.value }}
								</v-flex>
							</v-layout>
						</v-container>
					</template>
					<div class="record-detail-content">
						<div
							class="record-detail-item"
							v-for="(item, index) in action.data"
						>
							<property
								v-model="item.value"
								:name="item.key"
								:key="index"
								:editable="editableProperty.includes(item.key)"
								@call-snackbar="showSnackbar(item.key)"
								@call-dialog="showDialog(item.key)"
							/>
						</div>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</div>
	</div>
</template>

<script>
import Property from './Property';
import { read, save } from '../../../utils/data-store';
import { actionToBuffer, bufferToAction } from '../../../utils/action-util';

export default {
	props: ['category', 'actionList'],
	components: {
		Property
	},
	data() {
		return {
			headers: [
				{ text: 'type', value: 'type', sortable: false },
				{ text: 'text', value: 'text', sortable: false }
			],
			snackbar: false,
			dialog: false,
			activeActionIndex: 1,
			p: null,
			dialogReadOnly: false,
			mode: [1, 2, 3],
			dialogContent: '',
			editableProperty: ['path', 'text'],
			recording: false,
			selectmode: false,
			selected: [],
			iconClass: {
				click: 'fas fa-mouse-pointer',
				rightClick: 'fas fa-mouse-pointer',
				doubleClick: 'fas fa-mouse-pointer',
				input: 'fas fa-i-cursor',
				check: 'far fa-check-square',
				uncheck: 'far fa-square',
				select: 'fas fa-bars'
			}
		};
	},
	methods: {
		onStartClick() {
			this.recording = true;
			// this.$api.startRecord();
		},
		onStopClick() {
			this.recording = false;
			// this.$api.stopRecord();
		},
		onListClick() {
			this.selected = [];
			this.selectmode = !this.selectmode;
		},
		onSaveClick() {
			this.$electron.remote.dialog.showSaveDialog(filename => {
				save(filename, actionToBuffer(this.actionList));
			});
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
				this.actionList = [];
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
		}
	},
	computed: {
		activeAction() {
			return this.activeActionIndex !== null
				? this.actionList[this.activeActionIndex]
				: {};
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
	}

	.v-expansion-panel__header {
		height: 36px;
		padding: 0 4px 0 4px;

		.container {
			margin: 0 2px 0 4px;

			.select-mode-button {
				width: 100%;
			}

			.flex {
				line-height: 100%;

				i {
					font-size: 18px;
				}
			}
		}

		.v-expansion-panel__header__icon {
			margin-left: 4px;

			.v-icon {
				font-size: 16px;
			}
		}
	}

	.v-expansion-panel__body {
		.record-detail-content {
			border: 2px solid skyblue;

			.record-detail-item {
				height: 56px;
				margin: 4px;

				.flex {
					height: 100%;
				}
			}
		}
	}
}
</style>
