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
    <view class="apply-form">
        <view class="form-content">
            <view class="rr-cell">
                <view class="flex">
                    <view class="flex1">
                        <text class="label">请填写申请信息</text>
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex bor-top">
                    <view class="label">
                        <text>邀请人</text>
                    </view>
                    <view class="flex1">
                        <text>{{applyData.inviter_name || commissionSetting.head_agent}}</text>
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex bor-top">
                    <view class="label">
                        <text>姓名</text>
                    </view>
                    <view class="flex1">
                        <input v-model="formData.name" class="rr-input" type="text" placeholder="请填写姓名" placeholder-class="input-placeholder" />
                    </view>
                </view>
            </view>
            <view class="rr-cell">
                <view class="flex bor-top">
                    <view class="label">
                        <text>手机号</text>
                    </view>
                    <view class="flex1">
                        <input v-model="formData.mobile" class="rr-input" type="text" placeholder="请填写手机号" placeholder-class="input-placeholder" />
                    </view>
                </view>
            </view>
        </view>
        <!-- 协议 -->
        <view class="deal flex" v-if="applyData.show_agreement == 1">
            <i v-if="!check" class="iconfont-m- icon-m-no2" @click="checkUpdate"></i>
            <i v-if="check" class="iconfont-m- icon-m-yes2 theme-primary-color" @click="checkUpdate"></i>
            <view>我已阅读并了解了<text class="deal-text" @click="dealModel=true">《{{commissionSetting.agreement_title}}》</text></view>
        </view>

        <btn styles="margin-top:52rpx;" classNames="theme-primary-bgcolor" size="middle" @btn-click="handleApply">申请成为{{commissionSetting.agent_name}}</btn>
        <!--<view class="tip uni-text-color-grey">提示：申请成功后，您店铺的商品将和总店保持同步，不能再自行发布商品，你已自行发布的商品将不再展示</view>-->

        <!-- 协议弹窗 -->
        <view class="deal-modal" v-show="dealModel">
            <view class="content">
                <view class="title">{{commissionSetting.agreement_title}}</view>
                <view class="text-info"><richText :content="commissionSetting.agreement_content"></richText></view>
                <view class="button theme-primary-color" @click="handleClose(true)">我已阅读</view>
                <view class="close" @click="handleClose(false)">
                    <i class="iconfont-m- icon-m-haibaoxieyi1"></i>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import {mapState, mapGetters} from "vuex";
    import richText from '@/components/decorate/templates-shim/RichText'
    export default {
        name: "ApplyForm",
        components: {
            richText,
        },
        props: {
            applyData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                check: false,
                dealModel: false,
                formData: {
                    name: '',
                    mobile: ''
                }
            }
        },
        computed: {
            ...mapState('commissionSet', {
                commissionSetting: state => state.commissionSetting,
            }),
            ...mapGetters('form', ['form'])
        },
        created() {
        },
        mounted() {
        },
        methods: {
            checkUpdate() {
                this.check = !this.check
            },
            handleClose(data) {
                if (this.check) {
                    this.check = true;
                } else {
                    this.check = data
                }
                this.dealModel = false;
            },
            async handleApply() {
                // 验证手机号
                let reg = /^1[3456789]\d{9}$/;
                if (!reg.test(this.formData.mobile)) {
                    this.$toast('请输入正确的手机号');
                    return;
                }
                // 协议是否勾选
                if (this.applyData.show_agreement == 1 && !this.check) {
                    this.$toast('请勾选协议');
                    return;
                }
                // 分销商申请接口
                this.$api.commissionApi.submitApply({...this.formData}).then(res => {
                    if (res.error !== 0) {
                        this.$toast(res.message);
                    }
                    if (res.error == 0) {
                        this.$toast('申请成功');
                        if (res.status == 0) {
                            this.$emit('changeStatus', res.status)
                        } else {
                            setTimeout(() => {
                                this.$Router.replace({
                                    path: '/kdxCommission/index/index'
                                })
                            }, 1000)
                        }
                    } else {
                        this.$toast(res.message);
                    }
                })
            },
            changeFrom(data) {
                this.$store.commit('form/setFormContent', data);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .apply-form {
        position: relative;
        .form-content {
            background-color: #fff;
            border-radius: 12rpx;
            /*overflow: auto;*/
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                &:first-child {
                    border-top-left-radius: 12rpx;
                    border-top-right-radius: 12rpx;
                    .label {
                        font-size: 28rpx;
                    }
                }
            }
        }
        .deal {
            align-items: center;
            margin-top: 16rpx;
            padding-left: 24rpx;
            >view {
                font-size: 24rpx;
            }
            i {
                font-size: 18px;
                margin-right: 4px;
                color: #fff;
            }
            .icon-m-yes2 {
                color: $uni-color-primary;
            }
            .deal-text {
                color: #518DEF;
                font-size: 24rpx;
            }
        }
        .rr-btn {
            margin-top: 52rpx;
            background-color: $uni-color-primary;
        }
        .tip {
            padding: 0 26rpx;
            margin-top: 16rpx;
            font-size: 24rpx;
            line-height: 34rpx;
        }
        .deal-modal {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.6);
            z-index: 1;
            .content {
                position: absolute;
                width: 65%;
                max-height: 696rpx;
                left: 50%;
                top: 50%;
                background-color: #fff;
                transform: translate(-50%, -50%);
                border-radius: 12rpx;
                /*overflow: hidden;*/
                .title {
                    padding: 24rpx 0;
                    font-size: 32rpxpx;
                    line-height: 44rpx;
                    text-align: center;
                }
                .text-info {
                    max-height: 508rpx;
                    padding: 0 24rpx;
                    margin-bottom: 20rpx;
                    font-size: 20rpx;
                    line-height: 36rpx;
                    box-sizing: border-box;
                    overflow: auto;
                }
                .button {
                    height: 80rpx;
                    line-height: 80rpx;
                    background-color: #fff;
                    border-top: 1px solid $uni-border-color;
                    text-align: center;
                    border-radius: 0 0 12rpx 12rpx;
                }
                .close {
                    position: absolute;
                    width: 48rpx;
                    height: 48rpx;
                    left: 50%;
                    bottom: -96rpx;
                    transform: translateX(-50%);
                    i {
                        font-size: 48rpx;
                        color: #fff;
                    }
                }
            }
        }
        .commission-diy-form-box {
            .commission-diy-form {
                border-bottom-left-radius: 12rpx;
                border-bottom-right-radius: 12rpx;
                background-color: #ffffff;
                /deep/ .form-item {
                    &:first-child {
                        border-top: 1rpx solid #E6E7EB;
                    }
                }
            }
        }
    }
</style>
