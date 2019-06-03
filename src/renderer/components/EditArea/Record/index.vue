<template>
	<div id="record">
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
		</v-toolbar>
		<div id="action-list">
			<v-list>
				<v-list-tile
					v-for="(item, index) in actionList"
					:key="item.id"
					class="raw-item bb1"
				>
					<v-container grid-list-md text-xs-center fill-height>
						<v-layout
							align-center
							justify-center
							style="text-align:center;"
							fill-height
						>
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
							<v-flex xs4>
								<div>{{ item.type }}</div>
							</v-flex>
							<v-flex :xs6="selectmode" :xs7="!selectmode">
								<img
									src="http://img.boqiicdn.com/Data/BK/A/1406/26/img63991403776002.jpg"
								/>
							</v-flex>
							<v-flex xs1>
								<v-btn class="cut-button raw-delete-button" flat>
									<i class="ms-Icon ms-Icon--Delete"></i>
								</v-btn>
							</v-flex>
						</v-layout>
					</v-container>
					<!-- <v-list-tile-title>{{ item.type }}</v-list-tile-title> -->
				</v-list-tile>
			</v-list>
		</div>
	</div>
</template>

<script>
import { read, save } from '../../../utils/data-store';
import { actionToBuffer, bufferToAction } from '../../../utils/action-util';

export default {
	props: ['actionList'],
	data() {
		return {
			activeActionIndex: 1,
			recording: false,
			selectmode: false,
			selected: []
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

		.container .layout .flex {
			line-height: 100%;
		}

		.raw-item {
			height: 80px;
			padding: 0 0 0 8px;
			margin-bottom: 4px;

			.v-list__tile {
				height: 100%;
				padding: 0;

				.container .layout .flex {
					img {
						height: 70px;
					}

					.raw-delete-button {
						color: white;
						background-color: rgba(255, 0, 0, 0.7);
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
}
</style>
