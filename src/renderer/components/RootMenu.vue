<template>
	<div id="root-menu">
		<v-toolbar class="root-menu-item" flat>
			<v-btn-toggle v-model="active" mandatory>
				<v-btn
					v-for="item in shownCategory"
					class="cut-button root-menu-item"
					:key="item"
					:ripple="false"
					@click="jumpTo(item)"
					flat
				>
					<span>{{ $t(`category.${item}`) }}</span>
				</v-btn>
			</v-btn-toggle>
			<v-menu bottom v-if="hiddenCategory.length !== 0">
				<template v-slot:activator="{ on }">
					<v-btn
						class="cut-button dropdown-button root-menu-item"
						:ripple="false"
						v-on="on"
						flat
						><i class="ms-Icon ms-Icon--ChevronDown"></i
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
	props: ['category', 'length'],
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
@height: 30px;
@lemonceThemeColor: #71c3c3;

#root-menu {
	.root-menu-item {
		height: @height;
		background-color: @lemonceThemeColor;
	}

	.v-toolbar {
		border-color: @lemonceThemeColor;

		.v-toolbar__content {
			height: @height !important;
			padding: 0;

			.v-btn-toggle {
				background-color: @lemonceThemeColor;

				.v-btn {
					color: white;
					background-color: @lemonceThemeColor;
					opacity: 1;
				}

				.v-btn--active {
					color: @lemonceThemeColor;
					background-color: white;
				}
			}

			.dropdown-button {
				color: white;
				padding: 0 10px 0 10px;
				background-color: @lemonceThemeColor;
				opacity: 1;
			}
		}
	}
}
</style>
