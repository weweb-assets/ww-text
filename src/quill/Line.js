import Quill from 'quill';
const Embed = Quill.import('blots/embed');

class Line extends Embed {
    static create(value) {
        try {
            value = JSON.parse(value);
        } catch (error) {
            value = {};
        }
        const node = super.create(value);

        node.style.lineHeight = (value.height || 1) + 'px';
        const line = document.createElement('div');
        line.style.width = value.width || '100%';
        line.style.display = 'inline-block';
        line.style.borderTop = (value.height || 1) + 'px solid';
        line.style.borderTopColor = value.color || 'black';
        line.style.margin = '2px 0';
        line.classList.add('line');

        node.setAttribute('data-line', JSON.stringify(value));

        node.appendChild(line);
        return node;
    }

    format(name, value) {
        if (name === 'color' && value) {
            this.domNode.querySelector('.line').style.borderTopColor = value;
            let _value = JSON.parse(this.domNode.getAttribute('data-line') || '{}');
            _value.color = value;
            this.domNode.setAttribute('data-line', JSON.stringify(_value));
        }
    }

    static formats(node) {
        return JSON.parse(node.getAttribute('data-line') || '{}');
    }

    // get value of the node (for implement undo function)
    static value(node) {
        return node.getAttribute('data-line') || '{}';
    }
}
Line.blotName = 'line';
Line.tagName = 'SPAN';
Line.className = 'line';

export default Line;
