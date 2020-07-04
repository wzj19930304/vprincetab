<template>
    <div id="v-prince-tab">
        <div class="tabs">
            <transition name="el-fade-in-linear">
                <div v-show="tabsBtn.showLeft" class="left-btn" @click="changeTabsScroll(true)">
                    <slot name="left-btn">
                        <span></span>
                    </slot>
                </div>
            </transition>
            <div class="tabs-inner" @scroll="handleTabsScrollChange">
                <div v-for="(item, index) in tabsList" :key="index" :class="`tab ${item.chosen ? 'chosen' : ''}`" :style="{width: actualTabWidth, minWidth: actualTabWidth}" @click="handleClickCurrentTab(item, index)">
                    <slot name="tabs-inner">
                        <span class="text">{{item.name}}</span>
                    </slot>
                </div>
            </div>
            <transition name="el-fade-in-linear">
                <div v-show="tabsBtn.showRight" class="right-btn" @click="changeTabsScroll(false)">
                    <slot name="right-btn">
                        <span></span>
                    </slot>
                </div>
            </transition>
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

<style scoped>
    #v-prince-tab {
        display: flex;
        flex-direction: column;
    }
    #v-prince-tab .left-btn, #v-prince-tab .right-btn {
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 6px 6px 0px 0px;
        background-color: #E5E5EB;
        color: #57565B;
        padding: 0 12px;
        margin-right: 4px;
        height: 34px;
        transition: all 0.25s;
    }
    #v-prince-tab .left-btn:hover, #v-prince-tab .right-btn:hover {
        background-color: #fff;
    }
    #v-prince-tab .left-btn span, #v-prince-tab .right-btn span {
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 10px solid #57565B;
    }
    #v-prince-tab .right-btn {
        margin-left: 4px;
        margin-right: 0;
    }
    #v-prince-tab .right-btn span {
        transform: rotateZ(180deg);
    }
    #v-prince-tab .tabs {
        display: flex;
        align-items: center;
        margin-top: 16px;
    }
    #v-prince-tab .tabs .tabs-inner {
        display: flex;
        /*min-width: 148px;*/
        overflow: hidden;
        scroll-behavior: smooth;
    }
    #v-prince-tab .tabs .tab {
        position: relative;
        box-sizing: border-box;
        padding: 9px 12px 9px 12px;
        max-width: 148px;
        min-width: 50px;
        text-align: center;
        background-color: #E5E5EB;
        color: #57565B;
        font-size: 14px;
        margin-right: 4px;
        cursor: pointer;
        user-select: none;
        border-radius: 6px 6px 0 0;
        overflow: hidden;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s;
    }
    #v-prince-tab .tabs .tab::before {
        content: "";
        width: 20px;
        height: 20px;
        display: inline-block;
        background-color: #783EFA;
        position: absolute;
        top: -10px;
        left: -10px;
        transform: rotateZ(45deg);
        opacity: 0;
        transition: all 0.25s;
    }
    #v-prince-tab .tabs .tab:last-of-type {
        margin-right: 0;
    }
    #v-prince-tab .tabs .tab.chosen {
        background-color: #fff;
        color: #783EFA;
    }
    #v-prince-tab .tabs .tab.chosen::before {
        opacity: 1;
    }
    #v-prince-tab .tabs .tab:hover {
        background-color: #fff;
    }
    #v-prince-tab .tabs .tab.btn-wrap {
        overflow: visible;
        position: relative;
        min-width: 148px;
        margin-right: 0;
        margin-left: 4px;
    }
    #v-prince-tab .tabs .tab.btn-wrap:focus {
        outline: none;
        border: none;
    }
    #v-prince-tab .tabs .tab.btn-wrap::before {
        display: none;
    }
    #v-prince-tab .tabs .tab.btn-wrap span {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #v-prince-tab .tabs .tab.btn-wrap span i {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: -19px;
        color: #783EFA;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #v-prince-tab .tabs .tab.btn-wrap span span {
        color: #783EFA;
    }
    #v-prince-tab .tabs .tab.btn-wrap .transition-box {
        z-index: 11;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 40px;
        padding: 6px 0;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 0 4px 0 rgba(0, 0, 0, 0.02);
        border-radius: 2px;
        width: 100%;
    }
    #v-prince-tab .tabs .tab.btn-wrap .transition-box li {
        cursor: pointer;
        padding: 5px 24px 5px 12px;
        color: #57565B;
        text-align: left;
        transition: all 0.25s;
    }
    #v-prince-tab .tabs .tab.btn-wrap .transition-box li:hover {
        color: #783EFA;
        background-color: #F2F0FE;
    }
    #v-prince-tab .tabs .tab .text {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #v-prince-tab .tabs .tab .new, #v-prince-tab .tabs .tab .current-active {
        margin-left: 8px;
        padding: 0 4px;
        color: #fff;
        font-size: 12px;
        background-color: #41BF1C;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #v-prince-tab .tabs .tab .current-active {
        background-color: #783EFA;
    }
    .el-zoom-in-top-enter-active,.el-zoom-in-top-leave-active{opacity:1;-webkit-transform:scaleY(1);transform:scaleY(1);-webkit-transition:opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.23,1,.32,1);transition:transform .3s cubic-bezier(.23,1,.32,1),opacity .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);-webkit-transform-origin:center top;transform-origin:center top}.el-zoom-in-top-enter,.el-zoom-in-top-leave-active{opacity:0;-webkit-transform:scaleY(0);transform:scaleY(0)}
    .el-fade-in-linear-enter,.el-fade-in-linear-leave,.el-fade-in-linear-leave-active,.fade-in-linear-enter,.fade-in-linear-leave,.fade-in-linear-leave-active{opacity:0}.fade-in-linear-enter-active,.fade-in-linear-leave-active{-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{-webkit-transition:opacity .2s linear;transition:opacity .2s linear}
</style>
<style>
    html,body,ul,li,ol,button,div,span{
        margin: 0;
        padding: 0;
        list-style: none;
        outline: none;
    }
</style>
