<template>
	<div id="resolve" class="edit-area">
		<v-snackbar v-model="snackbar" :timeout="1000" :bottom="true" color="green">
			<v-spacer></v-spacer>
			<span>已复制到剪贴板</span>
			<v-spacer></v-spacer>
			<v-btn color="white" flat @click="snackbar = false">
				<i class="fas fa-times-circle"></i>
			</v-btn>
		</v-snackbar>
		<v-dialog content-class="assert-dialog" v-model="assert.showDialog">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					添加断言
				</v-card-title>

				<v-card-text>
					<v-textarea label="内容" v-model="assert.content"></v-textarea>
				</v-card-text>
				<div class="image-preview">
					<div class="image-content">
						<img :src="assert.image" />
					</div>
					<div class="image-action bt1 bb1">
						<v-btn
							:ripple="false"
							@click="replaceImageWithScreenshot(assert)"
							class="cut-button br1"
							flat
						>
							<i class="ms-Icon ms-Icon--Cut"></i>
						</v-btn>
						<v-btn
							:ripple="false"
							@click="replaceImageWithFile(assert)"
							class="cut-button"
							flat
						>
							<i class="ms-Icon ms-Icon--Upload"></i>
						</v-btn>
					</div>
				</div>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" :ripple="false" flat @click="insertAssert">
						确定
					</v-btn>
					<v-btn
						color="error"
						:ripple="false"
						flat
						@click="assert.showDialog = false"
					>
						取消
					</v-btn>
				</v-card-actions>
				<v-divider></v-divider>
			</v-card>
		</v-dialog>
		<v-dialog id="property-dialog" v-model="property.showDialog">
			<v-card>
				<v-card-title class="headline grey lighten-2" primary-title>
					编辑
				</v-card-title>

				<v-card-text>
					<v-textarea
						v-model="property.content"
						:readonly="property.readonly"
					/>
				</v-card-text>

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
					<v-btn
						color="error"
						:ripple="false"
						flat
						@click="property.showDialog = false"
					>
						取消
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-toolbar height="30px" flat class="bb1">
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
			<v-btn
				class="cut-button"
				@click="assert.showDialog = true"
				:ripple="false"
				flat
				:disabled="selected.length > 1"
			>
				<i class="ms-Icon ms-Icon--RedEye"></i>
			</v-btn>
		</v-toolbar>
		<div id="action-list">
			<v-expansion-panel v-model="activeActionIndex" focusable>
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
							@click.stop="focused = index"
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
								<v-flex :xs7="selectmode" :xs8="!selectmode" align-self-center style="max-width: 200px;">
									<div>{{ action.extend.property.text.value }}</div>
								</v-flex>
							</v-layout>
						</v-container>
					</template>
					<div class="record-detail-content">
						<div
							class="record-detail-item"
							v-for="(item, index) in action.extend.property"
						>
							<property
								v-model="item.value"
								:name="item.key"
								:key="index"
								:editable="editableProperty.includes(item.key)"
								@call-snackbar="showSnackbar(item.key)"
								@call-dialog="showPropertyDialog(action.id, item.key)"
							/>
						</div>
						<div class="image-preview">
							<div class="image-content">
								<img :src="action.extend.image" />
							</div>
							<div class="image-action bt1">
								<v-btn
									:ripple="false"
									@click="recropActionImage(action)"
									class="cut-button br1"
									flat
									:disabled="action.type === 'assert'"
								>
									<i class="ms-Icon ms-Icon--Annotation"></i>
								</v-btn>
								<v-btn
									:ripple="false"
									@click="replaceImageWithScreenshot(action.extend)"
									class="cut-button br1"
									flat
								>
									<i class="ms-Icon ms-Icon--Cut"></i>
								</v-btn>
								<v-btn
									:ripple="false"
									@click="replaceImageWithFile(action.extend)"
									class="cut-button"
									flat
								>
									<i class="ms-Icon ms-Icon--Upload"></i>
								</v-btn>
							</div>
						</div>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</div>
	</div>
</template>

<script>
import Property from './Property';
import { ipcRenderer, nativeImage } from 'electron';
// import mock from './mock';

const EVENT_PREFIX = 'ELECTRON_RECORDER::';
const skeletonImage = 'data:image/jpeg;base64,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';
const getId = (length = 5) => Array(length).fill('').map(() => Math.random().toString(16).substring(2, 8)).join('-');

function AssertFactory({ content, image }) {
	return {
		type: 'assert',
		id: getId(),
		extend: {
			property: {
				text: {
					key: 'text',
					value: content
				}
			},
			image
		}
	}
}

