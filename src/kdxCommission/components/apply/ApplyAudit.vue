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
    <view class="apply-audit flex-column">
        <view class="audit-icon">
            <block v-if="show_success">
                <image v-if="is_audit == 1" :src="$utils.staticMediaUrl('commission/audit-success.png')"></image>
                <image v-if="is_audit != 1" :src="$utils.staticMediaUrl('commission/audit-no.png')"></image>
            </block>
            <block v-else>
                <image v-if="status == 0" :src="$utils.staticMediaUrl('commission/audit-await.png')"></image>
                <image v-if="status == -1 && show_reject == 1" :src="$utils.staticMediaUrl('commission/audit-refuse.png')"></image>
            </block>
        </view>
        <view class="info">
            <block v-if="show_success">
                <view v-if="is_audit == 1">恭喜您已经通过审核</view>
                <view v-if="is_audit != 1">恭喜您已经成为分销商</view>
                <view class="sub-title">赶紧去商城逛一逛吧</view>
            </block>
            <block v-else>
                <view v-if="status == 0">请耐心等待审核</view>
                <view v-if="status == -1 && show_reject == 1">抱歉，审核未通过</view>
            </block>
        </view>
        <block>
            <block v-if="show_success">
                <div style="width:100%">
                    <btn  size="middle" classNames="theme-primary-bgcolor" @btn-click="toCommission">进入{{commissionSetting.agent_center}}</btn>
                </div>
                <view class="to-commission theme-primary-color" @click="toIndex">去商城逛逛</view>
            </block>
            <block v-else>
                <div v-if="show_success != 1" style="width:100%">
                    <btn  size="middle" classNames="theme-primary-bgcolor" @btn-click="toIndex">去商城逛逛</btn>
                </div>
            </block>
        </block>
    </view>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "ApplyAudit",
        components: {},
        props: {
            applyData: {
                type: Object,
                default: () => {}
            },
            show_success: {
                type: [Number, String],
                default: 0
            },
            is_audit: {
                type: [Number, String],
                default: 0
            }
        },
        data() {
            return {
                status: 0,
                show_reject: 0
            }
        },
        computed: {
            ...mapState('commissionSet', {
                commissionSetting: state => state.commissionSetting,
            }),
        },
        watch: {
            applyData: {
                handler(newValue) {
                    this.status = newValue?.status;
                    this.show_reject = newValue?.show_reject || 0
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toIndex() {
                this.$Router.replaceAll({
                    //#ifndef H5
                    path: '/pages/index/index',
                    //#endif
                    //#ifdef H5
                    path: '/'
                    //#endif
                })
            },
            toCommission() {
                this.$Router.replace({
                    path: '/kdxCommission/index/index'
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .apply-audit {
        align-items: center;
        padding: 48rpx 24rpx 32rpx;
        background-color: #fff;
        border-radius: 12rpx;
        .audit-icon {
            image {
                width: 168rpx;
                height: 168rpx;
            }
        }
        .info {
            margin: 32rpx 0 64rpx;
            font-size: 32rpx;
            line-height: 44rpx;
            text-align: center;
        }
        .sub-title {
            color: $uni-text-color-grey;
            font-size: 24rpx;
        }
      
        .to-commission {
            margin-top: 32rpx;
            font-size: 24rpx;
        }
    }
</style>