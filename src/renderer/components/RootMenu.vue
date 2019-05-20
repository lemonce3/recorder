<template>
	<div id="root-menu">
		<v-toolbar :height="height" flat>
			<v-btn-toggle
				:style="{ height: height + 'px' }"
				v-model="active"
				mandatory
			>
				<v-btn
					v-for="item in shownCategory"
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
							height: height + 'px',
							minWidth: 'auto',
							boxShadow: 'none',
							backgroundColor: 'white',
							margin: '0px'
						}"
						:ripple="false"
						v-on="on"
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
	props: ["height", "category", "length"],
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
			this.$emit("selected-change", categoryIndex);
		}
	}
};
</script>

<style lang="less">

</style>
