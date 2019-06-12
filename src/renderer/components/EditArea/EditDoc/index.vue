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
const fs = remote.require('fs').promises;
const docx = remote.require('docx');
const dialog = remote.dialog;

const docxFilter = {
	name: "Word文档",
	extensions: ["docx"]
}

export default {
	props: ['actionList'],
	methods: {
		genDocx() {
			dialog.showSaveDialog({ filters: [ docxFilter ] }, filename => {
				if (filename) {
					this.actionListToDocx(this.actionList, filename);
				}
			});
		},
		actionListToDocx(actionList, filename) {
			const packer = new docx.Packer();
			const doc = new docx.Document();

			actionList.forEach(action => {
				const { property, image } = action.resolve;
				const paragraph = new docx.Paragraph().left();

				const how = this.$t(`action.type.${action.type}`);
				let what = '';

				if (property.tagName === 'input') {
					if (action.element.type) {
						what = this.$t(`input.type.${property.type}`);
					}

					 what = this.$t(`element.${property.tagName}`);
				}
				
				paragraph.addRun(new docx.TextRun(`# ${how} 一个 ${what} ${property.text.value}`).break().bold());
				paragraph.addRun(new docx.TextRun(`动作类型: ${action.type}`).break());
				paragraph.addRun(new docx.TextRun(`元素文本: ${property.text.value}`).break());
				if (property.value) {
					paragraph.addRun(new docx.TextRun(`元素值: ${property.value.value}`).break());

				}

				paragraph.addRun(new docx.TextRun(`预览图: `).break().break());
				doc.addParagraph(paragraph);

				const i = nativeImage.createFromDataURL(image);
				const buffer = i.toPNG();
				const size = i.getSize();
				doc.createImage(i.toPNG(), size.width, size.height);
			});

			packer.toBuffer(doc).then(buffer => fs.writeFile(filename, buffer));
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