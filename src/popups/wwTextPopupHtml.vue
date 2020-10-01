<template>
    <div class="ww-text-popup-html ww-scroll-bar">
        <VuePrismEditor
            class="editor"
            :code="code"
            language="html"
            :lineNumbers="true"
            @change="setResult($event)"
        ></VuePrismEditor>
    </div>
</template>

<script>
import 'prismjs';
import 'prismjs/themes/prism.css';
import VuePrismEditor from 'vue-prism-editor';

export default {
    name: 'wwTextPopupHtml',
    components: {
        VuePrismEditor,
    },
    props: {
        options: Object,
    },
    data() {
        return {
            code: this.options.data.html,
        };
    },
    methods: {
        setResult(code) {
            this.code = code;
            this.options.result.html = code;
        },
    },
    created() {
        this.setResult(this.code);
    },
};
</script>

<style scoped lang="scss">
.ww-text-popup-html {
    display: flex;
    justify-content: center;

    .editor {
        width: 90%;
        height: 400px;
    }
}
</style>
