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

export async function openFontSizes() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONT_SIZES' });
    } catch (error) {
        return;
    }
}

export async function openFonts() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONTS' });
    } catch (error) {
        return;
    }
}

export async function openFontStyles() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONT_STYLES' });
    } catch (error) {
        return;
    }
}
