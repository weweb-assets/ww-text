import Quill from 'quill';
const Parchment = Quill.import('parchment');

class ListItemColor extends Parchment.Attributor.Style {
    value(node) {
        let value = super.value(node);

        if (!value.startsWith('rgb(')) return value;

        value = value.replace(/^[^\d]+/, '').replace(/[^\d]+$/, '');

        const color =
            '#' +
            value
                .split(',')
                .map(function (component) {
                    return ('00' + parseInt(component, 10).toString(16)).slice(-2);
                })
                .join('');
        return color;
    }
}

export default new ListItemColor('li-color', 'color', { scope: Parchment.Scope.BLOCK });
