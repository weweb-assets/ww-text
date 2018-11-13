<template>
    <div class="ww-button-wrapper">
        <div class='ww-button'>
            <wwObject v-bind:ww-object="wwObject.content.data.text" ww-inside-ww-object="true" :ww-not-editable="textNotEditable" ww-default-object-type="ww-text" ww-object-types-allowed="['ww-text']"></wwObject>
        </div>
    </div>
</template>
 

<script>
export default {
    name: "ww-button",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            wwObject: this.wwObjectCtrl.get(),
            textNotEditable: false
        }
    },
    computed: {
    },
    watch: {
    },
    beforeDestroy() { },
    methods: {
        init() {
            if (!this.wwObject.content.data.text || !this.wwObject.content.data.text.content) {
                let oldText = null
                if (this.wwObject.content.data.text) {
                    oldText = JSON.parse(JSON.stringify(this.wwObject.content.data.text))
                }

                let text = wwLib.wwObject.getDefault()
                text.content = wwLib.wwObject.getDefaultContent('ww-text')
                text.content.data.text = oldText || {}

                this.wwObject.content.data.text = text
            }
            this.textNotEditable = this.wwAttrs.wwCategory == 'button-navbar'
                || this.wwAttrs.wwCategory == 'button-navbar-page' || this.wwAttrs.wwCategory == 'button-navbar-menu'
        }
    },
    mounted() {
        this.init()

        wwLib.wwElementsStyle.applyAllStyles({
            wwObject: this.wwObject,
            lastWwObject: null,
            element: this.$el.querySelector('.ww-button'),
            noAnim: this.wwAttrs.wwNoAnim,
        });

        this.$emit('ww-loaded', this);
    }
};
</script>

<style scoped>
.ww-button-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ww-button {
  display: inline-block;
}
/* ww-class-btn-bg */
.ww-class-btn-bg-none {
  background-color: rgba(0, 0, 0, 0) !important;
}

/* ww-class-btn-border */
.ww-class-btn-border-none {
  border: none !important;
}

.ww-class-btn-border-small {
  border-style: solid !important;
  border-width: 1px !important;
}

.ww-class-btn-border-medium {
  border-style: solid !important;
  border-width: 2px !important;
}

.ww-class-btn-border-big {
  border-style: solid !important;
  border-width: 5px !important;
}

/* ww-class-btn-format */
.ww-class-btn-format-square {
  border-radius: 0 !important;
}

.ww-class-btn-format-round-small {
  border-radius: 5px !important;
}

.ww-class-btn-format-round-medium {
  border-radius: 10px !important;
}

.ww-class-btn-format-round-big {
  border-radius: 500px !important;
}

/* ww-class-btn-padding */
.ww-class-btn-padding-none {
  padding: 0 !important;
}

.ww-class-btn-padding-small {
  padding: 5px 10px !important;
}

.ww-class-btn-padding-medium {
  padding: 10px 20px !important;
}

.ww-class-btn-padding-big {
  padding: 20px 40px !important;
}

/* ww-class-btn-shadow */
.ww-class-btn-shadow-box-small {
  -webkit-box-shadow: 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
}

.ww-class-btn-shadow-box-medium {
  -webkit-box-shadow: 0px 0px 10px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 10px 0px rgba(50, 50, 50, 0.75);
}

.ww-class-btn-shadow-box-big {
  -webkit-box-shadow: 0px 0px 20px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 0px 20px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 20px 0px rgba(50, 50, 50, 0.75);
}

.ww-class-btn-shadow-bottom-small {
  -webkit-box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 2px 5px 0px rgba(50, 50, 50, 0.75);
}

.ww-class-btn-shadow-bottom-medium {
  -webkit-box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.75);
}

.ww-class-btn-shadow-bottom-big {
  -webkit-box-shadow: 0px 7px 20px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px 7px 20px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 7px 20px 0px rgba(50, 50, 50, 0.75);
}

/* ww-class-btn-width */
.ww-class-btn-width-full {
  width: 100% !important;
}
</style>
