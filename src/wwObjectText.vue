
<script>
import Vue from 'vue'

/* wwManager:start */
import wwTextBar from './wwTextBar.vue';
/* wwManager:end */

export default {
    name: '__COMPONENT_NAME__',
    components: {
    },
    render(createVNode) {

        if (this.clearRender) {

            this.$nextTick(function () {
                this.clearRender = false;
                this.$forceUpdate();
            });

            this.$el.innerHTML = '';

            return createVNode(this.wwObject.content.data.tag || 'div', {
                class: {
                    "ww-text-content": true
                },
                attrs: {
                    contenteditable: this.editing
                }
            }, null
            )
        }
        else {
            const wwObjRegex = /\[\[wwObject=([^\]]*)\]\]/gi;

            let content = document.createElement('div');

            content.innerHTML = wwLib.wwLang.getText(this.wwObject.content.data.text).replace(wwObjRegex, '<ww-object data-ww-object-id="$1"></ww-object>') || '<br/>';

            const childNodes = content.childNodes;

            const self = this;
            function createVNodes(childNodes) {
                let vNodes = [];

                for (const node of childNodes) {
                    let vNode = null;

                    if (node.nodeName.toLowerCase() == '#text') {
                        vNode = self._v(node.textContent);
                    }
                    else if (node.nodeName.toLowerCase() == 'ww-object') {
                        let vn = createVNodes(node.childNodes);


                        let attributes = {};
                        for (let a of node.attributes) {
                            attributes[a.nodeName] = a.nodeValue;
                        }
                        for (let key in self.wwAttrs) {
                            attributes[key] = self.wwAttrs[key];
                        }

                        vNode = createVNode(
                            node.nodeName.toLowerCase(),
                            {
                                props: {
                                    wwObject: self.wwObject.data.children[node.attributes['data-ww-object-id'].nodeValue],
                                    inText: true,
                                },
                                attrs: attributes
                            },
                            vn
                        )
                    }
                    else if (node.nodeName.toLowerCase() == 'script') {
                        continue;
                    }
                    else {
                        let vn = createVNodes(node.childNodes);

                        let attributes = {};
                        for (let a of node.attributes) {
                            attributes[a.nodeName] = a.nodeValue;
                        }

                        vNode = createVNode(
                            node.nodeName.toLowerCase(),
                            {
                                attrs: attributes,
                            },
                            vn
                        )
                    }

                    if (vNode) {
                        vNodes.push(vNode);
                    }

                }

                return vNodes;
            }

            const root = createVNode(this.wwObject.content.data.tag || 'div', {
                class: {
                    "ww-text-content": true
                },
                attrs: {
                    contenteditable: this.editing
                },
                on: {
                    click: this.click
                },
            },
                createVNodes(childNodes)
            )

            return root;
        }

    },
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        },
    },
    data: function () {
        return {
            /* wwManager:start */
            textBar: null,
            textSelection: null,
            focus: false,
            /* wwManager:end */
        };
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        editing() {
            return this.wwObjectCtrl.getSectionCtrl() && this.wwObjectCtrl.getSectionCtrl().getEditMode() == 'CONTENT' && this.focus
        }
    },
    watch: {
    },
    methods: {

        isTextEmpty() {
            return this.text.trim() == "";
        },
        getType(text) {
            if (text && text.indexOf("wwObject=") == 0) {
                return 'wwObject';
            }
            return 'wwSimpleText';
        },
        isWwObject(text) {
            return text.indexOf("wwObject=") == 0;
        },
        getWwObject(text) {
            let index = text.replace('wwObject=', '');
            try {
                index = parseInt(index);
            }
            catch (e) {
                return text;
            }
            if (this.wwObject.data && this.wwObject.data.children && this.wwObject.data.children[index]) {
                return this.wwObject.data.children[index];
            }
            return text;
        },

        click(event) {
            /* wwManager:start */
            this._click(event);
            /* wwManager:end */
        },

        /* wwManager:start */
        _click(event) {
            /*

            if (this.wwObjectCtrl.getSectionCtrl() && this.wwObjectCtrl.getSectionCtrl().getEditMode() == 'CONTENT') {
                event.preventDefault();
                event.stopPropagation();

                wwLib.wwObjectEditors.add(this.textBar);
                wwLib.wwObjectMargins.close();

                document.removeEventListener('selectionchange', this.updateSelection);
                document.addEventListener('selectionchange', this.updateSelection);

            }

*/

        },

        getTextFromDom() {

            function getText(node, newNode, isChild) {

                if (!node) {
                    return;
                }

                for (let i = 0; i < node.childNodes.length; i++) {

                    if (!node.childNodes[i] || !node.childNodes[i].nodeName) {
                        continue;
                    }

                    if (node.childNodes[i].nodeName.toLowerCase() == '#text') {
                        newNode.append(node.childNodes[i].cloneNode(false))
                        //Nothing.
                    }
                    else if (node.childNodes[i].classList && node.childNodes[i].classList.contains('ww-object')) {
                        //console.log(document.createTextNode('[[wwObject=' + node.childNodes[i].attributes['data-ww-object-id'].nodeValue + ']]'))
                        newNode.append(document.createTextNode('[[wwObject=' + node.childNodes[i].attributes['data-ww-object-id'].nodeValue + ']]'))
                        //node.childNodes[i] = 
                    }
                    else {
                        newNode.append(node.childNodes[i].cloneNode(false))
                        getText(node.childNodes[i], newNode.childNodes[newNode.childNodes.length - 1], true);
                    }

                }

                if (!isChild) {
                    return newNode.innerHTML;
                }

            }

            const a = this.$el.cloneNode(true);
            const newNode = document.createElement('div');


            let t = getText(a, newNode)

            return t;

        },

        async saveText() {
            wwLib.wwObjectEditors.close(this.textBar);

            let newText = this.getTextFromDom();

            wwLib.wwObjectHover.removeLock();

            this.clearRender = true;

            wwLib.wwLang.setText(this.wwObject.content.data.text, newText);
            await this.wwObjectCtrl.update(this.wwObject);
        },

        getSelection() {
            let selection = null;
            if (window.getSelection) {
                try {
                    var sel = window.getSelection && window.getSelection();
                    if (sel && sel.rangeCount > 0) {
                        selection = sel.getRangeAt(0);
                    }
                } catch (error) {
                    console.log(error);
                    return null;
                }
            }
            return selection;
        },

        updateSelection(event) {
            if (document.activeElement == this.$el) {
                this.textSelection = this.getSelection();
            }
        },

        reselect() {
            let selection = window.getSelection();
            selection.removeAllRanges();
            if (this.textSelection) {
                let textSelection = this.textSelection
                selection.addRange(textSelection);
            }
        },

        wwTextBarAction(options) {
            //console.log(action);
            const category = options.split(':')[0];
            const action = options.split(':').length > 1 ? options.split(':')[1] : null;
            const value = options.split(':').length > 2 ? options.split(':')[2] : null;

            this.$nextTick(function () {
                this.reselect();

                switch (category) {
                    case 'style':
                        this.editStyle(action, value);
                        break;
                    case 'link':
                        this.addLink()
                        break;
                    case 'add':
                        this.addWwObject();
                        break;
                    case 'exec':
                        this.exec(action, value)
                        break;
                    case 'prop':
                        this.setProp(action, value)
                        break;
                    case 'insert':
                        this.insert(action, value)
                        break;
                    case 'clear':
                        this.clear()
                        break;
                    case 'reset':
                        this.reset()
                        break;
                    case 'other':
                        this.edit()
                        break;
                    case 'delete':
                        this.remove();
                        break;
                    case 'margins':
                        this.margins();
                        break;
                    default:

                        break;
                }
            });


        },

        getHoverTag() {
            switch (this.wwObject.content.data.tag) {
                case 'h1':
                    return 'ww-text-hover-h1';
                    break;
                case 'h2':
                    return 'ww-text-hover-h2';
                    break;
                case 'h3':
                    return 'ww-text-hover-h3';
                    break;
                case 'h4':
                    return 'ww-text-hover-h4';
                    break;
                default:
                    return '';
                    break;
            }
        },

        /*=============================================m_ÔÔ_m=============================================\
          TEXT BAR FUNCTIONS
        \================================================================================================*/
        reset() {
            this.$el.innerHTML = '';
            wwLib.wwLang.setText(this.wwObject.content.data.text, '');
        },

        clear() {
            if (this.textSelection.toString().length !== 0) {
                this.replaceSelectionWithHtml(window.getSelection().toString())
            }
            else {
                this.$el.innerHTML = this.$el.innerText;
            }
        },

        insert(action, value) {
            switch (action) {
                case 'hr':
                    switch (value) {
                        case 'small':
                            document.execCommand("insertHTML", false, '<hr width="25%">');
                            break;
                        case 'medium':
                            document.execCommand("insertHTML", false, '<hr width="50%">');
                            break;
                        case 'big':
                            document.execCommand("insertHTML", false, '<hr width="100%">');
                            break;
                    }
                    break;
            }
        },

        editStyle(action, value) {

            switch (action) {
                case 'size':
                    let sizes = {
                        xsmall: 0.6,
                        small: 1,
                        medium: 1.5,
                        big: 2,
                        xbig: 3,
                    }

                    let size = sizes[value] || parseFloat(value);

                    this.setStyle('font-size', size + 'rem');
                    break;
                case 'color':
                    this.setColor(value);

                    break;
                case 'align':
                    //this.setStyle('text-align', value);
                    this.setAlign(value);
                    break;
                case 'font':
                    this.setFont(value);
                    break;
            }

        },

        exec(cmd, value) {
            document.execCommand(cmd, false, value || '');
        },

        setProp(prop, value) {
            this.wwObject.content.data[prop] = value;
        },

        removeTags(tag, style) {

            let str = this.$el.innerHTML;

            let startReg = new RegExp('<' + tag + (style ? ' style="' + style + '=' : '') + '[^\>]*>');
            let startFalse = '<' + tag
            let end = '</' + tag + '>'

            let matches;
            while (matches = startReg.exec(str)) {

                let level = 0;

                let startIndex = matches.index;
                let startLength = matches[0].length;
                let endIndex = -1;

                for (let i = startIndex + startLength; i < str.length; i++) {
                    if (str.substr(i).indexOf(startFalse) === 0) {
                        level++;
                        continue;
                    }
                    if (level != 0 && str.substr(i).indexOf(end) === 0) {
                        level--;
                        continue;
                    }
                    if (level == 0 && str.substr(i).indexOf(end) === 0) {
                        endIndex = i;
                        break;
                    }
                }

                str = str.substr(0, startIndex) + str.substr(startIndex).replace(startReg, '')
                str = str.substr(0, endIndex - startLength) + str.substr(endIndex - startLength).replace(end, '')
            }

            if (str) {
                this.$el.innerHTML = str;
            }

        },

        removeStyles(style, root) {
            root = root || this.$el;

            if (!root.children || !root.children.length) {
                return;
            }
            else {
                for (let child of root.children) {
                    child.style[style] = '';
                    this.removeStyles(style, child);
                }
            }
        },

        setStyle(style, value) {

            if (!this.textSelection || this.textSelection.toString().length == 0) {
                this.selectAll();
            }

            let html = this.getSelectionHtml();

            const start = '<span style="' + style + ':' + value + '">';
            const end = '</span>';

            const reg = new RegExp('<span style="' + style + ':[^\"]*">(.*?)<\/span>');

            let m;
            while (m = reg.exec(html)) {
                if (m && m[1]) {
                    html = html.replace(m[0], m[1]);
                }
            }

            html = start + html + end;

            this.replaceSelectionWithHtml(html);
        },

        setAlign(value) {
            switch (value) {
                case 'justify':
                    document.execCommand('justifyFull', false, 'span');
                    break;
                case 'center':
                    document.execCommand('justifyCenter', false, 'span');
                    break;
                case 'left':
                    document.execCommand('justifyLeft', false, 'span');
                    break;
                case 'right':
                    document.execCommand('justifyRight', false, 'span');
                    break;
            }
        },

        setFont(value) {

            if (!this.textSelection || this.textSelection.toString().length == 0) {
                this.selectAll();
            }
            switch (value) {
                case 'more':
                    console.log('OPEN MORE !');
                    break;
                default:
                    document.execCommand('fontName', false, value);
                    break;
            }
        },

        async setColor(value) {


            if (!this.textSelection || this.textSelection.toString().length == 0) {
                this.selectAll();
            }

            switch (value) {
                case 'more':

                    let options = {
                        firstPage: 'COLOR_PICKER'
                    }

                    try {
                        const result = await wwLib.wwPopups.open(options)

                        if (typeof (result.color)) {
                            this.setColor(result.color)
                        }
                    } catch (error) {

                    }

                    break;
                default:
                    document.execCommand('foreColor', false, value);
                    break;
            }
        },

        addLink() {
            let link = prompt("Lien à inserer :", "http://");

            if (!link) {
                return;
            }

            if (this.textSelection.toString().length !== 0) {
                let linkText = window.getSelection().toString();

                this.replaceSelectionWithHtml('<a target="_blank" class="ww-text-link" href="' + link + '"><u>' + linkText + "</u></a>");
            } else {
                this.replaceSelectionWithHtml('<a target="_blank" class="ww-text-link" href="' + link + '"><u>' + link + "</u></a>");
            }
        },

        replaceSelectionWithHtml(html) {

            let localrange;
            if (window.getSelection && window.getSelection().getRangeAt) {
                localrange = this.getSelection();
                localrange.deleteContents();
                const div = document.createElement("div");
                div.innerHTML = html;
                const frag = document.createDocumentFragment()
                let child;
                while ((child = div.firstChild)) {
                    frag.appendChild(child);
                }
                localrange.insertNode(frag);
            } else if (document.selection && document.selection.createRange) {
                localrange = document.selection.createRange();
                localrange.pasteHTML(html);
            }

        },

        getSelectionHtml() {
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        },

        selectAll() {
            var node = this.$el;

            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(node);
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNodeContents(node);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            }

            this.textSelection = this.getSelection();
        },

        addWwObject() {
            const newWwObject = wwLib.wwObject.getDefault({ type: 'ww-button' });

            //Find first empty index in current wwObject children
            let index = 0;
            while (this.wwObject.data.children[index]) {
                index++;
            }

            this.wwObject.data.children[index] = newWwObject;

            this.replaceSelectionWithHtml('[[wwObject=' + index + ']]');

            let newText = this.getTextFromDom();

            this.clearRender = true;

            wwLib.wwLang.setText(this.wwObject.content.data.text, newText);
            this.wwObjectCtrl.update(this.wwObject);




        },

        remove() {
            wwLib.wwObjectEditors.close(this.textBar);
            this.wwObjectCtrl.context.remove();
        },

        margins() {
            wwLib.wwObjectHover.setMain(this.wwObjectCtrl.context);
            wwLib.wwObjectHover.setLock(this.wwObjectCtrl.context);
            wwLib.wwObjectEditors.close(this.textBar);
            wwLib.wwObjectMargins.set(this.wwObjectCtrl.context);
        },

        async edit() {
            wwLib.wwObjectHover.setLock(this);

            wwLib.wwPopups.addStory('WWTEXT_EDIT', {
                title: {
                    en_GB: 'Edit Text',
                    fr_FR: 'Editer le texte'
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: {
                    }
                }
            })

            let options = {
                firstPage: 'WWTEXT_EDIT',
                data: {
                    wwObject: this.wwObject
                }
            }

            try {
                const result = await wwLib.wwPopups.open(options);

                this.wwObjectCtrl.globalEdit(result);

            } catch (error) {
                console.log(error);
            }

            wwLib.wwObjectHover.removeLock();
        },

        setFocus(focusId) {
            const oldFocus = this.focus;
            this.focus = focusId == this.$parent._uid
            if (this.focus) {
                wwLib.wwObjectEditors.add(this.textBar);
                wwLib.wwObjectMargins.close();


                document.removeEventListener('selectionchange', this.updateSelection);
                document.addEventListener('selectionchange', this.updateSelection);

                const self = this;
                setTimeout(function () {
                    wwLib.wwObjectHover.removeLock();
                    wwLib.wwObjectHover.setMain(self.$parent);
                    wwLib.wwObjectHover.setLock(self.$parent);

                    if (self.$el.classList.contains('ww-text-content')) {
                        self.$el.focus();
                    }
                    else if (self.$el.querySelector('.ww-text-content')) {
                        self.$el.querySelector('.ww-text-content').focus();
                    }
                    else {
                        console.log('no focus...');
                    }
                }, 50);
            }
            else if (oldFocus) {
                wwLib.wwObjectEditors.close(this.textBar);
                document.removeEventListener('selectionchange', this.updateSelection);

                this.saveText();
            }
        },

        async beforeSave() {
            await this.saveText();
        }
        /* wwManager:end */
    },
    created() {
    },
    mounted() {

        this.$emit('ww-loaded', this);

        const self = this;
        wwLib.$on("wwLang:changed", function (lang) {

            if (self.focus) {
                wwLib.wwLang.setText(self.wwObject.content.data.text, self.$el.innerHTML, lang.old);
            }

            self.text = wwLib.wwLang.getText(self.wwObject.content.data.text);

        });

        this.$el.addEventListener('paste', function (e) {

            e.preventDefault();

            // get text representation of clipboard
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');

            // insert text manually
            document.execCommand("insertHTML", false, text);
        })

        /* wwManager:start */
        this.textBar = {
            context: this,
            type: 'wwTextBar',
            component: wwTextBar
        }

        wwLib.$on('wwFocus', this.setFocus);

        wwLib.wwAsyncScripts.loadAsset({
            target: 'manager',
            name: 'ww-text',
        });
        /* wwManager:end */
    },
    beforeDestroy() {

        this.saveText();
        wwLib.$off('wwFocus', this.setFocus);

        wwLib.wwObjectEditors.close(this.textBar);
    }
};
</script>

<style scoped lang="scss">
.ww-text-content {
    display: inline-block;
    width: 100%;
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    outline: none;
}

.ww-text-content .ww-object-wrapper,
.ww-text-content .ww-object {
    display: inline-block;
}

.ww-text-content .ww-object {
    margin: 1px;
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

.ww-object {
    vertical-align: middle;
    // line-height: 0 !important;
}
</style>

<style lang="scss">
.ww-text-content {
    ol,
    ul {
        margin: 0;
    }

    hr {
        font-size: inherit;
        font-weight: inherit;
        display: inline-block;
        margin-block-start: 0px;
        margin-block-end: 0px;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
}

.ww-text-link {
    text-decoration: none;
    color: inherit;
}

/* wwManager:start */
/*=============================================m_ÔÔ_m=============================================\
  HOVER CLASSES
\================================================================================================*/
.ww-text-hover-h1 {
    &::after {
        content: "h1";
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
        content: "h2";
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
        content: "h3";
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
        content: "h4";
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