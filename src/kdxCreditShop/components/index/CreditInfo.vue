<template>
    <div class="credit-info">
        <div class="member-info">
            <div class="avatar-info" :style="{backgroundImage: getBgStyle}">
                <div class="avatar flex" @click="getMemberInfo">
                    <img class="avatar-img" :src="getAvatar" alt="" @error="loadImg">
                    <div class="">
                        <div class="nickname">{{userInfo.nickname || '登录/注册'}}</div>
                        <div class="credit">{{userInfo.credit}}</div>
                    </div>
                </div>
                <div class="rule-info" @click="toRule">
                    <i class="iconfont-m- icon-m-bangzhuzhongxin1"></i>
                    <span class="rule">规则说明</span>
                </div>
            </div>
            <div class="nav-btn flex">
                <div class="nav-item flex flex1 van-hairline--right" @click="clickBtn('credit')">
                    <i class="iconfont-def icon-def-jifen1"></i>{{credit_text}}明细
                </div>
                <div class="nav-item flex flex1" @click="clickBtn('order')">
                    <i class="iconfont-def icon-def-dingdan1"></i>我的订单
                </div>
            </div>
        </div>
        <div class="search flex" @click="clickBtn('search')">
            <i class="iconfont-m- icon-m-shangpinxiangqing-search"></i>搜索商品
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "creditInfo",
        components: {},
        props: {
            userInfo: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            getAvatar() {
                if (this.userInfo.avatar) {
                    return this.$utils.mediaUrl(this.userInfo.avatar)
                } else {
                    return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
                }
            },
            getBgStyle() {
                return `url(${this.$utils.staticMediaUrl('creditShop/info-bg.png')})`
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            loadImg() {
                return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
            },
            getMemberInfo() {
                // console.log(this.$decorator.getModule('credit'),'getPage>>>>>>>getMemberInfo');
                // this.$decorator.getModule('credit').getUserInfo(0)
                this.$Router.auto({
                    path: '/kdxMember/memberInfo/index',
                    query: {
                        type: '2'
                    }
                })
            },
            clickBtn(type) {
                if (type === 'credit') {
                    this.$Router.auto({
                        path: '/kdxMember/credit/index'
                    })
                } else if (type === 'order') {
                    this.$Router.auto({
                        path: '/kdxOrder/list'
                    })
                } else {
                    this.$Router.auto({
                        path: '/kdxCreditShop/list'
                    })
                }
            },
            toRule() {
                // 跳转
                this.$Router.auto({
                    path: '/kdxMember/rules/index',
                    query: {
                        type: '2'
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .credit-info {
        .member-info {
            position: relative;
            border-radius: px2rpx(6);
            box-shadow: 0 0 px2rpx(17) rgba(0, 0, 0, .12);
            overflow: hidden;
            .avatar-info {
                padding: px2rpx(35) 0 px2rpx(24) px2rpx(24);
                background-repeat: no-repeat;
                background-size: cover;
            }
            .avatar {
                align-items: flex-start;
            }
            .avatar-img {
                margin-right: px2rpx(8);
                width: px2rpx(60);
                height: px2rpx(60);
                border: 1px solid #fff;
                border-radius: 50%;
            }
            .nickname {
                line-height: px2rpx(20);
                font-size: px2rpx(14);
                color: #fff;
            }
            .credit {
                line-height: px2rpx(50);
                font-size: px2rpx(36);
                color: #fff;
            }
            .nav-btn {
                align-items: center;
                height: px2rpx(44);
                .nav-item {
                    justify-content: center;
                    align-items: center;
                    &.van-hairline--right::after {
                        border-right-color: $uni-border-color;
                        border-style: solid;
                    }
                }
                .iconfont-def {
                    margin-right: px2rpx(2);
                    font-size: px2rpx(18);
                    color: #fbdc0b;
                    /*color: #212121;*/
                }
            }
            .rule-info {
                position: absolute;
                top: px2rpx(8);
                right: px2rpx(12);
                line-height: px2rpx(14);
                color: #fff;
                font-size: px2rpx(10);
                .iconfont-m- {
                    font-size: px2rpx(14);
                }
                .rule {
                    vertical-align: text-top;
                }
            }
        }
        .search {
            align-items: center;
            margin-top: px2rpx(8);
            padding-left: px2rpx(12);
            width: 100%;
            height: px2rpx(42);
            font-size: px2rpx(12);
            color: rgba(0,0,0,.24);
            border-radius: px2rpx(6);
            box-shadow: 0 0 px2rpx(24) rgba(0, 0, 0, .08);
            .iconfont-m- {
                margin-right: px2rpx(6);
                font-size: px2rpx(16);
            }
        }
    }
</style>