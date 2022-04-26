export default {
    inherit: 'ww-text',
    editor: {
        label: {
            en: 'Text',
            fr: 'Texte',
        },
        icon: 'type',
        infoTag: content => ({
            color: 'var(--ww-color-blue-500)',
            backgroundColor: 'var(--ww-color-blue-100)',
            text:
                content['_ww-text_tag'] === 'button'
                    ? 'BTN'
                    : content['_ww-text_tag'] && content['_ww-text_tag'].toUpperCase(),
            action: () => {
                wwLib.wwSearchBar.executeAction({
                    actions: wwLib.wwSearchBar.getEditSidebarActions('settings', 'custom-0'),
                });
            },
        }),
    },
    options: {
        hyperlink: true,
    },
    properties: {},
};
