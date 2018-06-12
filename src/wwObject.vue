<template>
	<div>
		<div v-html="text">
		</div>
	</div>
</template>


<script>
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
  created: function() {},
  mounted: function() {
    this.text = wwLib.wwLang.getText(this.wwObject.content.data.text);

    wwLib.wwElementsStyle.applyAllStyles({
      wwObject: this.wwObject,
      lastWwObject: null,
      element: this.$el
    });

    const self = this;
    wwLib.$on("wwLang:changed", function(l) {
      self.text = wwLib.wwLang.getText(self.wwObject.content.data.text);
    });
  }
};
</script>
