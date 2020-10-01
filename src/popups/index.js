import wwTextPopupHtml from './wwTextPopupHtml.vue';
wwLib.wwPopups.addPopup('wwTextPopupHtml', wwTextPopupHtml);

import './stories';

export async function openFontSizes() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONT_SIZES' });
    } catch (error) {
        console.log(error);
    }
}

export async function openFonts() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONTS' });
    } catch (error) {
        console.log(error);
    }
}

export async function openFontStyles() {
    try {
        return await wwLib.wwPopups.open({ firstPage: 'DESIGN_FONT_STYLES' });
    } catch (error) {
        console.log(error);
    }
}
