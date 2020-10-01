import Quill from 'quill';
const Parchment = Quill.import('parchment');

class ListItemSize extends Parchment.Attributor.Class {
    value(node) {
        let value = super.value(node);
        return value;
    }
}

export default new ListItemSize('li-size', 'ww-font-size', { scope: Parchment.Scope.BLOCK });
