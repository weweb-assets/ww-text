<template>
    <wwEditableText
        class="ww-text"
        :tag="tag"
        :disabled="!canEditText"
        :model-value="internalText"
        :text-style="textStyle"
        :links="links"
        @update:modelValue="updateText"
        @add-link="addLink"
        @remove-link="removeLink"
    ></wwEditableText>
</template>

<script>
/* wwManager:start */
import { getConfig } from './config.js';
/* wwManager:end */

export default {
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
        font: wwLib.allowState(wwLib.responsive('')),
    },
    /* wwEditor: start */
    wwEditorConfiguration({ content }) {
        return getConfig(content);
    },
    /* wwEditor: end */
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        /* wwManager: start */
        wwEditorState: { type: Object, required: true },
        /* wwManager: end */
    },
    emits: ['update:content', 'update:content:effect', 'change-menu-visibility', 'change-borders-style'],
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
            const style = {
                ...(this.content.font
                    ? {
                          fontSize: 'unset',
                          fontFamily: 'unset',
                          lineHeight: 'unset',
                          fontWeight: 'unset',
                          font: this.content.font,
                      }
                    : {
                          fontSize: this.content.fontSize,
                          fontFamily: this.content.fontFamily,
                          lineHeight: this.content.lineHeight,
                          fontWeight: this.content.fontWeight,
                      }),
                textAlign: this.content.textAlign,
                color: this.content.color,
                backgroundColor: this.content.backgroundColor,
                textTransform: this.content.textTransform,
                textShadow: this.content.textShadow,
                wordSpacing: this.content.wordSpacing,
            };

            return style;
        },
        internalText() {
            return this.wwElementState.props.text || this.content.text;
        },
        tag() {
            if (this.wwElementState.isInsideLink && this.content.tag === 'button') {
                return 'div';
            } else {
                return this.content.tag;
            }
        },
        links() {
            if (this.content.links) {
                const links = { ...this.content.links, ...this.content.links[this.wwFrontState.lang] };
                // Horrible hack to handle the fact that old data are not under lang key
                Object.keys(links).forEach(key => {
                    if (key.length <= 4) {
                        delete links[key];
                    }
                });
                return links;
            } else {
                return {};
            }
        },
    },
    /* wwEditor:start */
    watch: {
        'content.text'() {
            this.checkListTags(this.content.text);
        },
        'content.font': {
            async handler(newVal, oldVal) {
                if (this.wwEditorState.isACopy) {
                    return;
                }
                if (!newVal && oldVal) {
                    const defaultValue = wwLib.getStyleFromToken(oldVal);
                    const typo = wwLib.getTypoFromToken(defaultValue);
                    this.$emit('update:content:effect', typo);
                } else if (newVal && newVal !== oldVal) {
                    const defaultValue = wwLib.getStyleFromToken(newVal);
                    const typo = wwLib.getTypoFromToken(defaultValue);
                    this.$emit('update:content:effect', typo);
                }
            },
        },
        canEditText() {
            const bordersStyle = {
                width: 'calc(100% + 8px)',
                height: 'calc(100% + 8px)',
                top: '-4px',
                left: '-4px',
                border: '4px solid var(--ww-color-blue-200)',
            };
            this.$emit('change-menu-visibility', this.wwEditorState.isSelected && !this.canEditText);
            this.$emit('change-borders-style', this.canEditText ? bordersStyle : {});
        },
        'wwEditorState.isDoubleSelected'(newVal, oldVal) {
            if (newVal && !oldVal && this.isTextBinded) {
                wwLib.wwNotification.open({
                    text: {
                        en: 'Binded texts cannot be edited.',
                        fr: 'Les textes bindés ne peuvent pas être édités.',
                    },
                    color: 'purple',
                    duration: 3000,
                });
            }
        },
    },
    /* wwEditor:start */
    mounted() {
        this.checkListTags(this.content.text);
    },
    /* wwEditor:end */
    methods: {
        updateText(text) {
            this.$emit('update:content', { text });
        },
        /* wwManager:start */
        checkListTags(text) {
            if (this.content.tag === 'p' && text && text[wwLib.wwLang.lang] && text[wwLib.wwLang.lang]) {
                const notAllowedInP = ['<ul', '<li', '<ol'];
                const isInP = notAllowedInP.reduce(
                    (isInText, el) => isInText || text[wwLib.wwLang.lang].indexOf(el) !== -1,
                    false
                );
                if (isInP) {
                    wwLib.wwNotification.open({
                        text: {
                            en: 'Lists are not allowed in a <b>P</b> tag.<br/>The tag of this text has been changed to <b>DIV</b>.',
                            fr: 'Les listes ne sont pas autorisées dans une balise <b>P</b>.<br/>La balise de ce texte a été changée en <b>DIV</b>.',
                        },
                        color: 'blue',
                        duration: 3000,
                    });
                    this.$emit('update:content', { tag: 'div' });
                }
            }
        },
        /* wwManager:end */
        async addLink({ id, value }) {
            const links = { ...this.content.links };
            this.$emit('update:content', {
                links: {
                    ...links,
                    [this.wwFrontState.lang]: { ...links[this.wwFrontState.lang], [id]: value },
                },
            });
        },
        async removeLink(id) {
            const links = { ...this.content.links };
            delete links[id];
            if (links[this.wwFrontState.lang]) {
                delete links[this.wwFrontState.lang][id];
            }
            this.$emit('update:content', { links });
        },
    },
    /* wwEditor:end */
};
</script>
