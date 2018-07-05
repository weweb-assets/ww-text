<template>
	<div>
		<conponent :is="wwObject.content.data.tag" v-html="text">
		</conponent>
	</div>
</template>


<script>
import Vue from 'vue'

export default {
	name: 'ww-text',
	props: {
		wwObject: {
			type: Object,
			default: {}
		},
		wwAttrs: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			text: ''
		};
	},
	methods: {},
	computed: {},
	created: function () {

	},
	mounted: function () {
		this.text = wwLib.wwLang.getText(this.wwObject.content.data.text);

		this.wwObject.content.data.tag = this.wwObject.content.data.tag || 'div';

		this.wwObject.content.data.tag = 'h2';

		wwLib.wwElementsStyle.applyAllStyles({
			wwObject: this.wwObject,
			lastWwObject: null,
			element: this.$el
		});

		const self = this;
		wwLib.$on("wwLang:changed", function (l) {
			self.text = wwLib.wwLang.getText(self.wwObject.content.data.text);
		});
	}
};
</script>

<style scoped>
h1,
h2,
h3,
h4 {
  font-size: inherit;
  font-weight: inherit;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
  -webkit-margin-start: 0;
  -webkit-margin-end: 0;
  margin: 0;
}
</style>