<template>
    <wwEditableText
        class="ww-text"
        :tag="content.tag"
        :disabled="!canEditText"
        :value="content.text"
        :textStyle="content.globalStyle"
        :textClass="content.fontStyle"
        @input="updateText"
        @textbar-visibility-changed="onTextbarVisibilityChanged"
    ></wwEditableText>
</template>

<script>
import { openEditHTML } from './popups';

export default {
    name: '__COMPONENT_NAME__',
    wwDefaultContent: {
        text: {
            en: 'New text',
        },
        globalStyle: {},
    },
    props: {
        content: Object,
        /* wwManager: start */
        wwEditorState: Object,
        /* wwManager: end */
    },
    computed: {
        canEditText() {
            /* wwManager:start */
            return (
                this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION && this.wwEditorState.isSelected
            );
            /* wwManager:end */
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return false;
            /* wwFront:end */
        },
    },
    methods: {
        updateText(text) {
            this.$emit('update', { text });
        },
        onTextbarVisibilityChanged(value) {
            if (value) {
                this.$emit('closeMenu');
            } else {
                this.$emit('openMenu');
            }
        },
        async edit() {
            const { html } = (await openEditHTML(this.text)) || {};
            if (html) {
                this.updateText(html);
            }
        },
    },
};
</script>
