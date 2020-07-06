<template>
    <div id="v-prince-tab">
        <div class="tabs">
            <div v-if="tabsBtn.showLeft" class="left-btn" @click="changeTabsScroll(true)">
                <slot name="left-btn">
                    <span></span>
                </slot>
            </div>
            <div class="tabs-inner" @scroll="handleTabsScrollChange">
                <div v-for="(item, index) in tabsList" :key="index" :class="`tab ${item.chosen ? 'chosen' : ''}`" :style="{width: actualTabWidth, minWidth: actualTabWidth}" @click="handleClickCurrentTab(item, index)">
                    <slot name="tabs-inner">
                        <span class="text">{{item.name}}</span>
                    </slot>
                </div>
            </div>
            <div v-if="tabsBtn.showRight" class="right-btn" @click="changeTabsScroll(false)">
                <slot name="right-btn">
                    <span></span>
                </slot>
            </div>
            <div v-if="!customAddBtn" @click="addItem">
                <slot name="customAddBtn"></slot>
            </div>
            <div v-else :class="`tab btn-wrap ${show ? 'chosen' : ''}`" @click.stop="show = !show">
                <slot name="customAddBtn">
                    <span>
                         {{btnLabel}}
                    </span>
                </slot>
                <slot name="add-menu">
                    <transition name="el-zoom-in-top">
                        <ul class="transition-box" v-show="show">
                            <li @click.stop="addItem">{{btnChildrenLabel}}</li>
                        </ul>
                    </transition>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "vPrinceTab",
        data() {
            return{
                currentTabContent: {},
                show: false,
                tabsBtn: { // tab左右按钮展示情况
                    showLeft: false,
                    showRight: false,
                    targetDom: null,
                    targetRect: null,
                    width: 0 //scrollLeft+width
                }
            }
        },
        props: {
            btnLabel: {
                type: String,
                default: '添加'
            },
            btnChildrenLabel: {
                type: String,
                default: '添加信息'
            },
            tabsList: {
                type: Array,
                default: () => []
            },
            // 默认点开的tab
            tabId: {
                type: String,
                default: ''
            },
            // 是否自定义添加按钮
            customAddBtn: {
                type: Boolean,
                default: false
            },
            // tab的宽度(最小50)
            tabWidth: {
                type: String,
                default: "148px"
            }
        },
        watch: {
            tabId(v) {
                this.defaultSelect(v)
            }
        },
        computed: {
            actualTabWidth: {
                get() {
                    if(parseInt(this.tabWidth) < 50) {
                        return "50px"
                    }
                    return this.tabWidth
                },
                set() {}
            },
            actualTabWidthNumber: {
                set() {},
                get() {
                    return parseInt(this.actualTabWidth)
                }
            }
        },
        mounted() {
            this.formatTabs();
            window.addEventListener('resize', this.formatTabs)
        },
        methods: {
            // 点击当前tab
            handleClickCurrentTab(item, index) {
                this.currentTabContent = item;
                this.tabsList.forEach((v, i) => {
                    v.chosen = i === index;
                    this.$set(this.tabsList, index, item)
                });
                // 计算当前点击的tab的位置
                this.$nextTick(() => {
                    let targetDom = this.$el.querySelector('.tabs-inner');
                    let targetRect = targetDom.getBoundingClientRect();
                    // 4为当前tab的margin
                    // 选中的tab被右侧遮挡
                    if((index+1) * (this.actualTabWidthNumber + 4) > targetRect.width + targetDom.scrollLeft) {
                        this.tabsBtn.width = (index+1) * this.actualTabWidthNumber + 4;
                        // 根据向左按钮判断滚动条滚动距离（若当时没有，在滚动时出现，会有48px偏差）
                        if(this.tabsBtn.showLeft) {
                            targetDom.scrollLeft = (index+1) * this.actualTabWidthNumber + 4 - targetRect.width
                        } else {
                            targetDom.scrollLeft = (index+1) * this.actualTabWidthNumber + 4 - targetRect.width + 38
                        }
                    }
                    // 选中的tab被左侧遮挡
                    if(index * (this.actualTabWidthNumber + 4) < targetDom.scrollLeft) {
                        this.tabsBtn.width = 0;
                        targetDom.scrollLeft = index * (this.actualTabWidthNumber + 4)
                    }
                });
                this.$emit('handleClickCurrentTab', item, index);
            },
            // 点击两边的按钮
            changeTabsScroll(isLeft) {
                this.currentIndex = -1;
                // tabs的wrap层
                let targetDom = this.$el.querySelector('.tabs-inner');
                // tabs的wrap层的信息
                let targetRect = targetDom.getBoundingClientRect();
                if(isLeft) {
                    targetDom.scrollLeft -= targetRect.width;
                    this.tabsBtn.width = 0;
                } else {
                    this.tabsBtn.width = targetDom.scrollLeft + 2*targetRect.width;
                    targetDom.scrollLeft += targetRect.width;
                }
            },
            // tabs wrap 滚动条横向滚动事件
            handleTabsScrollChange() {
                // this.$nextTick(() => {
                // tabs的wrap层
                let targetDom =  this.$el.querySelector('.tabs-inner');
                // tabs的wrap层的信息
                let targetRect = targetDom.getBoundingClientRect();
                this.tabsBtn.showRight = (targetDom.scrollLeft + targetRect.width) !== targetDom.scrollWidth && this.currentIndex !== this.tabsList.length - 1;
                this.tabsBtn.showLeft = targetDom.scrollLeft !== 0;
                if(this.tabsBtn.width > targetDom.scrollWidth) {
                    this.tabsBtn.showRight = false
                }
            },
            // 计算tabs的宽度
            // 出要在初始化时调用该方法
            formatTabs() {
                // tabs的wrap层
                this.$nextTick(() => {
                    let targetDom = this.$el.querySelector('.tabs-inner');
                    // this.tabsBtn.showLeft = targetDom.scrollLeft !== 0;
                    this.tabsBtn.showRight = targetDom.scrollLeft + targetDom.getBoundingClientRect().width < targetDom.scrollWidth
                })
            },
            // 默认展示项
            defaultSelect(tabId) {
                if(tabId) {
                    let flag = false;
                    this.tabsList.forEach((item, index) => {
                        if(item.id === tabId) {
                            flag = true;
                            this.handleClickCurrentTab(item, index);
                        }
                    });
                    if(flag) {
                        this.handleClickCurrentTab(this.tabsList[0], 0)
                    }
                } else {
                    if(this.tabsList[0]) {
                        this.handleClickCurrentTab(this.tabsList[0], 0)
                    }
                }
            },
            // 添加项
            addItem() {
                // if(this.customAddBtn) return;
                this.show = false;
                let len = this.tabsList.length;
                this.tabsList.forEach(item => {
                    item.chosen = false
                });
                this.$emit('addItem');
            }
        },
        destroyed() {
            window.removeEventListener('resize', this.formatTabs)
        }
    }
