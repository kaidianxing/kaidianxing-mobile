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
    <page-box>
        <view class="content">
            <div class="coupon-center" v-if="tabIndex === '1'">
                <coupon-center-list
                    v-if="couponList.length"
                    :couponList="couponList"
                    @getCoupon="getCoupon"
                />
            </div>
            <div class="coupon-my" v-if="tabIndex === '2'">
                <div
                    class="coupon-my-tab"
                    :class="{ bg: !couponList.length && !requestLoading }"
                >
                    <div
                        class="tab-item"
                        :class="{ 'active theme-primary-color' : couponStatus === 1 }"
                        @click.stop="changeMyCouponStatus(1)"
                    >
                        未使用({{ couponTotal.normal || 0 }})
                        <div class="line theme-primary-bgcolor"></div>
                    </div>
                    <div
                        class="tab-item"
                        :class="{ 'active ': couponStatus === 2 }"
                        @click.stop="changeMyCouponStatus(2)"
                    >
                        已使用({{ couponTotal.used || 0 }})
                        <div class="line theme-primary-bgcolor"></div>
                    </div>
                    <div
                        class="tab-item"
                        :class="{ 'active theme-primary-color': couponStatus === 3 }"
                        @click.stop="changeMyCouponStatus(3)"
                    >
                        已过期({{ couponTotal.expired || 0 }})
                        <div class="line theme-primary-bgcolor"></div>
                    </div>
                </div>
                <div class="coupon-list">
                    <coupon-list
                        v-if="couponList.length"
                        :couponList="couponList"
                        :couponStatus="couponStatus"
                    />
                </div>
            </div>
            <div
                class="coupon-nodata"
                v-if="!couponList.length && !requestLoading"
            >
                <no-coupon
                    :couponFrom="tabIndex"
                    @jumpCouponCenter="jumpCouponCenter"
                />
            </div>
        </view>
        <template v-slot:foot>
            <div class="tab-wrap">
                <div
                    class="tab-item"
                    :class="{ 'active': tabIndex === '1' }"
                    @click.stop="changeTabIndex('1')"
                >
                    <div class="box">
                        <div
                            class="iconfont-m- icon-m-dibudaohang-youhuiquan"
                            :class="{'theme-primary-color' :  tabIndex === '1'}"
                        ></div>
                        <div class="text">领券中心</div>
                    </div>
                </div>
                <div
                    class="tab-item"
                    :class="{ 'active': tabIndex === '2' }"
                    @click.stop="changeTabIndex('2')"
                >
                    <div class="box">
                        <div 
                        class="iconfont-m- icon-m-dibudaohang-me"
                        :class="{'theme-primary-color' :  tabIndex === '2'}"></div>
                        <div class="text">我的优惠券</div>
                    </div>
                </div>
            </div>
        </template>
    </page-box>
