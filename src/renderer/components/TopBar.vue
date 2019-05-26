<template>
	<div id="top-bar">
		<v-system-bar status color="#71c3c3" :height="height">
			<v-btn
				class="cut-button top-bar-item top-bar-button"
				@click="onSaveClick"
				:style="{ height: height + 'px', width: height + 'px' }"
				:ripple="false"
				color="white"
				flat
			>
				<i class="ms-Icon ms-Icon--Save"></i>
			</v-btn>
			<v-spacer></v-spacer>
			<div id="brand">
				<span class="top-bar-product-name">untitled - Recorder</span>
			</div>
			<v-spacer></v-spacer>
			<v-btn
				class="cut-button top-bar-item top-bar-button"
				:ripple="false"
				:style="{ height: height + 'px', width: height + 'px' }"
				color="white"
				flat
			>
				<i class="ms-Icon ms-Icon--Settings" />
			</v-btn>
		</v-system-bar>
	</div>
</template>

<script>
export default {
	props: ['height', 'status']
};
</script>


<style lang="less">
#top-bar {
	-webkit-app-region: drag;

	.top-bar-item {
		font-size: 16px;
	}

	.top-bar-product-name {
		color: white;
		font-size: 15px;
	}

	.top-bar-button {
		font-weight: bold;
		background-color: #71c3c3;
		-webkit-app-region: no-drag;
	}
}
</style>
