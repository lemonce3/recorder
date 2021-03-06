<template>
	<v-container text-xs-center fill-height>
		<v-layout align-center fill-height>
			<v-flex xs11>
				<v-text-field
					v-model="content"
					:label="name"
					:readonly="!editable"
					@input="$emit('input', content)"
					@dblclick.stop="$emit('call-dialog', name)"
					background-color="rgba(0, 0, 0, 0)"
					hide-details
					box
				></v-text-field>
			</v-flex>
			<v-flex xs1 v-if="multiMode">
				<v-layout column fill-height>
					<v-btn
						:ripple="false"
						@click="writeContentToClipBoard"
						class="cut-button bb1"
						flat
					>
						<i class="ms-Icon ms-Icon--Copy"></i>
					</v-btn>
					<v-menu bottom>
						<template v-slot:activator="{ on }">
							<v-btn class="cut-button" :ripple="false" v-on="on" flat>
								<i class="ms-Icon ms-Icon--ChevronDown"></i>
							</v-btn>
						</template>
						<v-list>
							<v-list-tile v-for="(item, index) in mode" :key="index" @click>
								<v-list-tile-title>{{ item }}</v-list-tile-title>
							</v-list-tile>
						</v-list>
					</v-menu>
				</v-layout>
			</v-flex>
			<v-flex xs1 v-else>
				<v-btn
					class="cut-button"
					@click="writeContentToClipBoard"
					:ripple="false"
					flat
				>
					<i class="ms-Icon ms-Icon--Copy"></i>
				</v-btn>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { clipboard } from 'electron';

export default {
	props: ['name', 'value', 'editable'],
	model: {
		prop: 'value',
		event: 'input'
	},
	data() {
		return {
			mode: ['Selector', 'XPath', 'Custom'],
			content: ''
		};
	},
	mounted() {
		this.content = this.value;
	},
	methods: {
		writeContentToClipBoard() {
			clipboard.writeText(this.content);
			this.$emit('call-snackbar');
		}
	},
	watch: {
		value() {
			this.content = this.value;
		}
	},
	computed: {
		multiMode() {
			return this.name === 'path';
		}
	}
};
</script>

<style lang="less" scoped>
.flex .layout .cut-button {
	height: 50%;
}

.flex {
	.cut-button {
		width: 100%;
		height: 100%;
	}
}
</style>