</template>
<script>
import CouponCenterList from '../components/CouponCenterList'
import CouponList from '../components/CouponList'
import NoCoupon from '../components/NoCoupon'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        CouponCenterList,
        CouponList,
        NoCoupon,
    },
    data() {
        return {
            tabIndex: '',
            couponList: [], // 优惠券数组
            couponStatus: 1,
            page: 1,
            pageSize: 15,
            finished: false,
            couponTotal: {}, // 优惠券数量
            requestLoading: false,
            loaded: false
        }
    },
    async mounted() {
        let tabIndex = this.$Route.query.tabIndex
        if (tabIndex) {
            this.tabIndex = tabIndex
        } else {
            this.tabIndex = '1'
        }
        // if (this.tabIndex === '1') {
        //     this.getCouponCenterList()
        // } else {
        //     this.getMyCouponList()
        //     this.getCouponTotal()
        // }
    },
    onShow(){
        if(this.loaded){
            this.refresh()
        }
    },
    onReachBottom() {
        if (this.finished) {
            return
        }
        this.page++
        if (this.tabIndex === '1') {
            this.getCouponCenterList()
        } else {
            this.getMyCouponList()
        }
    },
    methods: {
        // 领券中心优惠券列表
        getCouponCenterList() {
            if (this.requestLoading) {
                return
            }
            this.requestLoading = true
            this.$api.memberApi
                .getCouponCenterList({
                    page: this.page,
                    pageSize: this.pageSize,
                })
                .then((res) => {
                    this.requestLoading = false
                    if (res.error === 0) {
                        this.finished = res.page_size !== res.list.length
                        this.couponList = this.couponList.concat(res.list)
                    } else {
                        this.$toast(res.message)
                    }
                }).finally(()=> {
                    this.loaded = true
                })
        },
        // 获取我的优惠券总数
        getCouponTotal() {
            this.$api.memberApi.getCouponTotal({}).then((res) => {
                if (res.error === 0) {
                    this.couponTotal = {
                        ...res.data,
                    }
                } else {
                    this.$toast(res.message)
                }
            }).finally(()=> {
                    this.loaded = true
                })
        },
        // 获取我的优惠券
        getMyCouponList() {
            if (this.requestLoading) {
                return
            }
            this.requestLoading = true
            this.$api.memberApi
                .getMyCouponList({
                    status: this.couponStatus,
                    page: this.page,
                })
                .then((res) => {
                    this.requestLoading = false
                    if (res.error === 0) {
                        this.finished = res.page_size !== res.list.length
                        this.couponList = this.couponList.concat(res.list)
                    } else {
                        this.$toast(res.message)
                    }
                })
        },
        // 底部tab切换
        changeTabIndex(index) {
            if (this.tabIndex === index) {
                return
            }
            this.tabIndex = index
        },
        // 前往领券中心
        jumpCouponCenter() {
            this.tabIndex = '1'
        },
        // 我的优惠券tab切换
        changeMyCouponStatus(index) {
            if (this.couponStatus === index) {
                return
            }
            this.couponStatus = index
        },
        async checkPreCondition(){ // 检测登录和绑定状态
            try {
                let isLogin = await this.$store.dispatch('login/checkLogin')
                if(!isLogin) {
                    this.$store.commit('login/setModal', true)
                    return false
                }
                
                return true
            } catch (error) {
                console.log(error)
            }
           
        },
        async refresh(){
            let passed = await this.checkPreCondition()
            this.page = 1
            this.couponList = []
            // 全部优惠券
            if(this.tabIndex == '1'){
                 this.getCouponCenterList()
            } else if (this.tabIndex === '2') {
                // 我的优惠券
                this.getCouponTotal()
                this.getMyCouponList()
            }
        }
    },
    watch: {
        tabIndex: {
            async handler(val) {
                this.refresh()
                if (val === '1') {
                    uni.setNavigationBarTitle({
                        title: '优惠券领取中心',
                    })
                } else if (val === '2') {
                    uni.setNavigationBarTitle({
                        title: '我的优惠券',
                    })
                }
            },
            immediate: true,
        },
        couponStatus: {
            async handler(val) {
                this.page = 1
                this.couponList = []
                 // 检测前置条件
                let passed = await this.checkPreCondition()
                if(passed){
                    this.getMyCouponList()
                }
            },
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
    padding-bottom: 100rpx;
    .coupon-center {
        padding-left: 24rpx;
        padding-right: 24rpx;
    }
    .coupon-my {
        .coupon-my-tab {
            display: flex;
            align-items: center;
            background-color: #fff;
            &.bg {
                background-color: #fff;
            }
            .tab-item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                font-size: 28rpx;
                line-height: 40rpx;
                color: #565656;
                padding-top: 16rpx;
                padding-bottom: 20rpx;
                .line {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 56rpx;
                    height: 4rpx;
                    display: none;
                }
                &.active {
                    font-weight: bold;
                    font-size: 32rpx;
                    .line {
                        display: block;
                    }
                }
            }
        }
        .coupon-list {
            padding-left: 24rpx;
            padding-right: 24rpx;
        }
    }
}
.tab-wrap {
    height: 98rpx;
    width: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    text-align: center;
    border-top: 1rpx solid #e6e7eb;
    .tab-item {
        flex: 1;
        font-size: 20rpx;
        line-height: 28rpx;
        color: #969696;
        height: 98rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont-m- {
            font-size: 44rpx;
            margin-bottom: 8rpx;
        }
        &.active {
            .iconfont-m- {
                color: #ff3c29;
            }
            .text {
                color: #212121;
            }
        }
    }
}
</style>
