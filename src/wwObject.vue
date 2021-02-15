<template>
    <wwEditableText
        class="ww-text"
        :tag="content.tag"
        :disabled="!canEditText"
        :value="content.text"
        :textStyle="textStyle"
        :links="content.links"
        @input="updateText"
        @add-link="addLink"
        @remove-link="removeLink"
        @textbar-visibility-changed="onTextbarVisibilityChanged"
    ></wwEditableText>
</template>

<script>
/* wwManager:start */
import { openEditHTML } from './popups';
/* wwManager:end */

export default {
    name: '__COMPONENT_NAME__',
    wwDefaultContent: {
        text: {
            en: 'New text',
        },
        tag: 'p',
        fontSize: wwLib.responsive('16px'),
        fontFamily: wwLib.responsive(''),
        textAlign: wwLib.responsive(''),
        color: wwLib.responsive(''),
        backgroundColor: wwLib.responsive(''),
        textTransform: wwLib.responsive(''),
        textShadow: wwLib.responsive(''),
        lineHeight: wwLib.responsive(''),
        wordSpacing: wwLib.responsive(''),
        fontWeight: wwLib.responsive(''),
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
                this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION &&
                this.wwEditorState.isSelected &&
                !this.isTextBinded
            );
            /* wwManager:end */
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return false;
            /* wwFront:end */
        },
        /* wwManager:start */
        isTextBinded() {
            return this.wwEditorState.bindedProps['text'];
        },
        /* wwManager:end */
        textStyle() {
            return {
                fontSize: this.content.fontSize,
                fontFamily: this.content.fontFamily,
                textAlign: this.content.textAlign,
                color: this.content.color,
                backgroundColor: this.content.backgroundColor,
                textTransform: this.content.textTransform,
                textShadow: this.content.textShadow,
                lineHeight: this.content.lineHeight,
                wordSpacing: this.content.wordSpacing,
                fontWeight: this.content.fontWeight,
            };
        },
    },
    methods: {
        updateText(text) {
            this.$emit('update', { text });
        },
        /* wwManager:start */
        async edit() {
            const { html } = (await openEditHTML(this.text)) || {};
            if (html) {
                this.updateText(html);
            }
        },
        /* wwManager:end */
        async addLink({ id, value }) {
            this.$emit('update', { links: { ...this.content.links, [id]: value } });
        },
        async removeLink(id) {
            const links = { ...this.content.links };
            delete links[id];
            this.$emit('update', { links });
        },
        onTextbarVisibilityChanged(visibility) {
            this.$emit('change-menu-visibility', !visibility);
        },
    },
};
</script>
