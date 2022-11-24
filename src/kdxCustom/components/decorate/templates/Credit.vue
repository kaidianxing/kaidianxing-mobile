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
    <div class="credit-info-box" v-if='componentData&&componentData.id=="credit"&&credit_perm' :style="{ paddingTop: componentData.style.styletype === 'one'?0:`${px2rpx(componentData.style.margintop)}`}">

        <div class="credit-info" :class="componentData.style.styletype" :style="{ padding: getPadding, background: getBgColor, backgroundSize: getBgSize}">
            <div class="member-info one" v-if="componentData.style.styletype === 'one'">
                <div class="avatar-info" :style="{background: getBgStyle}">
                    <div class="avatar flex" @click="clickMemberInfo">
                        <img class="avatar-img" :src="getAvatar" alt="" @error="loadImg">
                        <div class="">
                            <div class="nickname" :style="{color: componentData.style.membercolor}">{{componentData.info.nickname || '登录/注册'}}</div>
                            <div class="credit" :style="{color: componentData.style.creditcolor}">{{componentData.info.credit}}</div>
                        </div>
                    </div>
                    <div class="rule-info" :style="{color: componentData.style.rulecolor}" @click="clickBtn('rule')">
                        <i class="iconfont-m- icon-m-bangzhuzhongxin1"></i>
                        <span>规则说明</span>
                    </div>
                </div>
                <div class="nav-btn flex" v-if="componentData.params.creditBtn.length>0" :style="{backgroundColor: componentData.style.btncolor}">
                    <div class="nav-item flex flex1 van-hairline--right" v-if="componentData.params.creditBtn.includes('0')" @click="clickBtn('credit')">
                        <i :class="componentData.params.recordicon" :style="{color: componentData.style.recordiconcolor}"></i>
                        <span :style="{color: componentData.style.recordtextcolor}">{{credit_text}}明细</span>
                    </div>
                    <div class="nav-item flex flex1" v-if="componentData.params.creditBtn.includes('1')" @click="clickBtn('order')">
                        <i :class="componentData.params.ordericon" :style="{color: componentData.style.ordericoncolor}"></i>
                        <span :style="{color: componentData.style.ordertextcolor}">我的订单</span>
                    </div>
                </div>
            </div>

            <div class="member-info two" v-else :style="{background: getBgStyle, borderRadius: `${px2rpx(componentData.style.borderadius)}`}">
                <div class="avatar-info" @click="clickMemberInfo">
                    <img class="avatar-img" :src="getAvatar" alt="" @error="loadImg">
                    <div class="nickname" :style="{color: componentData.style.membercolor}">{{componentData.info.nickname || '登录/注册'}}</div>
                    <div class="credit" :style="{color: componentData.style.creditcolor}">{{componentData.info.credit}}</div>
                </div>
                <div class="nav-btn flex" v-if="componentData.params.creditBtn.length>0">
                    <div class="nav-item flex" :style="{borderColor: componentData.style.recordbcolor}" v-if="componentData.params.creditBtn.includes('0')" @click="clickBtn('credit')">
                        <i :class="componentData.params.recordicon" :style="{color: componentData.style.recordiconcolor}"></i>
                        <span :style="{color: componentData.style.recordtextcolor}">{{credit_text}}明细</span>
                    </div>
                    <div class="nav-item flex" :style="{borderColor: componentData.style.orderbcolor}" v-if="componentData.params.creditBtn.includes('1')" @click="clickBtn('order')">
                        <i :class="componentData.params.ordericon" :style="{color: componentData.style.ordericoncolor}"></i>
                        <span :style="{color: componentData.style.ordertextcolor}">我的订单</span>
                    </div>
                </div>
                <div class="rule-info" :style="{color: componentData.style.rulecolor}" @click="clickBtn('rule')">
                    <i class="iconfont-m- icon-m-bangzhuzhongxin1"></i>
                    <span>规则说明</span>
                </div>
            </div>

            <div class="search flex"
                 v-if="componentData.params.showsearch === '1'"
                 :style="{
                 marginTop: `${px2rpx(componentData.style.betweenmargin)}`,
                 backgroundColor: componentData.style.bgcolor
             }" @click="clickBtn('search')">
                <i class="iconfont-m- icon-m-shangpinxiangqing-search" :style="{color: componentData.style.iconcolor}"></i>
                <span :style="{color: componentData.style.textcolor}">{{componentData.params.tiptext}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        name: "Credit",
        mixins: [mixin],
        components: {},
        props: {},
        data() {
            return {
                credit_perm: false
            }
        },
        computed: {
            credit_text() {
                if (this.$isPC) {
                    return '积分'
                }
                return this.$store.state.setting.systemSetting?.credit_text || '积分'
            },
            getPadding() {
                if (this.componentData.style.styletype === 'one') {
                    return `${this.px2rpx(this.componentData.style.margintop)} ${this.px2rpx(this.componentData.style.marginleft)} ${this.px2rpx(this.componentData.style.marginbottom)}`
                } else {
                    return `${this.px2rpx(72)} ${this.px2rpx(this.componentData.style.marginleft)} ${this.px2rpx(this.componentData.style.marginbottom)}`
                }
            },
            getBgColor() {
                if (this.componentData.style.styletype === 'one') {
                    return 'transparent'
                }
                if(this.componentData.params.temptype == 'color') {
                    return `linear-gradient(to bottom, ${this.componentData.style.tempcolor} 0%, ${this.componentData.style.tempcolor} ${this.px2rpx(332)}, transparent ${this.px2rpx(332)}, transparent 100%)`
                } else {
                    return `url(${this.$utils.mediaUrl(this.componentData.params.tempimg)}) no-repeat`
                }
            },
            getBgSize() {
                if (this.componentData.style.styletype === 'one') {
                    return ''
                }
                if(this.componentData.params.temptype == 'color') {
                    return ''
                } else {
                    return `100% ${this.px2rpx(332)}`
                }
            },
            getAvatar() {
                if (this.componentData.info?.avatar) {
                    return this.$utils.mediaUrl(this.componentData.info?.avatar)
                } else {
                    return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
                }
            },
            getBgStyle() {
                if(this.componentData.params.cardtype == 'color') {
                    return this.componentData.style.cardcolor
                } else {
                    if(this.componentData.params.cardimg) {
                        return `url(${this.$utils.mediaUrl(this.componentData.params.cardimg)})`
                    } else {
                        return ''
                    }
                }
            }
        },
        created() {
            this.handleCreditPerm()
        },
        mounted() {
        },
        methods: {
            async handleCreditPerm() {
                if (this.$isPC) {
                    this.credit_perm = true
                    return
                }
                await this.$api.creditShopApi.shopStatus({}, {errorToast: false}).then(res => {
                    if (res.error === 0) {
                        this.credit_perm = true
                    }
                });
            },
            loadImg() {
                return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
            },
            clickBtn(type) {
                // pc 阻止点击事件
                if(this.$isPC){ return }
                this.$emit('custom-event', {
                    target: 'credit/clickBtn',
                    data: {
                        type
                    }
                })
            },
            clickMemberInfo() {
                // pc 阻止点击事件
                if(this.$isPC){ return }
                this.$emit('custom-event', {
                    target: 'credit/clickMemberInfo',
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';

    .member-info {
        position: relative;
        border-radius: px2rpx(6);
        box-shadow: 0 0 px2rpx(17) rgba(0, 0, 0, 0.12);
        background-size: cover !important;
    }
    .avatar {
        align-items: flex-start;
    }
    .member-info .avatar-img {
        margin-right: px2rpx(8);
        width: px2rpx(60);
        height: px2rpx(60);
        border: 1px solid #fff;
        border-radius: 50%;
    }
    .member-info .nickname {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
    }
    .credit-info-box .credit {
        font-size: px2rpx(36);
        line-height: px2rpx(50);
    }
    .member-info .iconfont-def {
        font-size: px2rpx(18);
        margin-right: px2rpx(2);
    }
    .member-info .nav-btn {
        align-items: center;
    }
    .member-info .nav-btn .nav-item {
        justify-content: center;
        align-items: center;
    }
    .member-info .nav-btn .nav-item.van-hairline--right::after {
        border-right-color: #e6e7eb;
        border-style: solid;
    }
    .credit-info-box .member-info .nav-btn .iconfont-def {
        font-size: px2rpx(18);
        margin-right: px2rpx(2);
    }
    .credit-info-box .member-info.one {
        overflow: hidden;
    }
    .member-info.one .avatar-info {
        padding: px2rpx(35) 0 px2rpx(24) px2rpx(24);
        background-size: cover !important;
        overflow: hidden;
    }
    .member-info.one .nav-btn {
        height: px2rpx(44);
    }
    .member-info .rule-info {
        position: absolute;
        top: px2rpx(8);
        right: px2rpx(12);
        line-height: px2rpx(14);
        color: #fff;
        font-size: px2rpx(10);
    }
    .credit-info-box .member-info .rule-info .iconfont-m- {
        font-size: px2rpx(14);
    }
    .credit-info-box .member-info.two {
        padding-bottom: px2rpx(16);
    }
    .credit-info-box .member-info.two .avatar-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .credit-info-box .member-info.two .avatar-info .nickname {
        margin: px2rpx(8) 0;
        font-size: px2rpx(12);
    }
    .credit-info-box .member-info.two .avatar-info .avatar-img {
        margin: px2rpx(-20) 0 0;
    }
    .credit-info-box .member-info.two .nav-btn {
        margin-top: px2rpx(8);
        justify-content: center;
    }
    .credit-info-box .member-info.two .nav-item {
        padding: 0 px2rpx(11);
        /*width: px2rpx(100);*/
        height: px2rpx(28);
        border: 1px solid #fff;
        border-radius: px2rpx(28);
    }
    .credit-info-box .member-info.two .nav-item:last-child {
        margin-left: px2rpx(24);
    }
    .credit-info-box .search {
        align-items: center;
        padding-left: px2rpx(12);
        width: 100%;
        height: px2rpx(42);
        font-size: px2rpx(12);
        border-radius: px2rpx(6);
        box-shadow: 0 0 px2rpx(24) rgba(0, 0, 0, 0.08);
    }
    .credit-info-box .search .iconfont-m- {
        margin-right: px2rpx(6);
        font-size: px2rpx(16);
    }
</style>
