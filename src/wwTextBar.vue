<template>
    <wwEditorWidget movable css-class="ww-text-bar">
        <div class="content" :class="{ expended }">
            <div class="line main">
                <!-- BOLD -->
                <div class="item">
                    <span class="fas fa-bold"></span>
                    <div class="subitems">
                        <div class="item font" @click="setFontWeight(700)">
                            <span>Bold (700)</span>
                        </div>
                        <div class="item font" @click="setFontWeight(400)">
                            <span>Normal (400)</span>
                        </div>
                        <div class="item font" @click="setFontWeight(100)">
                            <span>Light (100)</span>
                        </div>
                        <div class="item input">
                            <input type="text" v-model="fontWeight" @keydown.enter="setFontWeight(fontWeight)" />
                        </div>
                    </div>
                </div>

                <!-- ITALIC -->
                <div class="item" @click="toggleItalic">
                    <span class="fas fa-italic"></span>
                </div>
                <!-- UNDERLINE -->
                <div class="item" @click="toggleUnderline">
                    <span class="fas fa-underline"></span>
                </div>

                <div class="separator"></div>

                <!-- FONT SIZE -->
                <div class="item">
                    <span class="wwi wwi-font-size"></span>
                    <div class="subitems">
                        <div
                            class="item font-size"
                            v-for="fontSize in fontSizes"
                            :key="fontSize.name"
                            @click="setFontSize(fontSize.name)"
                        >
                            {{ fontSize.name }}
                        </div>
                        <div class="item font-size blue" @click="openFontSizes">
                            <span class="wwi wwi-add"></span>
                        </div>
                    </div>
                </div>

                <!-- FONT -->
                <div class="item">
                    <span class="fas fa-font"></span>
                    <div class="subitems">
                        <div
                            class="item font"
                            v-for="font in fonts"
                            :key="font.name"
                            @click="setFontFamily(font.value)"
                            :style="'font-family:' + font.value"
                        >
                            {{ font.name }}
                        </div>
                        <div
                            class="item font"
                            v-if="defaultFont"
                            @click="setFontFamily('inherit')"
                            :style="{ 'font-family': defaultFont }"
                        >
                            - Default -
                            <br />
                            {{ defaultFont }}
                        </div>
                        <div class="item font blue" @click="openFonts">
                            <span class="wwi wwi-add"></span>
                        </div>
                    </div>
                </div>
                <!-- ALIGN -->
                <div class="item">
                    <span class="fas fa-align-left"></span>
                    <div class="subitems">
                        <div class="item" @click="setAlign('justify')">
                            <span class="fas fa-align-justify"></span>
                        </div>
                        <div class="item" @click="setAlign('right')">
                            <span class="fas fa-align-right"></span>
                        </div>
                        <div class="item" @click="setAlign('center')">
                            <span class="fas fa-align-center"></span>
                        </div>
                        <div class="item" @click="setAlign('left')">
                            <span class="fas fa-align-left"></span>
                        </div>
                    </div>
                </div>
                <!-- COLOR -->
                <div class="item">
                    <span class="wwi wwi-color"></span>
                    <div class="subitems">
                        <div class="item colors">
                            <div class="color">
                                Text
                                <wwManagerColorSelect
                                    :value="textColor"
                                    @change="setTextColor($event)"
                                ></wwManagerColorSelect>
                            </div>
                            <div class="color">
                                Background
                                <wwManagerColorSelect
                                    :value="backgroundColor"
                                    @change="setBackgroundColor($event)"
                                ></wwManagerColorSelect>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>

                <!-- COPY FORMAT -->
                <div class="item" @click="copyOrPasteFormat()" :class="{ green: hasCopiedFormat }">
                    <span class="fas fa-paint-roller"></span>
                </div>

                <div class="separator"></div>

                <!-- EXPEND -->
                <div
                    class="item expend-arrow"
                    @mouseenter="expended = true"
                    @click="expended = !expended"
                    :class="{ expended }"
                >
                    <span class="wwi wwi-chevron-down"></span>
                </div>

                <!-- MENU -->
                <div class="item orange round" @click="openMenu">
                    <span class="wwi wwi-edit-other"></span>
                </div>
            </div>
            <div class="line not-main">
                <!-- LINK -->
                <div class="item" @click="action('link')">
                    <span class="fas fa-link"></span>
                </div>
                <!-- CLEAR -->
                <div class="item" @click="removeFormat">
                    <span class="fas fa-remove-format"></span>
                </div>
                <!-- STYLE -->
                <div class="item">
                    <span class="wwi wwi-edit-style"></span>
                    <div class="subitems">
                        <div
                            class="item font-style"
                            v-for="fontStyle in fontStyles"
                            :key="fontStyle.name"
                            @click="setFontStyle(fontStyle.className)"
                            :style="fontStyle.style"
                            :class="[fontStyle.style.fontSizeClass, fontStyle.style.color == '#ffffff' ? 'white' : '']"
                        >
                            {{ fontStyle.name }}
                        </div>
                        <div class="item font-style" @click="setFontStyle('')">
                            - No style -
                            <br />
                        </div>
                        <div class="item font-style blue" @click="openFontStyles">
                            <span class="wwi wwi-add"></span>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>

                <!-- BULLETS -->
                <div class="item">
                    <span class="fas fa-list-ul"></span>
                    <div class="subitems">
                        <div class="item" @click="setIndent('right')">
                            <span class="fas fa-outdent"></span>
                        </div>
                        <div class="item" @click="setIndent('left')">
                            <span class="fas fa-indent"></span>
                        </div>
                        <div class="item" @click="toggleList('ordered')">
                            <span class="fas fa-list-ol"></span>
                        </div>
                        <div class="item" @click="toggleList('bullet')">
                            <span class="fas fa-list-ul"></span>
                        </div>
                    </div>
                </div>
                <!-- LINE SPACE -->
                <div class="item">
                    <span class="fas fa-text-height"></span>
                    <div class="subitems">
                        <div class="item font" @click="setLineHeight(60)">
                            <span>60px</span>
                        </div>
                        <div class="item font" @click="setLineHeight(50)">
                            <span>50px</span>
                        </div>
                        <div class="item font" @click="setLineHeight(40)">
                            <span>40px</span>
                        </div>
                        <div class="item font" @click="setLineHeight(30)">
                            <span>30px</span>
                        </div>
                        <div class="item font" @click="setLineHeight(20)">
                            <span>20px</span>
                        </div>
                        <div class="item input">
                            <input type="text" v-model="lineHeight" @keydown.enter="setLineHeight(lineHeight)" />
                        </div>
                        <div class="item font" @click="setLineHeight()">- Default -</div>
                    </div>
                </div>
                <!-- LETTER SPACE -->
                <div class="item">
                    <span class="fas fa-text-width"></span>
                    <div class="subitems">
                        <div class="item font" @click="setLetterSpacing(5)">
                            <span>5px</span>
                        </div>
                        <div class="item font" @click="setLetterSpacing(4)">
                            <span>4px</span>
                        </div>
                        <div class="item font" @click="setLetterSpacing(3)">
                            <span>3px</span>
                        </div>
                        <div class="item font" @click="setLetterSpacing(2)">
                            <span>2px</span>
                        </div>
                        <div class="item font" @click="setLetterSpacing(1)">
                            <span>1px</span>
                        </div>
                        <div class="item input">
                            <input
                                type="text"
                                v-model="letterSpacing"
                                @keydown.enter="setLetterSpacing(letterSpacing)"
                            />
                        </div>
                        <div class="item font" @click="setLetterSpacing()">- Default -</div>
                    </div>
                </div>

                <div class="separator"></div>

                <!-- HEADER -->
                <div class="item">
                    <span :class="tagClasses"></span>
                    <div class="subitems">
                        <div class="item" @click="setTag('h1')">
                            <span class="wwi wwi-tag-h1"></span>
                        </div>
                        <div class="item" @click="setTag('h2')">
                            <span class="wwi wwi-tag-h2"></span>
                        </div>
                        <div class="item" @click="setTag('h3')">
                            <span class="wwi wwi-tag-h3"></span>
                        </div>
                        <div class="item" @click="setTag('h4')">
                            <span class="wwi wwi-tag-h4"></span>
                        </div>
                        <div class="item" @click="setTag('div')">
                            <span class="fa fa-paragraph"></span>
                        </div>
                    </div>
                </div>
                <div class="separator"></div>
                <!-- LINE -->
                <div class="item">
                    <span class="wwi wwi-separator"></span>
                    <div class="subitems">
                        <div class="item xsmall" @click="insertLine('25%')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                        <div class="item medium" @click="insertLine('50%')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                        <div class="item xbig" @click="insertLine('100%')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                        <div class="item input">
                            <input type="text" v-model="lineThickness" />
                        </div>
                        <div class="item">
                            <wwManagerColorSelect v-model="lineColor"></wwManagerColorSelect>
                        </div>
                    </div>
                </div>
                <!-- WWOBJECT -->
                <div class="item blue" @click="action('insertWwObject')">
                    <span class="wwi wwi-add"></span>
                </div>
            </div>
        </div>
    </wwEditorWidget>
