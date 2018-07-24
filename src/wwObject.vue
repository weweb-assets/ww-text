<template>
	<div>
		<conponent :is="wwObject.content.data.tag" class="ww-text-content">
			<span v-for="(t, index) in splitedText()" :key="index" v-if="t.trim() != ''">
				<span v-html="t" v-if="!isWwObject(t)"></span>
				<wwObject v-if="isWwObject(t) && getWwObject(t)" v-bind:ww-object="getWwObject(t)"></wwObject>
			</span>
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
	methods: {
		splitedText() {
			return this.text.split(/\[\[|\]\]/);
		},
		isWwObject(text) {
			return text.indexOf("wwObject=") == 0;
		},
		getWwObject(text) {
			let index = text.replace('wwObject=', '');
			try {
				index = parseInt(index);
			}
			catch (e) {
				console.log('wwObject in text Error', t);
				return null;
			}
			if (this.wwObject.data && this.wwObject.data.children && this.wwObject.data.children[index]) {
				return this.wwObject.data.children[index];
			}
			return null;
		}
	},
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

.ww-text-content .ww-object-directive-wrapper,
.ww-text-content .ww-object-directive {
  display: inline-block;
}
</style>