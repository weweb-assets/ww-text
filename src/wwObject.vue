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
        fontSize: wwLib.responsive('16px'),
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
        textStyle() {
            return { ...this.content.globalStyle, fontSize: this.content.fontSize };
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
    },
};
</script>
