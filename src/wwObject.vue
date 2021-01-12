<template>
    <wwEditableText
        class="ww-text"
        :tag="content.tag"
        :disabled="!canEditText"
        :value="content.text"
        :textStyle="content.globalStyle"
        :textClass="content.fontStyle"
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
