<template>
    <div class="ww-text-bar" :class="{'show': show}" :style="position" @click="focus()">
        <div class="handle" @mousedown="startDrag($event)">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="content">
            <div class="line">
                <div class="item separator">
                    <span :class="getTagClasses()"></span>

                    <div class="subitems">
                        <div class="item" @click="action('prop:tag:h1')">
                            <span class="wwi wwi-tag-h1"></span>
                        </div>
                        <div class="item" @click="action('prop:tag:h2')">
                            <span class="wwi wwi-tag-h2"></span>
                        </div>
                        <div class="item" @click="action('prop:tag:h3')">
                            <span class="wwi wwi-tag-h3"></span>
                        </div>
                        <div class="item" @click="action('prop:tag:h4')">
                            <span class="wwi wwi-tag-h4"></span>
                        </div>
                        <div class="item" @click="action('prop:tag:div')">
                            <span class="fa fa-paragraph"></span>
                        </div>
                    </div>
                </div>

                <div class="item" @click="action('exec:bold')">
                    <span class="wwi wwi-bold"></span>
                </div>
                <div class="item" @click="action('exec:italic')">
                    <span class="wwi wwi-italic"></span>
                </div>
                <div class="item" @click="action('exec:underline')">
                    <span class="wwi wwi-underline"></span>
                </div>
                <div class="item separator" @click="action('exec:strikeThrough')">
                    <span class="fa fa-strikethrough"></span>
                </div>
                <div class="item">
                    <span class="wwi wwi-font-size"></span>

                    <div class="subitems">
                        <div class="item xsmall" @click="action('style:size:xsmall')">
                            <span class="wwi wwi-font-size"></span>
                        </div>
                        <div class="item small" @click="action('style:size:small')">
                            <span class="wwi wwi-font-size"></span>
                        </div>
                        <div class="item medium" @click="action('style:size:medium')">
                            <span class="wwi wwi-font-size"></span>
                        </div>
                        <div class="item big" @click="action('style:size:big')">
                            <span class="wwi wwi-font-size"></span>
                        </div>
                        <div class="item xbig" @click="action('style:size:xbig')">
                            <span class="wwi wwi-font-size"></span>
                        </div>
                        <div class="item input">
                            <input type="text" v-model="customSize" @click="$event.stopPropagation()" @keydown="checkEnterSize($event)">
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="wwi wwi-align-left"></span>

                    <div class="subitems">
                        <div class="item" @click="action('style:align:justify')">
                            <span class="wwi wwi-justify"></span>
                        </div>
                        <div class="item" @click="action('style:align:right')">
                            <span class="wwi wwi-align-right"></span>
                        </div>
                        <div class="item" @click="action('style:align:center')">
                            <span class="wwi wwi-center"></span>
                        </div>
                        <div class="item" @click="action('style:align:left')">
                            <span class="wwi wwi-align-left"></span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="wwi wwi-font"></span>

                    <div class="subitems">
                        <div class="item font" @click="action('style:font:Arial, Helvetica, sans-serif')" style="font-family:Arial, Helvetica, sans-serif">Arial</div>
                        <div class="item font" @click="action('style:font:Courier New, Courier, monospace')" style="font-family:Courier New, Courier, monospace">Courier New</div>
                        <div class="item font" @click="action('style:font:Impact, Charcoal, sans-serif')" style="font-family:Impact, Charcoal, sans-serif">Impact</div>
                        <div class="item font" @click="action('style:font:Times New Roman, Times, serif')" style="font-family:Times New Roman, Times, serif">Times New Roman</div>
                        <div class="item font" @click="action('style:font:Trebuchet MS, Helvetica, sans-serif')" style="font-family:Trebuchet MS, Helvetica, sans-serif">Trebuchet MS</div>
                        <div class="item font" @click="action('style:font:' + getDefaultFont().split(',')[0])" :style="{'font-family':getDefaultFont().split(',')[0]}">- Default -
                            <br>
                            {{ getDefaultFont().split(',')[0] }}
                        </div>
                        <div class="item font" @click="action('style:font:more')">
                            <i>More...</i>
                        </div>
                    </div>
                </div>
                <div class="item separator">
                    <span class="wwi wwi-color"></span>

                    <div class="subitems">
                        <div class="item colors">
                            <div style="background-color:white" @click="action('style:color:white')"></div>
                            <div style="background-color:#808080" @click="action('style:color:#808080')"></div>
                            <div style="background-color:#404040" @click="action('style:color:#404040')"></div>
                            <div style="background-color:black" @click="action('style:color:black')"></div>
                        </div>
                        <div class="item colors">
                            <div style="background-color:#FF0000" @click="action('style:color:#FF0000')"></div>
                            <div style="background-color:#FF6600" @click="action('style:color:#FF6600')"></div>
                            <div style="background-color:#FFFF00" @click="action('style:color:#FFFF00')"></div>
                            <div style="background-color:#8CC700" @click="action('style:color:#8CC700')"></div>
                        </div>
                        <div class="item colors">
                            <div style="background-color:#0FAD00" @click="action('style:color:#0FAD00')"></div>
                            <div style="background-color:#00A3C7" @click="action('style:color:#00A3C7')"></div>
                            <div style="background-color:#0010A5" @click="action('style:color:#0010A5')"></div>
                            <div style="background-color:#C5007C" @click="action('style:color:#C5007C')"></div>
                        </div>

                        <div class="item font" @click="action('style:color:more')">
                            <i>More...</i>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <span class="wwi wwi-separator"></span>

                    <div class="subitems">
                        <div class="item xsmall" @click="action('insert:hr:small')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                        <div class="item medium" @click="action('insert:hr:medium')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                        <div class="item xbig" @click="action('insert:hr:big')">
                            <span class="wwi wwi-separator"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line">
                <div class="item separator" @click="action('link')">
                    <span class="wwi wwi-link-external"></span>
                </div>
                <div class="item-placeholder separator"></div>

                <div class="item" @click="action('exec:insertOrderedList')">
                    <span class="fa fa-list-ol"></span>
                </div>
                <div class="item separator" @click="action('exec:insertUnorderedList')">
                    <span class="fa fa-list-ul"></span>
                </div>
                <div class="item" @click="action('exec:indent')">
                    <span class="fa fa-indent"></span>
                </div>
                <div class="item separator" @click="action('exec:outdent')">
                    <span class="fa fa-outdent"></span>
                </div>

                <!--
                <div class="item" @click="action('clear')">
                    <span class="fa fa-eraser"></span>
                </div>
                -->
                <div class="item-placeholder separator"></div>
                <div class="item separator" @click="action('add')">
                    <span class="wwi wwi-add"></span>
                </div>

                <!-- <div class="item orange" :class="{'separator':!c_isInLayout}" @click="action('reset')">R</div> -->
                <!-- <div v-if="c_isInLayout" class="item separator red" @click="action('delete')">
                    <span class="wwi wwi-delete"></span>
                </div>-->
                <!-- 
                <div v-if="!c_isInLayout" class="item-placeholder"></div>
                <div class="item blue" @click="action('margins')">
                    <span class="wwi wwi-edit-margin"></span>
                </div>
                <div class="item green" @click="action('other')">
                    <span class="wwi wwi-edit-other"></span>
                </div>
                -->
            </div>
        </div>
    </div>
