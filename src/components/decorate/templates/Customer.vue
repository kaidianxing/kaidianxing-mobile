/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
    <button class="customer isfixed"
            v-if='componentData&&componentData.id=="customer"'
            :class="[componentData.position, componentData.style.styleType]"
            :open-type="componentData.params.customer=='wx'?'contact':''"
            :style="{
                bottom:getBottom,
                margin:getMargin,
            }" @click.self="clickItem">
        <!-- 纯图 -->
        <div v-if="componentData.style.showType === '1'"
             :style='{width:px2rpx(componentData.style.width),height:px2rpx(componentData.style.width)}'>
            <img class="customer-only-img" mode='widthFix' lazy-load :src="getCustomerImg" alt="">
        </div>
        <!-- 图文 -->
        <div class="" v-else>
            <!-- 样式一 -->
            <div class="style-one" v-if="componentData.style.styleType === 'one'"
                 :style="{width:px2rpx(104),transform: `scale(${componentData.style.width/104})`}">
                <div class="icon-box" v-if="isShow" :style="{borderColor: componentData.style.bordercolor}">
                    <div class="border" :style="{borderColor: componentData.style.bordercolor}"></div>
                    <i v-if="componentData.params.customerType==='0'" :class='[componentData.params.iconclass]'
                       class='iconfont-icon'
                       :style="{color:componentData.style.iconcolor}"></i>
                    <img v-else class="customer-img" mode='widthFix' lazy-load
                         :src="$utils.mediaUrl(componentData.params.imgurl)" alt="">
                </div>
                <div class="title" :class="{'no-mt': !isShow}" :style="{backgroundColor:componentData.style.bgcolor}">
                    <span class="text"
                          :style="{color:componentData.style.titlecolor}">{{ componentData.params.titlename }}</span>
                </div>
            </div>

            <!-- 样式二 -->
            <div class="style-two" v-else-if="componentData.style.styleType === 'two'"
                 :style="{width:px2rpx(190),transform: `scale(${componentData.style.width/190})`}">
                <div class="bg-color" :class="positionClass"
                     :style="{backgroundColor: componentData.style.bgcolor, opacity: componentData.opacity}"></div>
                <div class="flex">
                    <div class="icon-box" v-if="isShow">
                        <i v-if="componentData.params.customerType==='0'"
                           :class='[componentData.params.iconclass]'
                           class='iconfont-icon'
                           :style="{color:componentData.style.iconcolor}"></i>
                        <img v-if="componentData.params.customerType==='1'&&componentData.params.imgurl"
                             class="customer-img" mode='widthFix' lazy-load
                             :src="$utils.mediaUrl(componentData.params.imgurl)" alt="">
                    </div>
                    <div class="title" :style="{color:componentData.style.titlecolor}">
                        {{ componentData.params.titlename }}
                    </div>
                </div>
            </div>

            <!-- 样式三 -->
            <div class="style-three" v-else-if="componentData.style.styleType === 'three'"
                 :style="{width:px2rpx(54),transform: `scale(${componentData.style.width/54})`}">
                <div class="bg-color" :class="positionClass"
                     :style="{backgroundColor: componentData.style.bgcolor, opacity: componentData.opacity}"></div>
                <div class="content">
                    <div class="icon-box" v-if="isShow">
                        <i v-if="componentData.params.customerType==='0'"
                           :class='[componentData.params.iconclass]'
                           class='iconfont-icon'
                           :style="{color:componentData.style.iconcolor}"></i>
                        <img v-if="componentData.params.customerType==='1'&&componentData.params.imgurl"
                             class="customer-img" mode='widthFix' lazy-load
                             :src="$utils.mediaUrl(componentData.params.imgurl)" alt="">
                    </div>
                    <div class="title" :style="{color:componentData.style.titlecolor}">
                        {{ componentData.params.titlename }}
                    </div>
                </div>
            </div>

        </div>
    </button>
</template>

<script>
import mixin from './mixin.js'

