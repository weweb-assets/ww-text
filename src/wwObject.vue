<template>
	<div>
		<h1 v-if="wwObject.content.data.tag == 'h1'" v-html="text">
		</h1>
		<h2 v-else-if="wwObject.content.data.tag == 'h2'" v-html="text">
		</h2>
		<h3 v-else-if="wwObject.content.data.tag == 'h3'" v-html="text">
		</h3>
		<h4 v-else-if="wwObject.content.data.tag == 'h4'" v-html="text">
		</h4>
		<p v-else-if="wwObject.content.data.tag == 'p'" v-html="text">
		</p>
		<code v-else-if="wwObject.content.data.tag == 'code'" v-html="text">
		</code>
		<div v-else v-html="text">
		</div>
	</div>
</template>


<script>
import Vue from 'vue'

export default {
	name: "ww-text",
	props: {
		wwObject: Object
	},
	data() {
		return {
			text: ""
		};
	},
	methods: {},
	computed: {},
	created: function () {

	},
	mounted: function () {
		this.text = wwLib.wwLang.getText(this.wwObject.content.data.text);
		this.wwObject.content.data.tag = 'h2';



		Vue.component('alert-box', {
			template: `
			<div class="demo-alert-box">
			  <strong>Error!</strong>
			  <slot></slot>
			</div>
		  `
		})

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