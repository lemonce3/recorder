<template>
	<div id="root-menu">
		<v-toolbar :height="height" color="#71c3c3" flat>
			<v-btn-toggle
				:style="{ height: height + 'px' }"
				v-model="active"
				mandatory
			>
				<v-btn
					v-for="item in shownCategory"
					class="cut-button"
					:key="item"
					:style="{ height: height + 'px' }"
					:ripple="false"
					@click="jumpTo(item)"
					flat
				>
					<span>{{ $t(`category.${item}`) }}</span>
				</v-btn>
			</v-btn-toggle>
			<v-menu bottom>
				<template v-slot:activator="{ on }">
					<v-btn
						:style="{
							height: height + 'px'
						}"
						class="cut-button"
						:ripple="false"
						v-on="on"
						flat
						><i class="fas fa-chevron-down"></i
					></v-btn>
				</template>
				<v-list>
					<v-list-tile
						v-for="(item, index) in hiddenCategory"
						:key="index"
						@click
					>
						<v-list-tile-title>{{ item }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>
	</div>
</template>

<script>
export default {
	props: ['height', 'category', 'length'],
	data() {
		return {
			active: 1,
			shownCategory: [],
			hiddenCategory: []
		};
	},
	mounted() {
		this.shownCategory = this.category.slice(0, this.length);
		this.hiddenCategory = this.category.slice(this.length);
	},
	methods: {
		jumpTo(path) {
			this.$router.push(path);
		}
	},
	watch: {
		active(categoryIndex) {
			this.$emit('selected-change', categoryIndex);
		}
	}
};
</script>

<style lang="less">
#root-menu .v-toolbar .v-toolbar__content {
	padding: 0;

	.v-btn-toggle {
		background-color: #71c3c3;

		.v-btn {
			color: white;
			background-color: #71c3c3;
			opacity: 1;
		}

		.v-btn--active {
			color: #71c3c3;
			background-color: #f5f5f5;
		}
	}
}
</style>