export default {
    mixins: [mixin],
    name: "Customer",
    components: {},
    props: {},
    data() {
        return {}
    },
    computed: {
        isShow() {
            return (this.componentData.params.customerType === '1' && this.componentData.params.imgurl) || this.componentData.params.customerType === '0'
        },
        getCustomerImg() {
            if (this.componentData.params.img) {
                return this.$utils.mediaUrl(this.componentData.params.img)
            } else {
                return this.$utils.staticMediaUrl('decorate/customer.png')
            }
        },
        getBottom() {
            if (!this.$isPC && this.componentData.position.indexOf('bottom') > -1) {
                return this.$store.state.areaBottom + 'px'
            } else {
                return 0
            }
        },
        getMargin() {
            if (!this.$isPC) {
                return `${this.px2rpx(this.componentData.style.offset_up_down * 1 + 110)} ${this.px2rpx(this.componentData.style.offset_left_right * 1)}`
            } else {
                return `${this.px2rpx(this.componentData.style.offset_up_down * 1 + 110)} ${this.px2rpx(this.componentData.style.offset_left_right * 1 + 30)}`
            }
        },
        positionClass() {
            if (+this.componentData.style.offset_left_right === 0) {
                return this.componentData.position.indexOf('left') > -1 ? 'left' : 'right'
            } else {
                return 'border'
            }
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        clickItem() {
            this.$emit('custom-event', {
                target: 'customer/clickItem',
                data: this.componentData
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import './decorate.scss';

.customer {
    /*height: 100%;*/
    height: fit-content;
    line-height: initial;
    background: none;
    border-radius: 0;
    overflow: hidden;

    &::after {
        border: 0;
    }

    position: absolute;

    &.top {
        top: 0;
    }

    &.left {
        left: 0;
    }

    &.right {
        right: 0;
    }

    .customer-only-img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .customer-img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .style-one {
        position: relative;

        .icon-box {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            width: px2rpx(46);
            height: px2rpx(46);
            background-color: #fff;
            border: px2rpx(2) solid transparent;
            border-radius: 50%;

            .border {
                position: absolute;
                left: px2rpx(-3);
                top: px2rpx(-3);
                width: px2rpx(48);
                height: px2rpx(48);
                background-color: transparent;
                border: px2rpx(2) solid transparent;
                opacity: 0.3;
                border-radius: 50%;
            }

            .iconfont-icon {
                font-size: px2rpx(30);
            }
        }

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-top: px2rpx(-8);
            width: 100%;
            height: px2rpx(18);
            line-height: px2rpx(18);
            text-align: center;
            border-radius: px2rpx(9);

            &.no-mt {
                margin-top: 0;
            }

            .text {
                display: inline-block;
                font-size: px2rpx(12);
                transform: scale(0.8);
            }
        }
    }

    .style-two {
        position: relative;
        height: px2rpx(24);

        .icon-box {
            width: px2rpx(20);
            height: px2rpx(20);
            margin-right: px2rpx(6);
            overflow: hidden;
        }

        .bg-color {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: px2rpx(24);

            &.left {
                border-top-right-radius: px2rpx(12);
                border-bottom-right-radius: px2rpx(12);
            }

            &.right {
                border-top-left-radius: px2rpx(12);
                border-bottom-left-radius: px2rpx(12);
            }

            &.border {
                border-radius: px2rpx(12);
            }
        }

        .flex {
            position: relative;
            width: 100%;
            height: px2rpx(24);
            justify-content: center;
            align-items: center;
        }

        .iconfont-icon {
            line-height: px2rpx(20);
            font-size: px2rpx(20);
        }

        .title {
            font-size: px2rpx(12);
        }
    }

    .style-three {
        position: relative;
        height: px2rpx(105);

        .icon-box {
            width: px2rpx(20);
            height: px2rpx(20);
            margin-bottom: px2rpx(7);
            overflow: hidden;
        }

        .bg-color {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: px2rpx(105);

            &.left {
                border-top-right-radius: px2rpx(12);
                border-bottom-right-radius: px2rpx(12);
            }

            &.right {
                border-top-left-radius: px2rpx(12);
                border-bottom-left-radius: px2rpx(12);
            }
        }

        .content {
            position: relative;
            width: 100%;
            padding: px2rpx(8) px2rpx(3) 0;
        }

        .iconfont-icon {
            margin-bottom: px2rpx(7);
            font-size: px2rpx(20);
        }

        .title {
            line-height: px2rpx(16);
            font-size: px2rpx(12);
        }
    }
}
</style>
