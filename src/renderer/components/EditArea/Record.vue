<template>
	<div id="edit-area" :style="{ top: top + 'px' }">
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
					{{ activeAction.path }}
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
					<v-btn color="primary" flat @click="dialog = false">
						确定
					</v-btn>
					<v-btn color="error" flat @click="dialog = false">
						取消
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-toolbar height="30px">
			<v-btn :ripple="false" flat>
				<i class="fas fa-circle record-child-menu-record"></i>
			</v-btn>
			<v-btn :ripple="false" flat>
				<i class="fas fa-stop"></i>
			</v-btn>
			<v-btn :ripple="false" flat>
				<i class="fas fa-trash-alt"></i>
			</v-btn>
			<v-btn :ripple="false" flat>
				<i class="fas fa-download"></i>
			</v-btn>
		</v-toolbar>
		<v-expansion-panel v-model="activeActionIndex">
			<v-expansion-panel-content
				expand-icon="fa-chevron-down"
				v-for="item in actionList"
				:key="item.id"
			>
				<template v-slot:header>
					<v-divider class="mx-1" inset vertical></v-divider>
					<v-container grid-list-md text-xs-center>
						<v-layout row wrap>
							<v-flex xs1 align-self-center>
								<i class="fas fa-mouse-pointer"></i>
							</v-flex>
							<v-flex xs3 align-self-center>
								<span>{{ item.type }}</span>
							</v-flex>
							<v-flex xs8 align-self-center>
								<span>{{ item.text }}</span>
							</v-flex>
						</v-layout>
					</v-container>
					<v-divider class="mx-1" inset vertical></v-divider>
				</template>
				<div class="record-detail-content">
					<div class="record-detail-item" v-for="i in 3">
						<v-container text-xs-center>
							<v-layout align-center>
								<v-flex xs11>
									<v-text-field
										readonly
										hide-details
										@dblclick.stop="dialog = true"
										label="path"
										v-model="item.path"
										box
									></v-text-field>
								</v-flex>
								<v-flex xs1>
									<v-layout column>
										<v-btn @click="snackbar = true" :ripple="false">
											<i class="fas fa-copy"></i>
										</v-btn>
										<v-menu bottom>
											<template v-slot:activator="{ on }">
												<v-btn :ripple="false" v-on="on">
													<i class="fas fa-chevron-down"></i>
												</v-btn>
											</template>
											<v-list>
												<v-list-tile
													v-for="(item, index) in mode"
													:key="index"
													@click
												>
													<v-list-tile-title>{{ item }}</v-list-tile-title>
												</v-list-tile>
											</v-list>
										</v-menu>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-container>
					</div>
				</div>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</div>
</template>

<script>
export default {
	props: ["top", "category", "actionList"],
	data() {
		return {
			snackbar: false,
			dialog: false,
			activeActionIndex: null,
			mode: [1, 2, 3]
		};
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
#edit-area {
	background-color: gray;
	height: 100%;
	width: 100%;
	border-top: 1px solid #ccc;

	.v-toolbar {
		box-shadow: none;
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);

		.v-btn {
			height: 30px;
			width: 30px;
			min-width: auto;
			padding: 0;
			margin: 0;
		}
	}

	.v-expansion-panel__header {
		min-height: auto;
		height: 36px;
		padding: 0 4px 0 4px;

		.container {
			padding: 0;

			.layout {
				height: 100%;

				.flex {
					i {
						font-size: 18px;
						height: 20px;
						width: 15px;
					}
				}
			}
		}

		.v-divider {
			margin: 0;
			max-height: 100%;
		}

		.v-expansion-panel__header__icon {
			.v-icon {
				font-size: 16px;
			}
		}
	}

	.v-expansion-panel__body {
		.record-detail-content {
			border: 4px solid skyblue;

			.record-detail-item {
				height: 56px;
				margin: 4px;

				.container {
					padding: 0;
					height: 100%;

					.layout {
						height: 100%;

						.flex {
							height: 100%;

							.layout {
								.v-btn {
									height: 50%;
									margin: 0;
									min-width: auto;
									box-shadow: none;
									border-radius: 0;
								}
							}
						}
					}
				}
			}
		}

		.v-input__slot {
			border-radius: 0;
			min-height: auto;
		}
	}
}
</style>