</template>

<script>
import { openFontSizes, openFonts, openFontStyles } from './popups';

export default {
    name: 'wwTextBar',
    props: {
        quill: Object,
        textTag: String,
        selectionFormat: Object,
    },
    data() {
        return {
            expended: false,
            hasCopiedFormat: false,
            fontWeight: 400,
            lineHeight: 0,
            letterSpacing: 0,
            lineColor: '#000000',
            lineThickness: 1,
        };
    },
    computed: {
        fonts() {
            const { list = [] } = wwLib.wwWebsiteData.getInfo().fonts || {};
            return list.map(font => ({ ...font, value: font.name + ', ' + (font.genericName || 'sans-serif') }));
        },
        fontSizes() {
            const { list = [] } = wwLib.wwWebsiteData.getInfo().fontSizes || {};
            return list;
        },
        fontStyles() {
            const { list = [] } = wwLib.wwWebsiteData.getInfo().fontStyles || {};
            return list;
        },
        defaultFont() {
            const { name } = this.fonts.default || {};
            return name;
        },
        textColor() {
            const currentColor = this.selectionFormat.color;
            if (!currentColor) {
                return '';
            }
            return Array.isArray(currentColor) ? currentColor[0] : currentColor;
        },
        backgroundColor() {
            const currentColor = this.selectionFormat.background;
            if (!currentColor) {
                return '';
            }
            return Array.isArray(currentColor) ? currentColor[0] : currentColor;
        },
        tagClasses() {
            switch (this.textTag) {
                case 'h1':
                    return ['wwi', 'wwi-tag-h1'];
                case 'h2':
                    return ['wwi', 'wwi-tag-h2'];
                case 'h3':
                    return ['wwi', 'wwi-tag-h3'];
                case 'h4':
                    return ['wwi', 'wwi-tag-h4'];
                case 'div':
                    return ['fa', 'fa-paragraph'];
                default:
                    return '';
            }
        },
    },
    methods: {
        setFontWeight(value) {
            this.fontWeight = value;
            const fontWeight = value === 700 ? null : value;
            const bold = value === 700;
            this.$emit('updateFormat', { fontWeight, bold });
        },
        toggleItalic() {
            this.$emit('updateFormat', { italic: !this.selectionFormat.italic });
        },
        toggleUnderline() {
            this.$emit('updateFormat', { underline: !this.selectionFormat.underline });
        },
        setFontSize(name) {
            const fontSize = name.toLowerCase().replace(/\s/g, '');
            this.$emit('updateFormat', { fontSize });
        },
        openFontSizes() {
            openFontSizes();
        },
        openFonts() {
            openFonts();
        },
        openFontStyles() {
            openFontStyles();
        },
        setFontFamily(fontFamily) {
            this.$emit('updateFormat', { 'font-family': fontFamily });
        },
        setAlign(align) {
            this.$emit('updateFormat', { align });
        },
        setTextColor(color) {
            this.$emit('updateFormat', { color });
        },
        setBackgroundColor(background) {
            this.$emit('updateFormat', { background });
        },
        getCopiedFormat() {
            try {
                let copiedFormat = localStorage.getItem('ww-text-copied-format');
                copiedFormat = JSON.parse(copiedFormat);
                return copiedFormat;
            } catch (error) {
                return null;
            }
        },
        checkIfCopiedFormat() {
            this.hasCopiedFormat = !!this.getCopiedFormat();
        },
        copyOrPasteFormat() {
            const copiedFormat = this.getCopiedFormat();
            if (copiedFormat) {
                this.$emit('setFormat', copiedFormat);
                localStorage.removeItem('ww-text-copied-format');
                this.hasCopiedFormat = false;
            } else {
                localStorage.setItem('ww-text-copied-format', JSON.stringify(this.selectionFormat));
                this.hasCopiedFormat = true;
            }
        },
        openMenu() {
            this.$emit('openMenu');
        },
        removeFormat() {
            this.$emit('removeFormat');
        },
        setFontStyle(fontStyle) {
            this.$emit('updateContent', { fontStyle });
        },
        setIndent(direction) {
            const currentIndent = this.selectionFormat.indent;
            let newValue = 0;
            if (currentIndent) {
                newValue = parseInt(currentIndent.replace('px', ''));
            }
            if (direction === 'left') {
                newValue += 50;
            } else {
                newValue -= 50;
            }
            newValue = Math.max(newValue, 0);
            this.$emit('updateFormat', { indent: newValue ? newValue + 'px' : false });
        },
        toggleList(value) {
            const currentValue = this.selectionFormat.list;
            this.$emit('updateFormat', { list: currentValue === value ? null : value });
        },
        setLineHeight(value) {
            this.lineHeight = value;
            const lineHeight = value ? `${value}px` : '';
            this.$emit('updateFormat', { lineHeight });
        },
        setLetterSpacing(value) {
            this.letterSpacing = value;
            const letterSpacing = value ? `${value}px` : '';
            this.$emit('updateFormat', { letterSpacing });
        },
        insertLine(width) {
            this.$emit('insertLine', { width, color: this.lineColor, height: this.lineThickness });
        },
        setTag(tag) {
            this.$emit('updateContent', { tag });
        },

        getSpacings() {
            try {
                let format = this.quill.getFormat();
                if (format.letterSpacing) {
                    this.letterSpacing = parseFloat(format.letterSpacing.replace('px', ''));
                } else {
                    this.letterSpacing = 0;
                }
                if (format.lineHeight) {
                    this.lineHeight = parseFloat(format.lineHeight.replace('px', ''));
                } else {
                    this.lineHeight = 0;
                }
            } catch (error) {
                return;
            }
        },
    },
    mounted() {
        this.checkIfCopiedFormat();
    },
};
</script>