export default {
	components: {
		Property
	},
	data() {
		return {
			actionList: [],
			actionIndex: [],
			caseId: '',
			snackbar: false,
			assert: {
				content: '',
				showDialog: false,
				image: skeletonImage
			},
			property: {
				actionId: null,
				name: null,
				showDialog: false,
				content: '',
				readonly: false
			},
			activeActionIndex: 0,
			activeActionId: '',
			mode: [1, 2, 3],
			editableProperty: ['path', 'text', 'detail'],
			recording: false,
			selectmode: false,
			selected: [],
			focused: null,
			iconClass: {
				assert: 'far fa-eye',
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
	mounted() {
		console.log('resolve mount');
	},
	methods: {
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
				this.actionList.length = 0;
			} else {
				this.selected.forEach(index => this.actionList.splice(index, 1));
			}

			this.selected = [];
		},
		initAssert() {
			this.assert = {
				content: '',
				showDialog: false,
				image: skeletonImage
			};
		},
		insertAssert() {
			const assert = AssertFactory(this.assert);
			const index = this.selectmode ? this.selected : this.focused || 0;
			const prevId = this.actionList[index].id;
			this.$workspace.project.list[this.projectId].document.caseList[this.caseId].insertAction(assert, prevId);
			this.initAssert();
		},
		showPropertyDialog(actionId, propertyName) {
			const editingAction = this.property.editingAction = this.actionList.find(item => item.id === actionId);
			this.property.name = propertyName;
			this.property.readonly = !this.editableProperty.includes(propertyName);
			this.property.content = editingAction.extend.property[propertyName].value;
			this.property.showDialog = true;
		},
		comfirmEdit() {
			const action = this.property.editingAction;
			action.extend.property[this.property.name].value = this.property.content;
			console.log(action, 11111111111111111111);
			this.$workspace.project.list[this.projectId].document.caseList[this.caseId].updateAction(action);
			this.property.showDialog = false;
		},
		showSnackbar() {
			this.snackbar = true;
		},
		async recropActionImage(action) {
			const buffer = await this.$workspace.project.list[this.projectId].IDocument.getTraceImage(action.id);
			console.log(buffer);
			const dataURL = nativeImage.createFromBuffer(buffer).toDataURL();
			ipcRenderer.once(EVENT_PREFIX + 'recrop-image-reply', (event, { dataURL }) => action.extend.image = dataURL);
			console.log(dataURL);
			ipcRenderer.send(EVENT_PREFIX + 'recrop-image', {
				size: action.screenshot.size,
				dataURL
			});
		},
		replaceImageWithFile(target) {
			this.$electron.remote.dialog.showOpenDialog({
					filters: {
						name: 'image',
						extensions: ['']
					}
				},
				async filename => {
					if (filename[0]) {
						target.image = nativeImage.createFromPath(filename[0]).toDataURL();
					}
				});
		},
		replaceImageWithScreenshot(target) {
			ipcRenderer.once(EVENT_PREFIX + 'replace-image-with-screenshot-reply', (event, { dataURL }) => target.image = dataURL);

			ipcRenderer.send(EVENT_PREFIX + 'replace-image-with-screenshot');
		}
	},
	computed: {
		projectId() {
			return this.$store.state.workspace.project;
		}
	},
	watch: {
		projectId() {
			const caseList = this.$workspace.project.list[this.projectId].document.caseList;
			console.log(caseList, this.projectId);
			this.caseId = Object.keys(caseList).find(id => caseList[id].name === '__default__');
		},
		caseId() {
			this.actionIndex = this.$workspace.getter.actionIndex(this.projectId, this.caseId);
		},
		actionIndex() {console.log('resolve');
			if (this.projectId && this.caseId) {
				this.actionList.splice(0, this.actionList.length, ...JSON.parse(this.$workspace.getter.actionList(this.projectId, this.caseId)));
				console.log(this.actionList, 'resolve');
			}
		}
	}
};
</script>

<style lang="less">
#resolve {
	height: 100%;
	width: 100%;
	background-color: white;

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

				div {
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}

				.v-btn {
					div {
						height: 18px;
					}
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

			.image-preview {
				height: 200px;
				width: 100%;

				.image-content {
					width: 100%;
					height: 85%;
					text-align: center;

					img {
						max-height: 100%;
						max-width: 100%;
					}
				}

				.image-action {
					height: 15%;

					.v-btn {
						float: left;
						height: 100%;
						width: 33.333%;
					}
				}
			}
		}
	}
}

.assert-dialog .v-card .image-preview {
	.image-content {
		text-align: center;
	}

	.image-action {
		height: 30px;

		.v-btn {
			height: 100%;
			width: 50%;
			float: left;
		}
	}
}
</style>
