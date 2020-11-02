<template>
    <div class="ww-text-editor">
        <div ref="quill" :style="textStyle"></div>
        <wwTextBar
            :selectionFormat="selectionFormat"
            :textTag="textTag"
            :initialPosition="textBarInitialPosition"
            @updateFormat="updateFormat"
            @removeFormat="removeFormat"
            @updateContent="updateContent"
            @setFormat="setFormat"
            @openMenu="openMenu"
            @insertLine="insertLine"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import Quill from 'quill';
import './quill';
import wwTextBar from './wwTextBar.vue';

export default {
    components: { wwTextBar },
    props: {
        text: { type: String, required: true },
        textTag: { type: String },
        textStyle: { type: Object },
    },
    data() {
        return { selectionFormat: {}, textBarInitialPosition: { x: 0, y: 0, fromManager: false } };
    },
    mounted() {
        this.quill = new Quill(this.$refs.quill);
        this.quill.pasteHTML(this.text);
        this.synchronizeWithQuill();
        this.quill.on('selection-change', this.synchronizeWithQuill);

        const { top: y, left: x } = this.$el.getBoundingClientRect();
        this.textBarInitialPosition.x = x;
        this.textBarInitialPosition.y = y;
    },
    beforeDestroy() {
        this.save();
        this.quill.off('selection-change', this.synchronizeWithQuill);
    },
    methods: {
        updateContent(content) {
            this.$emit('updateContent', content);
        },
        getText() {
            return this.$el.querySelector('.ql-editor').innerHTML;
        },
        save() {
            this.$emit('updateText', this.getText());
        },
        checkSelection() {
            const { length } = this.quill.getSelection();
            if (!length) {
                this.quill.setSelection(0, this.quill.getLength());
            }
        },
        synchronizeWithQuill() {
            Vue.set(this, 'selectionFormat', this.quill.getFormat());
        },
        updateFormat(update) {
            this.checkSelection();
            for (const prop in update) {
                this.quill.format(prop, update[prop]);
            }
            this.synchronizeWithQuill();
        },
        removeFormat() {
            this.checkSelection();
            const { index, length } = this.quill.getSelection();
            this.quill.removeFormat(index, length);
            this.synchronizeWithQuill();
        },
        setFormat(format) {
            this.removeFormat();
            this.updateFormat(format);
        },
        openMenu() {
            this.$emit('openMenu');
        },
        insertLine(value) {
            const { index } = this.quill.getSelection();
            this.quill.insertEmbed(index, 'line', JSON.stringify(value));
            this.quill.setSelection(index + 1);
        },
    },
};
</script>

<style lang="scss">
.ww-text-editor {
    .ql-editor:focus {
        outline: none;
    }
}
</style>
