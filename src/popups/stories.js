wwLib.wwPopups.addStory('WWTEXT_HTML', {
    title: {
        en: 'Edit HTML',
        fr: 'Editer le HTML',
    },
    type: 'wwTextPopupHtml',
    storyData: {},
    buttons: {
        NEXT: {
            text: {
                en: 'Ok',
                fr: 'Ok',
            },
            next: false,
        },
    },
});

wwLib.wwPopups.addStory('WWTEXT_LINKS', {
    title: {
        en: 'Link',
        fr: 'Lien',
    },
    type: 'wwPopupLinks',
    storyData: {
        links: ['EXTERNAL', 'INTERNAL', 'SECTION', 'DOWNLOAD', 'CLOSE_POPUP'],
    },
});
