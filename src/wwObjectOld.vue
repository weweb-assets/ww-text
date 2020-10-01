<script>
import Vue from 'vue';

/* wwManager:start */
import wwTextBar from './wwTextBar.vue';
import { setTimeout } from 'timers';
import Quill from 'quill';
/* wwManager:end */

const wwObjRegex = /\[\[wwObject\s*=\s*([^\]]*)\]\]/gi;
const wwLinkRegex = /\[\[wwLink\s*=\s*([^\|]*)\s*\|\s*text\s*=\s*([^\]]*)\]\]/gi;

export default {
    name: '__COMPONENT_NAME__',
    wwDefaultContent: {
        text: {
            en: 'New text',
        },
    },
    components: {
        /* wwManager:start */
        wwTextBar,
        /* wwManager:end */
    },
    props: {
        uid: Number,
        content: Object,
        /* wwManager: start */
        wwEditorState: Object,
        /* wwManager: end */
    },
    data() {
        return {
            /* wwManager:start */
            quill: null,
            textSelection: null,
            clearRender: false,
            isTextBarOpen: false,
            /* wwManager:end */
        };
    },
    computed: {
        /* wwManager:start */
        isEditing() {
            return this.wwEditorState.editMode === 'CONTENT';
        },
        isSelected() {
            return this.wwEditorState.isSelected;
        },
        /* wwManager:end */
    },

    render(createElement) {
        if (this.clearRender) {
            this.$nextTick(function () {
                this.clearRender = false;
                this.$forceUpdate();
            });
            this.$el.innerHTML = '';
            return createElement(this.content.tag || 'div', { class: 'ww-text' }, null);
        }

        const self = this;
        function createVNodes(childNodes) {
            let vNodes = [];

            for (const node of childNodes) {
                let vNode = null;
                if (node.nodeName.toLowerCase() == '#comment') {
                    //Do nothing.
                } else if (node.nodeName.toLowerCase() == '#text') {
                    vNode = self._v(node.textContent);
                } else if (node.nodeName.toLowerCase() == 'ww-object') {
                    let vn = createVNodes(node.childNodes);

                    let attributes = {};

                    for (let a of node.attributes) {
                        attributes[a.nodeName] = a.nodeValue;
                    }
                    for (let key in self.wwAttrs) {
                        attributes[key] = self.wwAttrs[key];
                    }

                    attributes.wwInsideWwObject = 'ww-text';

                    let wwObjectData;
                    if (
                        self.content.children &&
                        self.content.children[node.attributes['data-ww-object-id'].nodeValue]
                    ) {
                        wwObjectData = self.content.children[node.attributes['data-ww-object-id'].nodeValue];
                    }
                    // else if (
                    //     self.wwObject.data.children &&
                    //     self.wwObject.data.children[node.attributes['data-ww-object-id'].nodeValue]
                    // ) {
                    //     wwObjectData = self.wwObject.data.children[node.attributes['data-ww-object-id'].nodeValue];
                    // }

                    vNode = createElement(
                        node.nodeName.toLowerCase(),
                        {
                            props: {
                                wwObject: wwObjectData,
                            },
                            attrs: attributes,
                        },
                        vn
                    );
                } else if (node.nodeName.toLowerCase() === 'ww-link') {
                    let vn = createVNodes(node.childNodes);

                    const valueObject = JSON.parse(node.attributes['data-ww-link'].nodeValue);
                    const linkType = Object.keys(valueObject)[0];
                    let linkData = {
                        type: 'none',
                        data: {},
                    };
                    switch (linkType) {
                        case 'linkExt':
                            linkData.type = 'ww-link-ext';
                            linkData.data.url = valueObject[linkType];
                            break;
                        case 'linkPage':
                            linkData.type = 'ww-link-page';
                            linkData.data.id = valueObject[linkType];
                            break;
                        case 'linkSection':
                            linkData.type = 'ww-link-section';
                            linkData.data.id = valueObject[linkType];
                            break;
                        case 'linkFile':
                            linkData.type = 'ww-link-file';
                            linkData.data.url = valueObject[linkType];
                            break;
                        case 'linkClosePopup':
                            linkData.type = 'ww-link-closepopup';
                            break;
                    }

                    let wwLink = wwLib.wwLinks.getLinkParams(linkData, self.$el);

                    vNode = createElement(
                        node.nodeName.toLowerCase(),
                        {
                            props: {
                                wwLink,
                                inText: true,
                            },
                        },
                        vn
                    );
                } else if (node.nodeName.toLowerCase() === 'script') {
                    continue;
                } else {
                    let vn = createVNodes(node.childNodes);
                    let attributes = {};
                    if (node.attributes) {
                        for (let a of node.attributes) {
                            attributes[a.nodeName] = a.nodeValue;
                        }
                    }
                    const nodeName = node.nodeName.toLowerCase() === 'p' ? 'div' : node.nodeName.toLowerCase();
                    vNode = createElement(
                        nodeName,
                        {
                            attrs: attributes,
                        },
                        vn
                    );
                }

                if (vNode) {
                    vNodes.push(vNode);
                }
            }

            return vNodes;
        }

        const nodes = [];
        let text =
            wwLib.wwLang
                .getText(this.content.text)
                .replace(wwObjRegex, '<ww-object data-ww-object-id="$1"></ww-object>')
                .replace(wwLinkRegex, "<ww-link data-ww-link='$1'>$2</ww-link>") || '<br/>';

        const contentText = document.createElement('div');
        contentText.innerHTML = text;
        const childNodesText = contentText.childNodes;
        const nodesText = createVNodes(childNodesText);
        const textClasses = ['ww-text-content'];
        this.content.fontStyle && textClasses.push(this.content.fontStyle);
        const nodeText = createElement(
            'div',
            {
                class: textClasses,
                attrs: {
                    style: this.isEditing ? 'display:none;' : '',
                },
            },
            nodesText
        );
        nodes.push(nodeText);

        /* wwManager:start */
        const quillClasses = ['ww-text-editor'];
        this.content.fontStyle && quillClasses.push(this.content.fontStyle);
        const nodeQuill = createElement(
            'div',
            {
                class: quillClasses,
                attrs: {
                    style: this.isEditing ? '' : 'display:none;',
                },
            },
            null
        );
        nodes.push(nodeQuill);
        if (this.isTextBarOpen) {
            nodes.push(
                createElement('wwTextBar', {
                    props: { quill: this.quill, isSelected: this.isSelected, content: this.content },
                })
            );
        }
        /* wwManager:end */

        return createElement(this.content.tag || 'div', { class: 'ww-text' }, nodes);
    },
    watch: {
        /* wwManager:start */
        // async isEditing(isEditing, wasEditing) {
        //     if (isEditing && !wasEditing) {
        //         this.$nextTick(() => {
        //             this.loadQuill();
        //             this.quill.disable();
        //         });
        //     }
        // },
        // isSelected(isSelected) {
        //     if (isSelected) {
        //         this.isTextBarOpen = true;
        //         if (this.isEditing && this.quill) {
        //             this.quill.enable();
        //         }
        //     } else {
        //         this.saveText();
        //         if (this.quill) {
        //             this.quill.disable();
        //         }
        //     }
        // },
        /* wwManager:end */
    },
    methods: {
        async init() {
            /* wwManager:start */
            this.$el.addEventListener('mousedown', this.preventNextClick);

            await this.loadQuillModules();

            if (this.isEditing) {
                this.$nextTick(() => {
                    this.loadQuill();
                    this.quill.disable();
                });
            }
            /* wwManager:end */
        },

        /* wwManager:start */
        // TODO: rewrite this
        preventNextClick(event) {
            if (!this.isSelected) {
                return;
            }
            let mouseDownCoords = [event.clientX, event.clientY];
            let preventNext = false;

            function onMouseMove(event) {
                const distX = Math.abs(mouseDownCoords[0] - event.clientX);
                const distY = Math.abs(mouseDownCoords[1] - event.clientY);

                if (distX > 10 || distY > 10) {
                    wwLib.wwManagerUI.lockSelection();
                    preventNext = true;
                }
            }

            function onClick(event) {
                if (preventNext) {
                    event.preventDefault();
                    event.stopPropagation();
                    wwLib.wwManagerUI.unlockSelection();
                }

                wwLib.getFrontWindow().removeEventListener('click', onClick, { capture: true });
                wwLib.getManagerWindow().removeEventListener('click', onClick, { capture: true });
                wwLib.getFrontWindow().removeEventListener('mousemove', onMouseMove);
                wwLib.getManagerWindow().removeEventListener('mousemove', onMouseMove);
            }

            wwLib.getFrontWindow().addEventListener('click', onClick, { capture: true });
            wwLib.getManagerWindow().addEventListener('click', onClick, { capture: true });
            wwLib.getFrontWindow().addEventListener('mousemove', onMouseMove);
            wwLib.getManagerWindow().addEventListener('mousemove', onMouseMove);
        },

        loadQuill() {
            this.quill = new Quill(this.$el.querySelector('.ww-text-editor'));
            this.quill.disable();
            let text =
                wwLib.wwLang
                    .getText(this.content.text)
                    .replace(wwObjRegex, '<span class="ww-object-embed" data-ww-object-id="$1"></span>') || '<br/>';
            text = text.replace(wwLinkRegex, "<span class='ww-link-inline' data-ww-link='$1'>$2</span>");
            this.quill.pasteHTML(text);
        },

        reloadQuill() {
            this.clearRender = true;

            setTimeout(() => {
                if (this.isEditing) {
                    this.loadQuill();
                }
            }, 100);
        },

        async loadQuillModules() {
            if (!Quill.imports['formats/ww-object-embed']) {
                const Embed = Quill.import('blots/embed');

                // WWOBJECT
                function createWwObject(self, wwObjectIndex) {
                    let wwObjectData;

                    if (wwObjectIndex && self.content.children && self.content.children[wwObjectIndex]) {
                        wwObjectData = self.content.children[wwObjectIndex];
                    } else if (
                        wwObjectIndex &&
                        self.wwObject.data.children &&
                        self.wwObject.data.children[wwObjectIndex]
                    ) {
                        wwObjectData = self.wwObject.data.children[wwObjectIndex];
                    } else {
                        wwObjectData = wwLib.wwObject.getDefault({ type: 'ww-icon' });

                        self.content.children = self.content.children || [];

                        wwObjectIndex = 0;
                        //Find first empty index in current wwObject children
                        while (self.content.children[wwObjectIndex]) {
                            wwObjectIndex++;
                        }

                        self.content.children[wwObjectIndex] = wwObjectData;

                        self.wwObjectCtrl.update(self.wwObject);
                    }

                    for (let c of self.$children) {
                        if (c.c_wwObject && c.c_wwObject.uniqueId === wwObjectData.uniqueId) {
                            c.$destroy();
                        }
                    }

                    const wwObject = new Vue.options.components.wwObject({
                        propsData: { wwObject: wwObjectData },
                    });
                    wwObject.$parent = self;
                    self.$children.push(wwObject);
                    wwObject.$store = self.$store;
                    wwObject.$mount();

                    return { el: wwObject.$el, wwObjectId: wwObjectIndex };
                }
                class WwObject extends Embed {
                    static create(value) {
                        const node = super.create(value);
                        node.setAttribute('data-ww-object-id', value);

                        return node;
                    }

                    static formats(node) {
                        return {
                            wwObjectId: node.getAttribute('data-ww-object-id'),
                        };
                    }

                    attach() {
                        super.attach();
                        const vueNode = this.getVueNode();

                        this.domNode.innerHTML = '';

                        if (!vueNode) {
                            return;
                        } else {
                            const { el, wwObjectId } = createWwObject(
                                vueNode.__vue__,
                                this.domNode.getAttribute('data-ww-object-id') || ''
                            );
                            this.domNode.setAttribute('data-ww-object-id', wwObjectId);
                            this.domNode.appendChild(el);
                        }
                    }

                    getVueNode() {
                        let node = this.domNode.parentNode;
                        while (node && !node.__vue__) {
                            node = node.parentNode;
                        }
                        if (node && node.__vue__) {
                            return node;
                        } else {
                            return null;
                        }
                    }

                    // get value of the node (for implement undo function)
                    static value(node) {
                        return node.getAttribute('data-ww-object-id') || '';
                    }
                }
                WwObject.blotName = 'ww-object-embed';
                WwObject.tagName = 'SPAN';
                WwObject.className = 'ww-object-embed';
                Quill.register(WwObject, true);
            }
        },

        getTextFromDom(format) {
            function _format(node, level) {
                var indentBefore = new Array(level++ + 1).join('    '),
                    indentAfter = new Array(level - 1).join('   '),
                    textNode;

                for (var i = 0; i < node.children.length; i++) {
                    textNode = document.createTextNode('\n' + indentBefore);
                    node.insertBefore(textNode, node.children[i]);

                    format(node.children[i], level);

                    if (node.lastElementChild == node.children[i]) {
                        textNode = document.createTextNode('\n' + indentAfter);
                        node.appendChild(textNode);
                    }
                }

                return node;
            }

            function getText(node, newNode, isChild) {
                if (!node) {
                    return;
                }

                const attrsToRemove = [];
                for (const attr of newNode.attributes) {
                    if (attr.name.indexOf('data-v-') === 0) {
                        attrsToRemove.push(attr.name);
                    } else if (!attr.value) {
                        attrsToRemove.push(attr.name);
                    }
                }
                for (const attrName of attrsToRemove) {
                    newNode.removeAttribute(attrName);
                }

                for (let i = 0; i < node.childNodes.length; i++) {
                    if (!node.childNodes[i] || !node.childNodes[i].nodeName) {
                        continue;
                    }

                    if (node.childNodes[i].nodeName.toLowerCase() == '#text') {
                        newNode.append(node.childNodes[i].cloneNode(false));
                    } else if (
                        node.childNodes[i].classList &&
                        node.childNodes[i].classList.contains('ww-object-embed')
                    ) {
                        newNode.append(
                            document.createTextNode(
                                '[[wwObject=' + node.childNodes[i].attributes['data-ww-object-id'].nodeValue + ']]'
                            )
                        );
                    } else if (
                        node.childNodes[i].classList &&
                        node.childNodes[i].classList.contains('ww-link-inline')
                    ) {
                        const txt = document.createElement('textarea');
                        txt.innerHTML = node.childNodes[i].innerHTML;
                        const text = txt.value;
                        newNode.append(
                            document.createTextNode(
                                '[[wwLink=' +
                                    node.childNodes[i].attributes['data-ww-link'].nodeValue +
                                    '|text=' +
                                    text +
                                    ']]'
                            )
                        );
                    } else if (node.childNodes[i].classList && node.childNodes[i].classList.contains('line')) {
                        try {
                            const value = JSON.parse(node.childNodes[i].attributes['data-line'].nodeValue);
                            const lineNode = document.createElement('span');
                            lineNode.classList.add('line');
                            lineNode.setAttribute('data-line', node.childNodes[i].attributes['data-line'].nodeValue);

                            lineNode.style.lineHeight = (value.height || 1) + 'px';
                            lineNode.style.width = value.width || '100%';
                            lineNode.style.display = 'inline-block';
                            lineNode.style.borderTop = (value.height || 1) + 'px solid ' + (value.color || 'black');
                            lineNode.style.margin = '2px 0';

                            newNode.append(lineNode);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        newNode.append(node.childNodes[i].cloneNode(false));
                        getText(node.childNodes[i], newNode.childNodes[newNode.childNodes.length - 1], true);
                    }
                }

                if (!isChild) {
                    if (format) {
                        return _format(newNode, 0).innerHTML;
                    } else {
                        return newNode.innerHTML;
                    }
                }
            }

            const newNode = document.createElement('div');

            let elem = this.$el;
            if (this.$el.querySelector('.ql-editor')) {
                elem = this.$el.querySelector('.ql-editor');
            } else if (this.$el.querySelector('.ww-text-content')) {
                elem = this.$el.querySelector('.ww-text-content');
            }

            let t = getText(elem.cloneNode(true), newNode);
            return t;
        },

        async saveText(options) {
            options = options || {};

            if (options.clearRender) {
                this.clearRender = true;
            }
            this.isTextBarOpen = false;

            let newText = this.getTextFromDom();
            const text = { ...this.content.text };
            wwLib.wwLang.setText(text, newText, options.lang);
            await this.$emit('update', { text });
        },

        wwTextBarAction({ options, event }) {
            const category = options.split(':')[0];
            const action = options.split(':').length > 1 ? options.split(':')[1] : null;
            const value = options.split(':').length > 2 ? options.split(':')[2] : null;

            this.$nextTick(function () {
                switch (category) {
                    case 'link':
                        this.addLink();
                        break;
                    case 'insertWwObject':
                        this.insertWwObject();
                        break;
                    case 'exec':
                        this.exec(action, value);
                        break;
                    case 'list':
                        this.setList(action);
                        break;
                    case 'indent':
                        this.setIndent(action);
                        break;
                    case 'fontSize':
                        this.setFontSize(action);
                        break;
                    case 'fontStyle':
                        this.setFontStyle(action);
                        break;
                    case 'fontWeight':
                        this.setFontWeight(action);
                        break;
                    case 'removeFormat':
                        this.removeFormat();
                        break;
                    case 'format':
                        this.copyFormat();
                        break;
                    case 'prop':
                        this.setProp(action, value);
                        break;
                    case 'color':
                        this.setColor(action);
                        break;
                    case 'open':
                        this.openPopup(action);
                        break;
                    case 'html':
                        this.editHTML();
                        break;
                    case 'openMenu':
                        this.openMenu(event);
                        break;
                    default:
                        break;
                }
            });
        },

        checkSelection() {
            const selection = {
                index: this.quill.getSelection().index,
                length: this.quill.getSelection().length,
            };

            if (!selection.length) {
                this.quill.setSelection(0, this.quill.getLength());
            }
        },

        async exec(cmd, value) {
            if (typeof value === 'undefined' || value === null) {
                value = this.quill.getFormat()[cmd] ? false : true;
            }

            switch (cmd) {
                case 'color':
                    if (value === 'more') {
                        let options = {
                            firstPage: 'COLOR_PICKER',
                        };

                        try {
                            const result = await wwLib.wwPopups.open(options);

                            if (typeof result.color) {
                                value = result.color;
                            } else {
                                return;
                            }
                        } catch (error) {}
                    }
                    break;
            }

            this.checkSelection();

            this.quill.format(cmd, value);
        },

        setIndent(direction) {
            let currentFormat = this.quill.getFormat()['indent'];

            let newValue = 0;

            if (currentFormat) {
                newValue = parseInt(currentFormat.replace('px', ''));
            }

            if (direction === 'left') {
                newValue += 50;
            } else {
                newValue -= 50;
            }

            newValue = Math.max(newValue, 0);
            this.exec('indent', newValue ? newValue + 'px' : false);
        },

        setProp(prop, value) {
            this.saveText({ clearRender: true });
            this.$emit('update', { [prop]: value });
            this.reloadQuill();
        },

        setFontSize(value) {
            this.checkSelection();
            this.quill.format('fontSize', value);
        },

        setFontWeight(value) {
            this.checkSelection();
            if (parseInt(value) === 700) {
                this.quill.format('fontWeight', null);
                this.quill.format('bold', true);
            } else {
                this.quill.format('bold', false);
                this.quill.format('fontWeight', value);
            }
        },

        insertWwObject() {
            const cursorPosition = this.quill.getSelection().index;
            this.quill.insertEmbed(cursorPosition, 'ww-object-embed', '');
            this.quill.setSelection(cursorPosition + 1);

            this.$nextTick(this.saveText);
        },

        setColor(value) {
            this.checkSelection();
            this.quill.format('color', value);
        },

        setFontStyle(value) {
            this.saveText({ clearRender: true });
            this.$emit('update', { fontStyle: value });
            this.reloadQuill();
        },

        async addLink() {
            if (!this.quill.getSelection().length) {
                return alert('Selectionnez du texte pour inserer un lien.');
            }

            let result = await wwLib.wwPopups.open({
                firstPage: 'WWTEXT_LINKS',
            });

            if (!result) {
                return;
            }

            this.quill.format('ww-link-inline', JSON.stringify(result));
        },

        async openPopup(popup) {
            const selection = this.quill.getSelection();

            let options = {
                firstPage: popup,
                data: {
                    fontStyle: this.quill.getFormat(selection && selection.index ? selection.index : 0, 1),
                },
            };

            try {
                await wwLib.wwPopups.open(options);
            } catch (error) {
                console.log(error);
            }
        },

        async openMenu(event) {
            this.saveText();
            this.isTextBarOpen = false;
            this.$emit('openMenu', {
                x: event.pageX,
                y: event.pageY,
                fromManager: true,
            });
            event.stopPropagation();
        },

        async editHTML() {
            let options = {
                firstPage: 'WWTEXT_HTML',
                data: {
                    html: this.getTextFromDom(),
                },
            };

            try {
                const result = await wwLib.wwPopups.open(options);

                if (result && typeof result.html !== undefined) {
                    await this.replaceText(result.html);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async replaceText(text, lang) {
            this.clearRender = true;
            const newText = { ...this.content.text };
            wwLib.wwLang.setText(newText, text, lang);

            await this.wwObjectCtrl.update({ text: newText });

            this.reloadQuill();
        },

        async beforeSave() {
            this.clearRender = true;
            await this.saveText();
            this.quill = null;
        },

        beforeCancel() {
            this.clearRender = true;
            this.quill = null;
            this.$forceUpdate();
        },
        /* wwManager:end */
    },
    created() {
        /* wwManager:start */
        let needUpdate = false;
        if (this.content.text.fr_FR) {
            this.content.text.fr = this.content.text.fr_FR;
            delete this.content.text.fr_FR;
            needUpdate = true;
        }
        if (this.content.text.en_GB) {
            this.content.text.en = this.content.text.en_GB;
            delete this.content.text.en_GB;
            needUpdate = true;
        }
        if (needUpdate) {
            this.wwObjectCtrl.update(this.wwObject);
        }
        /* wwManager:end */
    },
    mounted() {
        this.init();

        /* wwManager:start */
        this.$el.addEventListener('paste', e => {
            e.preventDefault();

            // get text representation of clipboard
            let text = (e.originalEvent || e).clipboardData.getData('text/plain');

            setTimeout(() => {
                document.execCommand('insertHTML', false, text);
            }, 1);
        });

        wwLib.wwAsyncScripts.loadAsset({
            target: 'manager',
            name: 'ww-text',
        });

        wwLib.$on('wwLang:changed', lang => {
            this.saveText({ lang: lang.old });

            this.clearRender = true;

            setTimeout(() => {
                if (this.isEditing) {
                    this.loadQuill();
                }
            }, 100);
        });

        /* wwManager:end */
    },
    beforeDestroy() {
        /* wwManager:start */
        this.saveText();
        /* wwManager:end */
    },
};
</script>

<style scoped lang="scss">
.ww-text {
    display: inline-block;
    width: 100%;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    outline: none;
}

.no-text {
    color: grey;
}

.no-select {
    user-select: none;
}

/*=============================================m_ÔÔ_m=============================================\
  STYLES
\================================================================================================*/
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

    // .ww-object {
    //     margin: 1px;
    // }
}

.ww-text-link {
    text-decoration: none;
    color: inherit;
}

.ql-clipboard {
    display: none;
}

/* wwManager:start */
/*=============================================m_ÔÔ_m=============================================\
  HOVER CLASSES
\================================================================================================*/
.ww-text-hover-h1 {
    &::after {
        content: 'h1';
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #2e86c2;
        color: white;
        padding: 3px 3px 2px 8px;
        border-top-left-radius: 10px;
        font-size: 15px;
        font-family: arial;
    }
}
.ww-text-hover-h2 {
    &::after {
        content: 'h2';
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #2e86c2;
        color: white;
        padding: 3px 3px 2px 8px;
        border-top-left-radius: 10px;
        font-size: 15px;
        font-family: arial;
    }
}
.ww-text-hover-h3 {
    &::after {
        content: 'h3';
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #2e86c2;
        color: white;
        padding: 3px 3px 2px 8px;
        border-top-left-radius: 10px;
        font-size: 15px;
        font-family: arial;
    }
}
.ww-text-hover-h4 {
    &::after {
        content: 'h4';
        position: absolute;
        right: 0;
        bottom: 0;
        background-color: #2e86c2;
        color: white;
        padding: 3px 3px 2px 8px;
        border-top-left-radius: 10px;
        font-size: 15px;
        font-family: arial;
    }
}
/* wwManager:end */
</style>
