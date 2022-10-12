/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="topmenu" >
        <div class="radius-box" :class='$isPC?"":"isNotPC"'>
            <ul class='menu-list' :style='{background:background}' >
                <li class='menu-item'
                    :style='{
                        color:activeIndex==index?componentData.style.activecolor:componentData.style.textcolor,
                        background:background}'
                    :data-key='index'
                    :class='{active:activeIndex==index}'
                    v-for='(item,index) in componentData.data'
                    :key='index'
                    @click='clickItem(item,index)' >
                    <span class='_span'>{{item.title}}<i class='after' :style="{background:activeIndex==index?componentData.style.activecolor:componentData.style.color}"></i></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        componentData: {
            type: Object,
            default: () => {}
        },
        background: {
            type: String,
            default: "#fff"
        }
    },
    data() {
        return {
            activeIndex: this.componentData.params.current || 0,
            clicking: false
        }
    },
    watch: {
        "componentData": {
            handler() {
                if(this.activeIndex != this.componentData.params.current){
                    this.activeIndex = this.componentData.params.current
                }
                console.log(1)
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        clickItem(item, index) {
            if(!this.$isPC && this.activeIndex != index && !this.$store.state.decorate.indexPage.pageListGetting) {
                if(this.$store.state.decorate.pageQuery.previewId) {//预览状态
                    this.$toast('预览模式')
                    this.activeIndex = index
                }
            }
            this.$emit('custom-event', {
                target: 'topmenu/clickItem',
                data: {
                    value: item,
                    key: index,
                    data: this.componentData
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/components/decorate/templates/decorate.scss";
.topmenu {
    .radius-box {
        overflow-x: auto;
        overflow-y:hidden;
    }
    .isNotPC::-webkit-scrollbar {
        display: none;
    }
    .menu-list {
        overflow-x: auto;
        display: flex;
        flex-wrap: nowrap;
        align-self: center;
        background: transparent;
        position: relative;
        white-space: nowrap;
        width: px2rpx(375);
        line-height: px2rpx(40);
        justify-content:center;
        width: fit-content;
        min-width: 100%;
        .menu-item {
            color: #666666;
            font-size: px2rpx(14);
            height: px2rpx(40);
            padding: 0 px2rpx(16);
            min-width: px2rpx(75);
            flex-shrink: 0;
            flex-grow: 0;
            line-height: px2rpx(40);
            box-sizing: border-box;
            border: 0;
            // border-bottom: rpx(6) solid transparent;
            border-radius: 0;
            text-align: center;
            position: relative;
            cursor: pointer;
            flex-shrink: 0;
            &.active {
                color: #ef4f4f;
                font-weight: bold;
                ._span {
                    display: inline-block;
                    position: relative;
                    .after {
                        position: absolute;
                        left: 50%;
                        bottom: 0;
                        transform: translate(-50%, 0);
                        width: px2rpx(28);
                        height: px2rpx(2);
                        background: #ef4f4f;
                    }
                }
            }
        }
    }
}
</style>