</template>


<script>
import Vue from 'vue'


export default {
    name: 'wwTextBar',
    props: {
        options: Object
    },
    data() {
        return {
            show: false,
            minDragDist: 0,
            dragging: false,
            dragStartPoint: { x: 0, y: 0 },
            dragStartPosition: { x: 0, y: 0 },
            position: {
                top: 0,
                left: 0
            },
            moved: false,
            customSize: 1.5,
            defaultFont: '',
        };
    },
    computed: {
        c_isInLayout() {
            return wwLib.wwUtils.getParentLayout(this.options.context.$el.parentElement);
        },
    },
    watch: {
    },
    methods: {

        focus() {
            this.options.context.$el.focus();
            this.options.context.reselect();
        },

        action(action) {
            this.options.context.wwTextBarAction(action);
        },

        checkEnterSize(event) {
            if (event.keyCode == 13) {
                this.options.context.wwTextBarAction('style:size:' + this.customSize);
            }
        },

        getTagClasses() {
            switch (this.options.context.wwObject.content.data.tag) {
                case 'h1':
                    return ['wwi', 'wwi-tag-h1'];
                    break;
                case 'h2':
                    return ['wwi', 'wwi-tag-h2'];
                    break;
                case 'h3':
                    return ['wwi', 'wwi-tag-h3'];
                    break;
                case 'h4':
                    return ['wwi', 'wwi-tag-h4'];
                    break;
                case 'div':
                    return ['fa', 'fa-paragraph'];
                    break;
            }
        },

        getDefaultFont() {
            switch (this.options.context.wwObject.content.data.font) {
                case 'Raleway Light':
                    return 'Raleway';
                    break;
                default:
                    let font = this.options.context.wwObject.content.data.font || '';
                    return font.split(',')[0];
                    break;
            }
            return;
        },

        /*=============================================m_ÔÔ_m=============================================\
          DRAG TEXT BAR
        \================================================================================================*/

        getOrignialPosition() {
            let width = this.$el.getBoundingClientRect().width;
            let height = this.$el.getBoundingClientRect().height;

            const w = wwLib.getFrontWindow();
            const d = wwLib.getFrontDocument();

            //const scrollX = (w.pageXOffset || d.documentElement.scrollLeft) - (d.documentElement.clientLeft || 0);
            //const scrollY = (w.pageYOffset || d.documentElement.scrollTop) - (d.documentElement.clientTop || 0);

            let top = this.options.context.$el.getBoundingClientRect().y //+ scrollY;
            let left = this.options.context.$el.getBoundingClientRect().x// + scrollX;

            const innerWidth = (w.innerWidth || d.documentElement.clientWidth || d.getElementsByTagName('body')[0].clientWidth) - 40

            if (left + width > innerWidth) {
                left -= ((left + width) - innerWidth);
            }

            return {
                top: top,
                left: left
            }
        },

        getCurrentPosition() {

            if (this.position.left && this.position.top) {
                return {
                    top: parseInt(this.position.top),
                    left: parseInt(this.position.left)
                }
            }

            return {
                top: 0,
                left: 0
            }
        },

        preventClick(event) {
            event.preventDefault();
            event.stopPropagation();

            return false;
        },
        getEventPosition(event) {
            var position = { x: 0, y: 0 };

            position.x = event.clientX;
            position.y = event.clientY;


            return position;
        },
        isDragging(event) {
            if (this.dragging) {
                return true;
            }

            let currentDragPoint = this.getEventPosition(event);

            let dist = Math.pow(currentDragPoint.x - this.dragStartPoint.x, 2) + Math.pow(currentDragPoint.y - this.dragStartPoint.y, 2);

            if (dist > Math.pow(this.minDragDist, 2)) {
                this.dragging = true;
                wwLib.getManagerWindow().addEventListener('click', this.preventClick, true);
                wwLib.getFrontWindow().addEventListener('click', this.preventClick, true);
                return true;
            }

            return false;
        },
        updatePosition() {
            if (this.moved) {
                return;
            }

            const iframePos = wwLib.getManagerDocument().querySelector('.iframe').getBoundingClientRect();

            this.position = {
                top: this.getOrignialPosition().top + iframePos.top + 'px',
                left: this.getOrignialPosition().left + iframePos.left + 'px'
            }

            requestAnimationFrame(this.updatePosition);
        },

        startDrag(event) {
            this.dragStartPoint = this.getEventPosition(event);
            this.dragStartPosition = this.getCurrentPosition();

            wwLib.getManagerWindow().addEventListener('mousemove', this.drag);
            wwLib.getManagerWindow().addEventListener('mouseup', this.stopDrag);

            wwLib.getFrontWindow().addEventListener('mousemove', this.drag);
            wwLib.getFrontWindow().addEventListener('mouseup', this.stopDrag);
        },
        drag(event) {
            if (this.isDragging(event)) {
                this.moved = true;
                document.body.classList.add('no-select');

                let currentDragPoint = this.getEventPosition(event);

                this.position.left = (currentDragPoint.x - this.dragStartPoint.x + this.dragStartPosition.left) + 'px';
                this.position.top = (currentDragPoint.y - this.dragStartPoint.y + this.dragStartPosition.top) + 'px';
            }
        },
        stopDrag(event) {
            this.dragging = false;

            document.body.classList.remove('no-select');
            wwLib.getManagerWindow().removeEventListener('mousemove', this.drag);
            wwLib.getManagerWindow().removeEventListener('mouseup', this.stopDrag);
            wwLib.getManagerWindow().removeEventListener('click', this.preventClick, true);

            wwLib.getFrontWindow().removeEventListener('mousemove', this.drag);
            wwLib.getFrontWindow().removeEventListener('mouseup', this.stopDrag);
            wwLib.getFrontWindow().removeEventListener('click', this.preventClick, true);
        }

    },
    created: function () {

    },
    mounted: function () {

        this.updatePosition();

        this.$nextTick(function () {
            this.show = true;
        })

    },
    beforeDestroy() {
        wwLib.getManagerWindow().removeEventListener('mousemove', this.drag);
        wwLib.getManagerWindow().removeEventListener('mouseup', this.stopDrag);
        wwLib.getManagerWindow().removeEventListener('click', this.preventClick, true);

        wwLib.getFrontWindow().removeEventListener('mousemove', this.drag);
        wwLib.getFrontWindow().removeEventListener('mouseup', this.stopDrag);
        wwLib.getFrontWindow().removeEventListener('click', this.preventClick, true);
    }
};
</script>

