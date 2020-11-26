import wwTextPopupHtml from './wwTextPopupHtml.vue';
wwLib.wwPopups.addPopup('wwTextPopupHtml', wwTextPopupHtml);

import './stories';

export async function openEditHTML(text) {
    try {
        return await wwLib.wwPopups.open({
            firstPage: 'WWTEXT_HTML',
            data: {
                html: text,
            },
        });
    } catch (error) {
        return null;
    }
}
