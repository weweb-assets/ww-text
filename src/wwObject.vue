<template>
    <wwEditableText
        class="ww-text"
        :tag="content.tag"
        :disabled="!canEditText"
        :value="internalText"
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
        textAlign: wwLib.responsive(''),
        fontSize: wwLib.allowState(wwLib.responsive('16px')),
        fontFamily: wwLib.allowState(wwLib.responsive('')),
        color: wwLib.allowState(wwLib.responsive('')),
        backgroundColor: wwLib.allowState(wwLib.responsive('')),
        textTransform: wwLib.allowState(wwLib.responsive('')),
        textShadow: wwLib.allowState(wwLib.responsive('')),
        lineHeight: wwLib.allowState(wwLib.responsive('')),
        wordSpacing: wwLib.allowState(wwLib.responsive('')),
        fontWeight: wwLib.allowState(wwLib.responsive('')),
    },
    props: {
        content: Object,
        wwElementState: Object,
        /* wwManager: start */
        wwEditorState: Object,
        /* wwManager: end */
    },
    computed: {
        canEditText() {
            /* wwManager:start */
            return (
                this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION &&
                this.wwEditorState.isDoubleSelected &&
                !this.isTextBinded &&
                !this.wwElementState.props.text
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
        internalText() {
            return this.wwElementState.props.text || this.content.text;
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
