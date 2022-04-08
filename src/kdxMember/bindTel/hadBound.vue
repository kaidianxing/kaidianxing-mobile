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
<theme-content>
    <div class="had-bound">
        <div class="userInfo">
            <div class="tel">
                <i class="icon-m-tishi iconfont-m- theme-primary-color"></i>手机号
                <span class="theme-primary-color">{{ bind_mobile }}</span
                >已绑定在以下账号
            </div>
            <ul class="account-list">
                <li>
                    <div class="other">
                        <div class="top">
                            <p class="active">注册渠道：{{ getChannel }}</p>
                            <div class="avart">
                                <img
                                    class="avart-img"
                                    :src="
                                        bind_user.avatar ||
                                            $utils.staticMediaUrl(
                                                'login/avatar_default.png'
                                            )
                                    "
                                />
                            </div>
                            <div class="info">
                                <p class="_p name-level">
                                    <span class="name">{{
                                        bind_user.nickname
                                    }}</span>
                                    <span
                                        class="flex align-center level"
                                        v-if="bind_user.level_name"
                                    >
                                        <i
                                            class="icon-m-quanyi iconfont-m- level-icon"
                                        ></i>
                                        {{ bind_user.level_name }}
                                    </span>
                                </p>
                                <p class="_p time">
                                    注册时间：{{ bind_user.created_at }}
                                </p>
                            </div>
                        </div>
                        <div class="bottom">
                            <div
                                class="col"
                                v-for="(item, index) in other"
                                :key="index"
                            >
                                <span class="value">{{
                                    bind_user[item.key]
                                }}</span>
                                <span class="key">{{ item.title }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="login-btn theme-primary-bgcolor" @click="toBind">使用此账号登录</div>
                </li>
            </ul>
        </div>
        <div class="btns">
            <div
                class="btn bindCurrent vertical-align-center theme-primary-border theme-primary-color"
                @click="toBindCurrent"
            >
                换绑到当前账号
            </div>
            <div
                class="btn bindOther vertical-align-center theme-primary-border theme-primary-color"
                @click="toBindOther"
            >
                绑定其他手机号
            </div>
        </div>

        <!-- 此账号登录模态框 -->
        <rr-modal
            title="提示"
            subtitle="您确定换绑到当前账号吗?"
            :value="currentModal"
            @handlerCancel="currentModal = false"
            @handlerOK="bindMember(user.id, bind_user.id, bind_user.mobile)"
        ></rr-modal>

        <!-- 当前账号模态框 -->
        <rr-modal
            title="提示"
            :value="showModal"
            @handlerCancel="showModal = false"
            @handlerOK="bindMember(bind_user.id, user.id, bind_mobile)"
        >
            <template v-slot:content>
                <view class="desc">
                    您确定使用"{{ bind_user.nickname }}"登录吗?
                    <text class="desc-text">登录后当前账号将被注销,</text>
                    <text class="desc-text theme-primary-color">注销后无法找回。</text>
                </view>
            </template>
        </rr-modal>
    </div>
    </theme-content>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            other: [
                {
                    title: '余额(元)',
                    key: 'balance'
                },
                {
                    title: '积分',
                    key: 'credit'
                },
                {
                    title: '订单数',
                    key: 'order_num'
                },
                {
                    title: '优惠券',
                    key: 'coupon_num'
                }
            ],
            showModal: false,
            currentModal: false,
        }
    },
    computed: {
        ...mapGetters('login', ['user', 'bind_user', 'bind_mobile']),
        getChannel() {
            let channel = {
                0: '未知',
                10: 'H5',
                20: '微信公众号',
                21: '微信小程序',
                30: '抖音小程序'
            }

            return channel[this.bind_user.source] || '未知'
        }
    },

    methods: {
        ...mapMutations('login', ['setBind']),
        toBindOther() {
            this.$Router.auto('/kdxMember/bindTel/mobile')
        },
        bindMember(select_member_id, discard_member_id) {
            this.currentModal && (this.currentModal = false)
            this.showModal && (this.showModal = false)
            this.$api.loginApi
                .bindMember({
                    select_member_id,
                    discard_member_id,
                    mobile: this.bind_mobile
                })
                .then(res => {
                    if (res.error === 0) {
                        this.setBind(true)
                        this.$toast('操作成功');
                        this.$Router.replaceAll({
                            //#ifndef H5
                            path: '/pages/index/index',
                            //#endif
                            //#ifdef H5
                            path: '/'
                            //#endif
                        })
                    }
                })
        },
        toBindCurrent() {
            this.currentModal = true
        },
        toBind() {
            this.showModal = true
        }
    },
    beforeMount() {
        let balance_text = this.$store.state.setting.systemSetting.balance_text
        let credit_text = this.$store.state.setting.systemSetting.credit_text
        this.other[0].title = balance_text + '(元)'
        this.other[1].title = credit_text;
    }
}
</script>

