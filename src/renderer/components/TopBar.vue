<template>
	<div id="top-bar">
		<v-system-bar status>
			<v-btn
				class="cut-button top-bar-item top-bar-button"
				@click="saveCurrentProject"
				:ripple="false"
				flat
			>
				<i class="ms-Icon ms-Icon--Save"></i>
			</v-btn>
			<v-spacer></v-spacer>
			<div id="brand">
				<span class="top-bar-product-name">{{filename}} - Recorder</span>
			</div>
			<v-spacer></v-spacer>
			<v-btn
				class="cut-button top-bar-item top-bar-button"
				@click="$emit('open-setting')"
				:ripple="false"
				flat
			>
				<i class="ms-Icon ms-Icon--Settings" />
			</v-btn>
		</v-system-bar>
	</div>
</template>

<script>
export default {
	props: ['height', 'status'],
	computed: {
		projectId() {
			return this.$store.state.workspace.project;
		},
		filename() {
			const project = this.$workspace.project.list[this.projectId];

			return project ? project.document.name : '';
		}
	},
	methods: {
		async saveCurrentProject() {
			await this.$workspace.project.list[this.projectId].save();
		}
	}
};
</script>


<style lang="less">
@width: 30px;
@lemonceThemeColor: #71c3c3;

#top-bar {
	-webkit-app-region: drag;

	.v-system-bar {
		border-color: @lemonceThemeColor;
		background-color: @lemonceThemeColor;
		height: @width !important;
	}

	.top-bar-item {
		font-size: 16px;
		width: @width;
		height: @width;
	}

	.top-bar-product-name {
		color: white;
		font-size: 15px;
	}

	.top-bar-button {
		color: white;
		background-color: @lemonceThemeColor;
		-webkit-app-region: no-drag;
	}
}
</style>
