<template>
    <div class="detail_sale">
        <div class="container">
            <div class="item van-hairline--bottom" v-for="item in activeData.data" :key="item.type">
                <div class="label">{{item.label}}</div>
                <div class="body">
                    <ul class="actives" v-if="item.type=='active'" @click="clickItem('active')">
                        <li v-for="(val,key) in item.items" :key="key" class="active">
                            <p v-if="val" class="icon-word">
                                <span v-if="val.type=='balance'">{{val.name}}</span>
                            </p>
                            <!-- 余额抵扣 -->
                            <p v-if="val.type=='balance'" class="demon">
                                <span v-if="val.deduction_type=='1'">支持{{val.name}}抵扣</span>
                                <span v-if="val.deduction_type=='2'">支持{{val.name}}抵扣<i style="color: #0FE80F">{{val.deduction_price}}</i>元</span>
                            </p>
                        </li>
                    </ul>
                    <div class="common" v-else-if="item.type =='bupeisong'" @click="clickItem('bupeisong')">
                        <!--                <p class="icon-word" v-if="item.content.iconword">{{item.content.iconword}}</p>-->
                        <p class="words">{{item.content.value}}</p>
                    </div>
                    <div class="samecity" v-else-if="item.type =='samecity'" @click="clickItem('samecity')">{{item.content.value}}</div>
                    <div class="samecity coupon" v-else-if="item.type =='coupon'" @click="clickItem('coupon')">{{item.content.value}}</div>
                </div>
                <i class="iconfont-m- icon-m-right"></i>
            </div>
        </div>

        <div class="verify container" v-if="getVerifyData.is_verify">
            <div class="item" @click="clickItem('verify')">
                <div class="label">{{getVerifyData.title}}</div>
                <div class="body verify-body">
                    <img class="self-bg" :src="$utils.staticMediaUrl('verify/self-bg.png')" alt="">
                    <div class="self-num">{{getVerifyData.dispatch_verify_point_count}}</div>
                    <div class="point-title">
                        <div class="line-hide">{{getVerifyData.verify_point_title}}</div>
                        <div class="distance">{{getVerifyData.verify_point_distance|priceUnit}}</div>
                    </div>
                </div>
                <i class="iconfont-m- icon-m-right"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailSale",
        components: {},
        props: {
            activeData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
            }
        },
        computed: {
            getVerifyData() {
                return this.activeData?.verifyData ?? {
                    is_verify: false,
                    title: '自提点',
                    dispatch_verify_point_count: 0+'个',
                    verify_point_title: '',
                    verify_point_distance: ''
                }
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            clickItem(type) {
                this.$emit('saleBtn', type)
            }
        },
        filters: {
            priceUnit(data) {
                let distance = data || 0;
                let result = Number(distance);
                if (result < 100) {
                    result = '<100m'
                    return
                }
                result = Number(distance / 1000);
                if (result>100) {
                    result = '>100km'
                } else {
                    result = result + 'km'
                }
                return result
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail_sale {
        margin-top: px2rpx(8);
        .container {
            width: 100%;
            padding-left: px2rpx(12);
            background-color: #fff;
            box-sizing: border-box;
            overflow: hidden;
        }
        .icon-m-right {
            position: relative;
            flex-shrink: 0;
            line-height: px2rpx(16);
            height: px2rpx(16);
            margin: auto 0 auto px2rpx(1);
            font-size: px2rpx(16);
            color: $uni-text-color-grey;
        }
        .label {
            box-sizing: border-box;
            font-size: px2rpx(12);
            min-width: px2rpx(48);
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: px2rpx(40);
            color: $uni-text-color-grey;
        }
        .body {
            width: 0;
            flex: 1;
            font-size: px2rpx(12);
            line-height: rpx(46);
            display: flex;
            flex-direction: column;
            .actives {
                padding: px2rpx(7) 0;
                .active {
                    display: flex;
                    flex-wrap: nowrap;
                    i {
                        font-style: normal;
                    }
                    .demon,.demon-text {
                        line-height: px2rpx(12);
                        font-size: px2rpx(12);
                        margin: px2rpx(4) 0;
                        color: #212121;

                        i {
                            line-height: px2rpx(12);
                            font-size: px2rpx(12);
                        }
                    }

                }
            }
            .common {
                display: flex;
                line-height: px2rpx(12);
                font-size: px2rpx(12);
                margin: auto 0;
                i {
                    font-style: normal;
                }
                .words {
                    flex: 1;
                    margin: auto 0;
                    padding: px2rpx(3) 0;
                    font-weight: 500;
                    font-size: px2rpx(12);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .samecity {
                text-align: right;
                line-height: px2rpx(40);
                color:#212121;
            }
            .icon-word {
                font-size: px2rpx(10);
                height: px2rpx(16);
                line-height: px2rpx(10);
                display: flex;
                flex-shrink: 0;
                flex-direction: column;
                justify-content: center;
                border: px2rpx(0.5) solid $uni-color-primary;
                color: $uni-color-primary;
                border-radius: px2rpx(8);
                padding: px2rpx(3) px2rpx(8);
                margin: px2rpx(4) px2rpx(8) px2rpx(4) 0;
            }
        }
        .item {
            display: flex;
            flex-wrap: nowrap;
            padding-right:px2rpx(12);
            &.van-hairline--bottom:after {
                border-bottom-color: $uni-border-color;
                border-style: solid;
            }
        }
        .item:last-child {
            &.van-hairline--bottom:after {
                border-width: 0;
            }
        }
        .verify {
            margin-top: px2rpx(8);
            background-color: #fff;
            .label {
                font-size: px2rpx(12);
            }
            .verify-body {
                position: relative;
                display: flex;
                .self-num {
                    position: relative;
                    line-height: px2rpx(40);
                    color: #212121;
                    font-size: px2rpx(12);
                }
                .point-title {
                    display: flex;
                    justify-content: flex-end;
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 75%;
                    height: px2rpx(40);
                    line-height: px2rpx(40);
                    font-size: px2rpx(12);
                    .distance {
                        flex-shrink: 0;
                        margin-left: px2rpx(2);
                        color: #969696;
                        font-size: px2rpx(12);
                    }
                }
                .self-bg {
                    position: absolute;
                    right: px2rpx(-30);
                    top: 0;
                    width: px2rpx(200);
                    height: px2rpx(40);
                }
            }
        }
    }
</style>