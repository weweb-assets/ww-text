<template>
    <component :is="tag" class="ww-text">
        <wwTextContent
            v-if="!useEditor"
            :text="text"
            :style="content.globalStyle"
            @click.native.stop.prevent="onTextClick"
            :class="content.fontStyle"
        ></wwTextContent>
        <!-- wwManager:start -->
        <wwTextEditor
            v-else
            :text="text"
            :class="content.fontStyle"
            :textStyle="content.globalStyle"
            @updateText="updateText"
            @updateContent="updateContent"
            @openMenu="openMenu"
        ></wwTextEditor>
        <!-- wwManager:end -->
    </component>
</template>

<script>
const wwObjRegex = /\[\[wwObject\s*=\s*([^\]]*)\]\]/gi;
const wwLinkRegex = /\[\[wwLink\s*=\s*([^\|]*)\s*\|\s*text\s*=\s*([^\]]*)\]\]/gi;

import { openEditHTML } from './popups';

import wwTextContent from './wwTextContent.vue';
import wwTextEditor from './wwTextEditor.vue';

export default {
    name: '__COMPONENT_NAME__',
    components: {
        wwTextContent,
        wwTextEditor,
    },
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
        text() {
            return (
                wwLib.wwLang
                    .getText(this.content.text)
                    .replace(wwObjRegex, '<span class="ww-object-embed" data-ww-object-id="$1"></span>')
                    .replace(wwLinkRegex, "<span class='ww-link-inline' data-ww-link='$1'>$2</span>") || '<br/>'
            );
        },
        useEditor() {
            /* wwManager:start */
            return (
                this.wwEditorState.editMode === 'CONTENT' &&
                this.wwEditorState.isSelected &&
                !this.wwEditorState.isMenuOpen
            );
            /* wwManager:end */
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return false;
            /* wwFront:end */
        },
        tag() {
            return this.content.tag || 'div';
        },
    },
    methods: {
        updateText(newText) {
            const text = { ...this.content.text };
            wwLib.wwLang.setText(text, newText);
            this.$emit('update', { text });
        },
        updateContent(update) {
            this.$emit('update', update);
        },
        openMenu() {
            this.$emit('openMenu');
        },
        closeMenu() {
            this.$emit('closeMenu');
        },
        async edit() {
            const { html } = (await openEditHTML(this.text)) || {};
            if (html) {
                this.updateText(html);
            }
        },
        onTextClick() {
            if (this.wwEditorState.isSelected) {
                this.closeMenu();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-text {
    display: inline-block;
    width: 100%;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    outline: none;
}
h1,
h2,
h3,
h4 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
}
</style>

<style lang="scss">
.ww-text {
    ol,
    ul {
        margin: 0;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
    p {
        margin: 0;
        white-space: pre-wrap;
    }

    .ww-object,
    .ww-object-embed {
        font-size: initial;
        font-weight: initial;
        line-height: initial;
        letter-spacing: initial;
        white-space: initial;
        vertical-align: middle;
        display: inline-block;
    }

    .ww-object-wrapper {
        display: inline-block;
    }

    .ww-link-inline {
        position: relative;

        &:before {
            content: '';
            position: absolute;
            border: 1px dashed #2e86c2;
            top: -2px;
            left: -2px;
            bottom: -2px;
            right: -2px;
            pointer-events: none;
        }

        &:after {
            content: attr(data-link);
            position: absolute;
            top: -2px;
            left: -2px;
            transform: translateY(-100%);
            padding: 2px;
            background-color: #2e86c2;
            display: none;
            font-size: 9px;
            color: white;
            white-space: nowrap;
        }

        &:hover {
            &:after {
                display: block;
            }
        }
    }
}

.ww-text-link {
    text-decoration: none;
    color: inherit;
}

.ql-clipboard {
    display: none;
}
</style>
