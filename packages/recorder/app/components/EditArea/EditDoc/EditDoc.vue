<template>
	<div id="edit-doc" class="edit-area">
		<div>
			生成docx
		</div>
		<v-btn
			:ripple="false"
			@click="genDocx()"
			class="cut-button br1"
			flat
		>
			<i class="ms-Icon ms-Icon--WordLogo"></i>
		</v-btn>
	</div>
</template>

<script>
import { nativeImage, remote } from 'electron';
// import createReport from 'docx-templates';
const fs = remote.require('fs').promises;
const path = remote.require('path');
const { app, dialog } = remote;

const templatePath = process.env.NODE_ENV === 'development'
	? path.resolve('template.docx')
	: path.join(path.parse(app.getPath('exe')).dir, 'template.docx');

const docxFilter = {
	name: "Word文档",
	extensions: ["docx"]
}

export default {
	data() {
		return {
			actionList: []
		}
	},
	mounted() {
		const projectId = this.$store.state.workspace.project;
		const caseId = this.$store.state.workspace.case;console.log(projectId, caseId);
		this.actionList = this.$workspace.getter.actionList(projectId, caseId);
	},
	methods: {
		genDocx() {
			dialog.showSaveDialog({ filters: [ docxFilter ] }, filename => {
				if (filename) {
					this.actionListToDocx(this.actionList, filename);
				}
			});
		},
		actionListToDocx(actionList, filename) {
			const result = actionList.map((action, index) => {
				const { property, image } = action.extend;

				const how = this.$t(`action.type.${action.type}`);
				let what = '元素';

				if (property.tagName === 'input') {
					if (action.element.type) {
						what = this.$t(`input.type.${property.type}`);
					}

					 what = this.$t(`element.${property.tagName}`);
				}

				const i = nativeImage.createFromDataURL(image);
				const dataURL = i.toDataURL();
				const size = i.getSize();
				const width = 500;
				const height = Math.ceil((500 / size.width) * size.height);

				const hhh = {
					step: String(index + 1),
					type: how,
					description: `${how} 一个 ${what} ${property.text.value}`,
					element: property.text.value,
					value: property.value ? property.value.value : '-',
					preview: {
						width,
						height,
						data: dataURL.slice('data:image/png;base64,'.length),
						extension: '.png'
					}
				}

				return hhh;
			});

			result.forEach(action => {
				action.preview.width = action.preview.width / 50;
				action.preview.height = action.preview.height / 50;
			});

			createReport({
				template: path.resolve(templatePath),
				output: filename,
				data: {
					actionList: result
				}
			});
		}
	}
}
</script>


<style lang="less">
#edit-doc {
	height: 100%;
	width: 100%;
	background-color: #f5f5f5;

	div {
		width: 100%;
		height: 15%;
		text-align: center;
		font-size: 50px;
	}

	.v-btn {
		width: 100%;
		height: 85%;

		i {
			font-size: 200px;
		}
	}
}
</style>