</script>

<style lang="scss" scoped>
    $themeColor: #783EFA;
    $pColor: #57565B;
    $tabBg: #E5E5EB;
    // flex column
    @mixin flex-column{
        display: flex;
        flex-direction: column;
    }
    // flex align center
    @mixin flex-align-center {
        display: flex;
        align-items: center;
    }

    // borderBox with padding
    @mixin borderBox($top, $right: $top, $bottom: $top, $left: $right){
        box-sizing: border-box;
        padding: $top $right $bottom $left;
    }

    // common transition
    @mixin transition($time: 0.25s){
        transition: all $time;
    }

    // flex center
    @mixin flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /*单行文本溢出*/
    @mixin single-line {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #v-prince-tab{
        @include flex-column;
        .left-btn,.right-btn{
            cursor: pointer;
            @include flex-align-center;
            border-radius:6px 6px 0px 0px;
            background-color: $tabBg;
            color: $pColor;
            padding: 0 12px;
            margin-right: 4px;
            height: 34px;
            @include transition();
            &:hover{
                background-color: #fff;
            }
            span{
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                border-right: 10px solid $pColor;
            }
        }
        .right-btn{
            margin-left: 4px;
            margin-right: 0;
            span{
                transform: rotateZ(180deg);
            }
        }
        .tabs{
            @include flex-align-center;
            margin-top: 16px;
            .tabs-inner{
                display: flex;
                /*min-width: 148px;*/
                overflow: hidden;
                scroll-behavior: smooth;
            }
            .tab{
                position: relative;
                @include borderBox(9px, 12px);
                max-width: 148px;
                min-width: 50px;
                text-align: center;
                background-color: $tabBg;
                color: $pColor;
                font-size: 14px;
                margin-right: 4px;
                cursor: pointer;
                user-select: none;
                border-radius:6px 6px 0 0;
                overflow: hidden;
                @include single-line;
                @include flex-center;
                @include transition;
                &::before{
                    content: '';
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    background-color: $themeColor;
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    transform: rotateZ(45deg);
                    opacity: 0;
                    @include transition;
                }
                &:last-of-type{
                    margin-right: 0;
                }
                &.chosen{
                    background-color: #fff;
                    color: $themeColor;
                    &::before{
                        opacity: 1;
                    }
                }
                &:hover{
                    background-color: #fff;
                }
                &.btn-wrap{
                    overflow: visible;
                    position: relative;
                    min-width: 148px;
                    margin-right: 0;
                    margin-left: 4px;
                    &:focus{
                        outline: none;
                        border: none;
                    }
                    &::before{
                        display: none;
                    }
                    span{
                        position: relative;
                        @include flex-center;
                        i{
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            left: -19px;
                            color: $themeColor;
                            @include flex-center;
                        }
                        span{
                            color: $themeColor;
                        }
                    }
                    .transition-box{
                        z-index: 11;
                        background-color: #fff;
                        position: absolute;
                        left: 0;
                        top: 40px;
                        padding: 6px 0;
                        box-shadow:0 0 8px 0 rgba(0,0,0,0.08),0 0 4px 0 rgba(0,0,0,0.02);
                        border-radius:2px;
                        width: 100%;
                        li{
                            cursor: pointer;
                            padding: 5px 24px 5px 12px;
                            color: $pColor;
                            text-align: left;
                            @include transition();
                            &:hover{
                                color: $themeColor;
                                background-color: #F2F0FE;
                            }
                        }
                    }
                }
                .text{
                    display: inline-block;
                    width: 100%;
                    @include single-line;
                }
                .new,.current-active{
                    margin-left: 8px;
                    padding: 0 4px;color: #fff;
                    font-size: 12px;
                    background-color: #41BF1C;
                    border-radius: 3px;
                    @include flex-center;
                }
                .current-active{
                    background-color: $themeColor;
                }
            }
        }
    }
    .el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transition:opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);-webkit-transform-origin:center top;transform-origin:center top}.el-zoom-in-top-enter,.el-zoom-in-top-leave-active{opacity:0;-webkit-transform:scaleY(0);transform:scaleY(0)}
</style>
<style>
    html,body,ul,li,ol,button,div,span{
        margin: 0;
        padding: 0;
        list-style: none;
        outline: none;
    }
</style>
