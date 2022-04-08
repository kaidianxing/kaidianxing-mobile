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
    <ul class="list-item">
        <li
            class="item"
            :class="{newBalance: params == 'balance'}"
            v-for="(item, index) in list"
            :key="index"
            @click="clickItem(index)"
        >
            <!-- 余额明细页面 -->
            <div class="liMain" v-if="params == 'balance'">
                <div class="titOrder" v-if="item.order_no" @click="goOrder(item)">
                    订单编号：{{ item.order_no }}
                    <i class="iconfont-m- icon-m-right"></i>
                </div>
                <div class="main flex-nowrap">
                    <div class="label">
                        <i
                            :class="item.icon"
                            class="record-icon"
                            v-if="type == 'record'"
                        ></i>
                        <img
                            lazy-load
                            mode="widthFix"
                            class="record-img"
                            :src="item.img"
                            alt=""
                            v-else
                        />
                    </div>
                    <div
                        class="body flex-nowrap"
                        :style="
                        type == 'record' && active[index]
                            ? 'border-bottom: 1rpx solid #E6E7EB;'
                            : ''
                    "
                    >
                        <div class="tilteBox">
                            <p class="title title-style flex-nowrap">
                                <span>{{ item.title }}</span>
                                <span
                                    class="badge vertical-align-center"
                                    :style="{ color: item.badgeColor }"
                                    v-if="item.badge"
                                ><i
                                    class="bg"
                                    :style="{ background: item.badgeColor }"
                                ></i>
                                {{ item.badge }}
                            </span>
                            </p>
                            <p class="subtitle subtitle-style">
                                {{ item.subTitle }}
                            </p>
                        </div>
                        <div
                            class="contentBox flex-nowrap"
                        >
                            <p
                                class="content vertical-align-center"
                                :style="{ color: item.contentColor }"
                            >
                                {{ item.content }}
                            </p>
                            <i
                                class="icon-m-right iconfont-m- vertical-align-center"
                                v-if="type == 'record' && !active[index]"
                            ></i>
                            <i
                                class="icon-m-down iconfont-m- vertical-align-center"
                                v-if="type == 'record' && active[index]"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 积分明细页面 -->
            <div class="main flex-nowrap" v-else @click="goOrder(item)">
                <div class="label creditLabel">
                    <i
                        :class="item.icon"
                        class="record-icon"
                        v-if="type == 'record'"
                    ></i>
                    <img
                        lazy-load
                        mode="widthFix"
                        class="record-img"
                        :src="item.img"
                        alt=""
                        v-else
                    />
                </div>
                <div
                    class="body flex-nowrap bodyBorder"
                    :style="
                        type == 'record' && active[index]
                            ? 'border-bottom: 1rpx solid #E6E7EB;'
                            : ''
                    "
                >
                    <div class="tilteBox">
                        <p class="title title-style flex-nowrap">
                            <span>{{ item.title }}</span>
                            <span
                                class="badge vertical-align-center"
                                :style="{ color: item.badgeColor }"
                                v-if="item.badge"
                            ><i
                                class="bg"
                                :style="{ background: item.badgeColor }"
                            ></i>
                                {{ item.badge }}
                            </span>
                        </p>
                        <p class="subtitle subtitle-style">
                            {{ item.subTitle }}
                        </p>
                        <p class="subtitle subtitle-style" v-if="item.order_no">
                            订单编号：{{ item.order_no }}
                        </p>
                    </div>
                    <div
                        class="contentBox flex-nowrap marginR"
                        :style="type == 'detail' ? 'padding:16rpx' : ''"
                    >
                        <p
                            class="content vertical-align-center"
                            :style="{ color: item.contentColor }"
                        >
                            {{ item.content }}
                        </p>
                        <i
                            class="icon-m-right iconfont-m- vertical-align-center"
                            v-if="type == 'record' && !active[index]"
                        ></i>
                        <i
                            class="icon-m-down iconfont-m- vertical-align-center"
                            v-if="type == 'record' && active[index]"
                        ></i>
                    </div>
                </div>
            </div>

            <div class="other border" v-if="type == 'record' && active[index]">
                <p class="info flex-nowrap">
                    <span class="cash vertical-align-center"
                        >提现金额：{{ item.cash }}元</span
                    ><span class="charge vertical-align-center"
                        >手续费：{{ item.charge }}元</span
                    >
                </p>
            </div>
        </li>  
    </ul>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'record' //detail
        },
        list: {
            type: Array,
            default: () => [
                {
                    icon: 'icon-m-pay-wechatpay iconfont-m-',
                    title: '提现到支付宝',
                    subTitle: '2019-11-12 10:42:56',
                    badge: '申请中',
                    badgeColor: '#FF3C29',
                    content: '96元',
                    contentColor: '#212121',
                    cash: 100,
                    charge: 41,
                    order_no: null,
                    order_id: 0
                }
            ]
        }
    },
    data() {
        return {
            active: {},
            params: '',
        }
    },
    mounted() {
        this.params = this.$Route.query?.page
    },
    methods: {
        clickItem(index) {
            this.active[index] = !this.active[index]
            this.active = { ...this.active }
            console.log()
        },
        // 点击跳转订单编号
        goOrder(item) {
            if(item?.order_no) {
                if(item?.user_delete == '1') {
                    this.$toast('订单已删除');
                    return
                } else {
                    this.$Router.push({
                        path: '/kdxOrder/detail',
                        query: {
                            order_id: item.order_id
                        }
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.list-item {
    width: 100%;
    border-radius: 12rpx;
    overflow: hidden;
    .item {
        width: 100%;
        min-height: px2rpx(53);
        background: #fff;
        &.newBalance{
            margin-top: px2rpx(8);
            border-radius: px2rpx(6);
        }
        .liMain {
            padding: 0 px2rpx(12);
            .titOrder{
                height: px2rpx(30);
                line-height: px2rpx(30);
                font-size: px2rpx(10);
                color: #969696;
                border-bottom: 1rpx solid #E6E7EB;
                i {
                    width: px2rpx(12);
                    height: px2rpx(12);
                    font-size: px2rpx(12);
                    line-height: px2rpx(12);
                    margin: px2rpx(10) 0 px2rpx(8);
                }
            }
        }
        &:last-child {
            .body,
            .info {
                border: none;
            }
        }
    }
    .main {
        width: 100%;
        align-items: center;
    }
    .other {
        padding: px2rpx(8) 0 0 px2rpx(48);
        &.border {
            border-bottom: 1rpx solid #e6e7eb;
        }
        .info {
            padding: 0 px2rpx(12) px2rpx(9) 0;
            justify-content: flex-end;
            .cash,
            .charge {
                margin-left: 16rpx;
                font-size: px2rpx(10);
                line-height: px2rpx(14);
                color: #969696;
            }
        }
    }
    .body {
        flex: 100%;
        width: 0;
        justify-content: space-between;
        &.bodyBorder {
            border-bottom: 1rpx solid #e6e7eb;
        }
        .tilteBox {
            flex: 1;
            padding: px2rpx(12) 0;
            .title {
                .badge {
                    font-size: px2rpx(10);
                    line-height: px2rpx(10);
                    text-align: center;
                    padding: px2rpx(3) px2rpx(8);
                    border-radius: px2rpx(8);
                    position: relative;
                    overflow: hidden;
                    margin-left: px2rpx(8);
                    .bg {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        opacity: 0.1;
                    }
                }
            }
        }
        .contentBox {
            flex-shrink: 0;
            padding-left: px2rpx(4);
            &.marginR {
                margin-right: px2rpx(4);
            }
            .content {
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                font-weight: bold;
            }
            .iconfont-m- {
                margin-right: px2rpx(8);
            }
        }
    }
    .label {
        width: px2rpx(24);
        margin-right: px2rpx(12);
        height: 100%;
        @include vertical-align-center;
        &.creditLabel {
            width: px2rpx(48);
            padding-left: px2rpx(14);
        }
        .record-icon {
            @include icon-center(48rpx, #00a0ee);
            &.icon-m-pay-wechatpay {
                color: #00ac1c;
            }
            &.icon-m-pay-alipay {
                color: #00a0ee;
            }
        }
        .record-img {
            width: px2rpx(24);
            height: px2rpx(24);
        }
    }
}
</style>
