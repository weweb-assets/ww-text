<template>
    <wwText :tag="tag" :text="text"></wwText>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
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
};
</script>
