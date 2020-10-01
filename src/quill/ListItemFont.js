import Quill from 'quill';
const Parchment = Quill.import('parchment');

class ListItemFont extends Parchment.Attributor.Style {
    value(node) {
        let value = super.value(node);
        return value;
    }
}

export default new ListItemFont('li-font', 'font-family', { scope: Parchment.Scope.BLOCK });
