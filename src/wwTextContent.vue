<script>
function createNode(createElement, node) {
    const nodeName = node.nodeName.toLowerCase();
    if (nodeName === '#comment') {
        return;
    }
    if (nodeName === '#text') {
        return node.textContent;
    }
    if (nodeName === 'ww-object') {
        return null;
    }
    if (nodeName === 'ww-link') {
        return null;
    }
    if (nodeName === 'script') {
        return null;
    }
    const children = Array.from(node.childNodes)
        .map(child => createNode(createElement, child))
        .filter(n => !!n);
    const attrs = {};
    if (node.attributes) {
        for (let a of node.attributes) {
            attrs[a.nodeName] = a.nodeValue;
        }
    }

    return createElement(nodeName === 'p' ? 'div' : nodeName, { attrs }, children);
}

export default {
    props: {
        text: { type: String, required: true },
    },
    render(createElement) {
        const contentText = document.createElement('div');
        contentText.innerHTML = this.text;
        const children = Array.from(contentText.childNodes)
            .map(child => createNode(createElement, child))
            .filter(n => !!n);

        return createElement('div', { class: 'ww-text-element' }, children);
    },
};
</script>