<style scoped lang="scss">
$ww-red: #e02a4d;
$ww-green: #49b9b3;
$ww-orange: #ef811a;
$ww-blue: #2e85c2;

.ww-text-bar {
    z-index: 50;
    display: flex;
    filter: drop-shadow(0 2px 5px rgba(99, 99, 99, 0.5));
    transition: transform 0.2s cubic-bezier(0.35, 0.07, 0.35, 1.65), opacity 0.2s ease;

    .content {
        display: flex;
        flex-direction: column;
        //overflow-x: hidden;

        .line {
            position: relative;
            display: flex;
            flex-direction: row;
            background-color: white;
            padding-left: 20px;
            transition: max-width 0.3s cubic-bezier(0.015, 0.04, 0, 1);

            &.main {
                border-radius: 3px 50px 50px 3px;
                max-width: 470px;
            }

            &.not-main {
                opacity: 0;
                position: absolute;
                bottom: 100%;
                left: 0;
                border-radius: 3px 3px 0 0;
            }

            @for $i from 1 through 15 {
                & > :nth-child(#{$i}) {
                    transition: all 0.3s ease, transform 0.3s ease 0.015s * $i;
                }
            }

            .item {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                font-size: 24px;
                color: #5e5e5e;
                position: relative;

                min-width: 44px;
                cursor: pointer;
                border-radius: 3px;

                &:hover {
                    z-index: 1;
                    background-color: #e4e4e4;
                }

                &.round {
                    border-radius: 3px 50px 50px 3px;
                    padding-left: 10px;
                }

                &.red {
                    color: $ww-red;
                    &:hover {
                        background-color: $ww-red;
                        color: white;
                    }
                }
                &.green {
                    color: $ww-green;
                    &:hover {
                        background-color: $ww-green;
                        color: white;
                    }
                }
                &.orange {
                    color: $ww-orange;
                    &:hover {
                        background-color: $ww-orange;
                        color: white;
                    }
                }
                &.blue {
                    color: $ww-blue;
                    &:hover {
                        background-color: $ww-blue;
                        color: white;
                    }
                }

                &.input {
                    padding: 10px 5px;
                    input {
                        border: 1px solid $ww-blue;
                    }
                }

                &.xsmall {
                    font-size: 12px;
                }
                &.small {
                    font-size: 15px;
                }
                &.medium {
                    font-size: 18px;
                }
                &.big {
                    font-size: 21px;
                }
                &.xbig {
                    font-size: 24px;
                }

                &.font {
                    white-space: nowrap;
                    font-size: 14px !important;
                    text-align: center;
                }

                &.font-size {
                    white-space: nowrap;
                    text-align: left;
                    font-size: 14px !important;
                }

                &.font-style {
                    white-space: nowrap;
                    font-size: 14px;
                    &.white {
                        background-color: #e8e8e8;
                    }
                }

                &.colors {
                    display: flex;
                    flex-direction: row;
                    padding: 15px !important;

                    // div {
                    //     border: 1px solid #a3a3a3;
                    //     width: 20px;
                    //     height: 20px;
                    //     margin: 3px;
                    //     cursor: pointer;
                    //     border-radius: 3px;
                    // }

                    &:hover {
                        background-color: transparent;
                    }

                    .color {
                        // padding: 15px 10px 15px 5px;
                        font-size: 10px;
                        width: 80px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        & > div {
                            margin-top: 10px;
                            width: 30px;
                            height: 30px;
                        }
                    }
                }

                &.expend-arrow {
                    span {
                        transition: all 0.3s ease;
                        transform: rotate(0deg);
                    }
                    &.expended {
                        span {
                            transform: rotate(-180deg);
                        }
                    }
                }

                span {
                    z-index: 1;
                }

                span.fa,
                span.fas {
                    font-size: 18px;
                }

                .small-icon {
                    font-size: 18px;
                    margin-top: 4px;
                }

                input {
                    width: 42px;
                    text-align: center;
                }

                .subitems {
                    z-index: 2;
                    position: absolute;
                    pointer-events: none;
                    opacity: 0;
                    top: 100%;
                    left: 50%;
                    transform: translate(-50%, -10px);
                    border-radius: 3px;
                    box-shadow: 0 2px 5px -1px rgba(99, 99, 99, 0.5);
                    background-color: white;
                    transition: transform 0.2s cubic-bezier(0.35, 0.07, 0.35, 1.65), opacity 0.2s ease;
                    z-index: 1;

                    &:after {
                        content: '';
                        background-color: white;
                        position: absolute;
                        top: 0;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(45deg);
                        width: 10px;
                        height: 10px;
                    }

                    &:before {
                        content: '';
                        width: 100%;
                        height: 10px;
                        position: absolute;
                        bottom: 100%;
                        left: 0;
                    }
                }

                &:hover .subitems {
                    pointer-events: all;
                    opacity: 1;
                    transform: translate(-50%, 10px);
                }
            }

            &.not-main {
                .item {
                    .subitems {
                        top: unset;
                        bottom: 100%;
                        transform: translate(-50%, 10px);

                        &:after {
                            top: 100%;
                        }

                        &:before {
                            top: 100%;
                            bottom: unset;
                        }
                    }

                    &:hover .subitems {
                        transform: translate(-50%, -10px);
                    }
                }
            }

            .item-placeholder {
                display: flex;
                width: 44px;
                position: relative;
            }

            .separator {
                width: 0;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 1px;
                    height: 60%;
                    border-right: 1px solid #cbcbcb;
                }
            }
        }

        &.expended {
            .line.not-main {
                opacity: 1;
                max-width: 470px;

                .item {
                    opacity: 1;
                    transform: scale(1);
                }
                .separator {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        }
    }
}
</style>

<style>
.no-select {
    user-select: none;
}
</style>
