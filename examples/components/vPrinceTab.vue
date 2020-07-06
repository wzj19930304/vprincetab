<template>
  <div class="content">
    <prince-tab
            btnLabel="add"
            :tabsList="tabsList"
            :customAddBtn="true"
            :tabId="tabId"
            :tabWidth="'160px'"
            @handleClickCurrentTab="handleClickCurrentTab"
            @addItem="addItem"
    >
    </prince-tab>
    <div class="cur">
      {{currentTabContent.name}}
      {{currentTabContent}}
    </div>
  </div>
</template>

<script>
  import PrinceTab from "../../packages/tab/tab"
  export default {
    name: "vPrinceTab",
    data() {
      return{
        tabsList: [
          {
            name: '选项1',
            id: '1'
          }
        ],
        tabId: '',
        currentTabContent: {}
      }
    },
    components: {
      PrinceTab
    },
    methods: {
      handleClickCurrentTab(item, index) {
          this.currentTabContent = item
      },
      addItem() {
        this.tabsList.push({
          name: '选项'+(+this.tabsList.length+1),
          id: this.tabsList.length+1 + ''
        });
        this.tabId = this.tabsList.length + '';
      }
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
    .el-fade-in-linear-enter,.el-fade-in-linear-leave,.el-fade-in-linear-leave-active,.fade-in-linear-enter,.fade-in-linear-leave,.fade-in-linear-leave-active{opacity:0}.fade-in-linear-enter-active,.fade-in-linear-leave-active{-webkit-transition:opacity .2s linear;transition:opacity .2s linear}.el-fade-in-linear-enter-active,.el-fade-in-linear-leave-active{-webkit-transition:opacity .2s linear;transition:opacity .2s linear}
</style>
