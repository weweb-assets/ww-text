<template>
    <wwText :tag="tag" :text="text"></wwText>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update-content', 'update:content:effect'],
    computed: {
        tag() {
            if (this.wwElementState.isInsideLink && this.content.tag === 'button') {
                return 'div';
            } else {
                return this.content.tag;
            }
        },
        text() {
            return this.wwElementState.props.text;
        },
    },
    /* wwEditor:start */
    watch: {
        'content._ww-text_text'() {
            this.checkListTags(this.content['_ww-text_text']);
        },
    },
    mounted() {
        this.checkListTags(this.content['_ww-text_text']);
    },
    /* wwEditor:end */
    methods: {
        /* wwEditor:start */
        checkListTags(text) {
            if (this.content.tag === 'p' && text && text[wwLib.wwLang.lang] && text[wwLib.wwLang.lang].indexOf) {
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
                    this.$emit('update-content', { tag: 'div' });
                }
            }
        },
        /* wwEditor:end */
    },
};
</script>
