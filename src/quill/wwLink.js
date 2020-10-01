import Quill from 'quill';
const Inline = Quill.import('blots/inline');
const TextBlot = Quill.import('blots/text');
const Break = Quill.import('blots/break');
const Cursor = Quill.import('blots/cursor');

class WwLink extends Inline {
    static create(value) {
        const node = super.create(value);

        if (typeof value == 'object' && value.wwLink) {
            value = value.wwLink;
        }

        node.setAttribute('data-ww-link', value);

        const valueObject = JSON.parse(value);
        const linkType = Object.keys(valueObject)[0];
        let linkText = '';
        switch (linkType) {
            case 'linkExt':
                linkText = valueObject[linkType];
                break;
            case 'linkPage': {
                const pageId = valueObject[linkType];
                const pageName = wwLib.wwWebsiteData.getPages().find(({ id }) => id == pageId) || 'Unknown';
                linkText = 'Page : ' + pageName;
                break;
            }
            case 'linkSection': {
                const sectionId = valueObject[linkType];
                const { sectionTitle = 'Unknown' } =
                    wwLib.wwWebsiteData
                        .getCurrentPage()
                        .sections.map(({ id }) => wwLib.$store.getters['websiteData/getSection'](id))
                        .find(({ linkId }) => linkId == sectionId) || {};
                linkText = 'Section : ' + sectionTitle;
                break;
            }
            case 'linkFile':
                linkText = 'File : ' + valueObject[linkType].split('/')[valueObject[linkType].split('/').length - 1];
                break;
            case 'linkClosePopup':
                linkText = 'Close Popup';
                break;
        }

        node.setAttribute('data-link', linkText);

        return node;
    }

    static formats(node) {
        return {
            wwLink: node.getAttribute('data-ww-link'),
        };
    }

    // get value of the node (for implement undo function)
    static value(node) {
        return node.getAttribute('data-ww-link') || '';
    }
}
WwLink.blotName = 'ww-link-inline';
WwLink.tagName = 'SPAN';
WwLink.className = 'ww-link-inline';
WwLink.allowedChildren = [TextBlot, Inline, Break, Cursor];

export default WwLink;