<style scoped lang="scss">
$ww-red: #e02a4d;
$ww-green: #49b9b3;
$ww-orange: #ef811a;
$ww-blue: #2e85c2;

.ww-text-bar {
    position: absolute;
    z-index: 50;
    top: 0;
    left: 0;
    opacity: 1;
    transform: translateY(-110%);
    background-color: #fafafa;
    display: flex;
    border-radius: 6px;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.35, 0.07, 0.35, 1.65),
        opacity 0.2s ease;

    &.show {
        // opacity: 1;
        // transform: translateY(-110%);
    }

    .handle {
        display: flex;
        justify-content: center;
        width: 30px;
        color: black;
        position: relative;
        cursor: grab;
        cursor: move;
        flex-direction: column;
        margin: 30px 0;

        div {
            flex-basis: 33.33%;
            position: relative;

            &::after,
            &::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4px;
                height: 4px;
                border-radius: 100%;
                background-color: #bdbdbd;
            }

            &::after {
                transform: translate(-5px, -50%);
            }

            &::before {
                transform: translate(5px, -50%);
            }
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .line {
            display: flex;
            flex-direction: row;

            .item {
                display: flex;
                justify-content: center;
                padding: 10px;
                font-size: 24px;
                color: black;
                position: relative;
                transition: background-color 0.3s ease, color 0.3s ease;
                min-width: 44px;
                cursor: pointer;

                &.separator::after {
                    content: "";
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 1px;
                    height: 60%;
                    border-right: 1px solid #cbcbcb;
                }

                &:hover {
                    background-color: #e4e4e4;
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

                &.colors {
                    display: flex;
                    flex-direction: row;
                    padding: 5px 5px 0 5px !important;

                    div {
                        border: 1px solid #a3a3a3;
                        width: 20px;
                        height: 20px;
                        margin: 3px;
                        cursor: pointer;
                        border-radius: 3px;
                    }

                    &:hover {
                        background-color: transparent;
                    }
                }

                input {
                    width: 100%;
                }

                .subitems {
                    position: absolute;
                    pointer-events: none;
                    opacity: 0;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -90%);
                    border-radius: 6px;
                    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
                    background-color: #fafafa;
                    transition: transform 0.2s
                            cubic-bezier(0.35, 0.07, 0.35, 1.65),
                        opacity 0.2s ease;
                    z-index: 1;
                }

                &:hover .subitems {
                    pointer-events: all;
                    opacity: 1;
                    transform: translate(-50%, -100%);
                }
            }

            .item-placeholder {
                display: flex;
                width: 44px;
                position: relative;

                &.separator::after {
                    content: "";
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
    }
}
</style>

<style>
.no-select {
    user-select: none;
}
</style>