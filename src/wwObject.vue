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
<<<<<<< HEAD
        updateText(text) {
=======
        updateText(newText) {
            //No update if same text
            if (wwLib.wwLang.getText(this.content.text) === newText) {
                return;
            }

            const text = { ...this.content.text };
            wwLib.wwLang.setText(text, newText);
>>>>>>> 982c550cb73d2ca4e94cc44eacfe37ea6bb4fbf5
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
<<<<<<< HEAD
=======

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
    .ww-text-element {
        white-space: pre-wrap;
    }
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
>>>>>>> 982c550cb73d2ca4e94cc44eacfe37ea6bb4fbf5
