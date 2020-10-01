import Quill from 'quill';
const ListItem = Quill.import('formats/list/item');

class ListItemStyle extends ListItem {
    format(name, value) {
        if (name === 'li-font') {
            this.domNode.style.fontFamily = value;
        } else if (name === 'li-size') {
            for (let c of this.domNode.classList) {
                if (c.indexOf('ww-font-size-') === 0) {
                    this.domNode.classList.remove(c);
                }
            }
            if (value) {
                this.domNode.classList.add('ww-font-size-' + value);
            }
        } else {
            super.format(name, value);
        }
    }

    optimize(context) {
        super.optimize(context);

        // if (this.children.length === 1) {
        const child = this.children.head;
        const attributes = child.attributes;

        if (attributes && attributes.attributes.color) {
            const color = attributes.attributes.color.value(child.domNode);
            super.format('li-color', color);
        }

        if (attributes && attributes.attributes.font) {
            const font = attributes.attributes.font.value(child.domNode);
            super.format('li-font', font);
        }

        if (attributes && attributes.attributes.fontSize) {
            const fontSize = attributes.attributes.fontSize.value(child.domNode);
            if (!this.domNode.classList.contains('ww-font-size-' + fontSize)) {
                this.format('li-size', fontSize);
            }
        }
    }
}

export default ListItemStyle;
