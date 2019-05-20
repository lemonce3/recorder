<template>
	<div id="record" class="bt1">
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
							<v-btn
								:style="{
									minWidth: 'auto',
									boxShadow: 'none',
									margin: '0px'
								}"
								:ripple="false"
								v-on="on"
							>
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
					<v-btn color="primary" :ripple="false" flat @click="onDialogOK">
						确定
					</v-btn>
					<v-btn color="error" :ripple="false" flat @click="dialog = false">
						取消
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-toolbar height="30px" flat class="bb1">
			<v-btn class="cut-button" :ripple="false" flat>
				<i class="fas fa-circle record-child-menu-record"></i>
			</v-btn>
			<v-btn class="cut-button" :ripple="false" flat>
				<i class="fas fa-stop"></i>
			</v-btn>
			<v-btn class="cut-button" :ripple="false" flat>
				<i class="fas fa-trash-alt"></i>
			</v-btn>
			<v-btn class="cut-button" :ripple="false" flat>
				<i class="fas fa-download"></i>
			</v-btn>
		</v-toolbar>
		<div id="action-list">
			<v-expansion-panel v-model="activeActionIndex">
				<v-expansion-panel-content
					expand-icon="fa-chevron-down"
					v-for="action in actionList"
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
								<v-flex xs1 align-self-center>
									<i :class="iconClass[action.type]"></i>
								</v-flex>
								<v-flex xs3 align-self-center>
									<span>{{ action.type }}</span>
								</v-flex>
								<v-flex xs8 align-self-center>
									<span>{{ action.data.text.value }}</span>
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
								@call-snackbar="onCallSnackbar(item.key)"
								@call-dialog="onCallDialog(item.key)"
							/>
						</div>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</div>
	</div>
</template>

<script>
import Property from "./Property";

export default {
	props: ["category", "actionList"],
	components: {
		Property
	},
	data() {
		return {
			snackbar: false,
			dialog: false,
			activeActionIndex: 1,
			p: null,
			dialogReadOnly: false,
			mode: [1, 2, 3],
			dialogContent: "",
			editableProperty: ["path", "text"],
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
		onCallDialog(p) {
			this.p = p;
			this.dialogReadOnly = !this.editableProperty.includes(p);
			this.dialogContent = this.activeAction.data[p].value;
			this.dialog = true;
		},
		onDialogOK() {
			this.activeAction.data[this.p].value = this.dialogContent;
			this.dialog = false;
		},
		onCallSnackbar() {
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
		height: 30px;
		width: 30px;
	}

	#action-list {
		height: 506px;
		overflow-y: scroll;
	}

	.v-expansion-panel__header {
		min-height: auto;
		height: 36px;
		padding: 0 4px 0 4px;

		.container {
			margin: 0 2px 0 4px;

			.flex {
				i {
					font-size: 18px;
					height: 20px;
					width: 15px;
				}
			}
		}

		.v-icon {
			font-size: 16px;
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
