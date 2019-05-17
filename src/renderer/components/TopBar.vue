<template>
	<div id="top-bar">
		<v-system-bar status color="#71c3c3" :height="height">
			<div id="brand">
				<span class="top-bar-item">
					<i class="fab fa-html5"></i>
				</span>
				<span class="top-bar-product-name">Lemonce Recorder</span>
			</div>
			<v-spacer></v-spacer>
			<v-btn class="top-bar-item top-bar-setting-button" :style="{height: height + 'px'}" :ripple="false">
				<i class="fas fa-cog" />
			</v-btn>
		</v-system-bar>
	</div>
</template>

<script>
export default {
	props: ["height", "status"]
};
</script>


<style lang="less">
#top-bar {
	-webkit-app-region: drag;

	.top-bar-item {
		margin: 0 4px 0 4px;
		font-size: 20px;
		width: 20px;
		min-width: auto;
		box-shadow: none;
	}

	.top-bar-product-name {
		font-weight: bold;
		font-size: 15px;
	}

	.top-bar-setting-button {
		background-color: rgba(0, 0, 255, 0.2);
		-webkit-app-region: no-drag;
	}
}
</style>