<style lang="scss" scoped>
.had-bound {
    width: 100%;
    .userInfo {
        margin: px2rpx(8) px2rpx(12) px2rpx(16);
        .tel {
            background: #fff;
            width: 100%;
            padding: px2rpx(16) px2rpx(12);
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #565656;
            margin-bottom: px2rpx(8);
            border-radius: px2rpx(6);
            .icon-m-tishi {
                height: px2rpx(12);
                line-height: px2rpx(12);
                vertical-align: px2rpx(-1);
                margin-right: px2rpx(2);
            }
        }
        .account-list {
            li {
                margin-bottom: px2rpx(8);
                background-color: #fff;
                border-radius: px2rpx(6);
                padding-bottom: px2rpx(16);
                &:last-child {
                    margin-bottom: 0;
                }
                .other {
                    .top {
                        display: flex;
                        flex-wrap: nowrap;
                        padding: px2rpx(16) px2rpx(12) 0;
                        margin-bottom: px2rpx(24);
                        position: relative;
                        .active {
                            position: absolute;
                            font-size: px2rpx(12);
                            line-height: px2rpx(17);
                            padding: px2rpx(3) px2rpx(12);
                            background: #09c15f;
                            border-radius: 0 0 0 px2rpx(12);
                            color: #fff;
                            top: 0;
                            right: 0;
                        }
                        .avart {
                            width: px2rpx(50);
                            height: px2rpx(50);
                            border: 1rpx solid #e6e7eb;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: px2rpx(12);
                            .avart-img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .info {
                            display: flex;
                            flex-direction: column;
                            ._p {
                                line-height: px2rpx(15);
                                .name {
                                    font-size: px2rpx(16);
                                    line-height: px2rpx(16);
                                    margin-right: px2rpx(7);
                                    color: #212121;
                                }
                                .level {
                                    font-size: px2rpx(8);
                                    line-height: px2rpx(8);
                                    padding: px2rpx(3.5) px2rpx(4);
                                    border-radius: px2rpx(2);
                                    background: #565656;
                                    color: #ffe382;

                                    &-icon {
                                        font-size: 22rpx;
                                    }
                                }
                            }
                            .name-level {
                                margin: px2rpx(8) 0;
                            }
                        }
                        .time {
                            font-size: px2rpx(12);
                            color: #969696;
                        }
                    }
                    .bottom {
                        display: flex;
                        flex-wrap: nowrap;
                        padding-bottom: px2rpx(16);
                        .col {
                            width: 0;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            .value,
                            .key {
                                text-align: center;
                                font-size: px2rpx(16);
                                color: #212121;
                                line-height: px2rpx(16);
                                font-weight: bold;
                            }
                            .key {
                                font-size: px2rpx(12);
                                color: #969696;
                                line-height: px2rpx(12);
                                margin-top: px2rpx(7.5);
                                font-weight: normal;
                            }
                        }
                    }
                }
                .login-btn {
                    color: #fff;
                    font-weight: 500;
                    font-size: px2rpx(14);
                    line-height: px2rpx(20);
                    height: px2rpx(40);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: px2rpx(20);
                    margin-left: px2rpx(12);
                    margin-right: px2rpx(12);
                    margin-top: px2rpx(8);
                }
            }
        }
    }

    .desc {
        text-align: left;
        font-size: 24rpx;
        line-height: 34rpx;
        color: $uni-text-color-grey;
    }

    .desc-text {
         font-size: 24rpx;
        line-height: 34rpx;
    }
    .btns {
        width: px2rpx(351);
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin: auto;
        .btn {
            width: px2rpx(170);
            height: px2rpx(40);
            font-size: px2rpx(14);
            border-radius: px2rpx(20);
            font-weight: 500;
            border: px2rpx(1) solid;
        }
    }
}
</style>
