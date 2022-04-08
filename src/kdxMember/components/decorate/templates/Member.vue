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
    <div class="member" v-if="componentData && componentData.id == 'member'">
        <!--样式一-->
        <div
            class="member_temp1"
            v-if="componentData.params.style == 'default1'"
            :style="{
                background: getBgStyle,
                color: componentData.style.textcolor
            }"
        >
            <p class="bg-round" v-if="componentData.params.bgstyle === 'color'">
                <i
                    class="_i"
                    v-for="(item, index) in list"
                    :key="index"
                    :style="{
                        width: px2rpx(120 + 10 * index, 4),
                        height: px2rpx(120 + 10 * index, 4)
                    }"
                ></i>
            </p>
            <div class="top" @click="clickMemberInfo">
                <div class="img-box" :class="componentData.style.headstyle">
                    <img class="avart" :src="getAvator" @error="loadImg" />
                </div>
                <div class="body">
                    <p class="username" :style="{
                        color: componentData.style.nickcolor
                    }">{{ componentData.info.nickname || '登录/注册' }}
                </p>
                    <p
                        class="level"
                        :style="{
                            color: componentData.style.levelcolor,
                            background: componentData.style.levelbgcolor
                        }"
                        v-if="componentData.info.levelname"
                        @click.stop="toLevel"
                    >
                        <i :class="componentData.params.levelicon" :style="{
                             color: componentData.style.levelcolor
                        }"></i>
                        <span class="levelname">{{
                            componentData.info.levelname
                        }}</span>
                    </p>
                </div>
                <i
                    class="icon-right-btn"
                    :class="componentData.params.seticon"
                    :style="{
                        color: componentData.style.setbtncolor
                    }"
                    @click.stop="clickIcon"
                ></i>
            </div>
            <div class="btns" v-if="getFinance.length">
                <div class="btn" @click="clickBtn(finance.id)" :class="{
                    'yue': index<getFinance.length -1
                }" :key="finance.id" v-for="(finance,index) in getFinance" :style="{
                    borderColor: componentData.style.linecolor
                }">
                    <p class="num" :style="{
                        color: componentData.style.numcolor
                    }">
                        {{ finance.value }}
                    </p>
                    <p class="content" :style="{
                        color: componentData.style.titlecolor
                    }">
                        {{ finance.label}}
                    </p>
                </div>
            </div>
        </div>
        <!--样式二-->
        <div
            class="member_temp2"
            v-else-if="componentData.params.style == 'default2'">
            <!--            <div class="bg-rect"></div>-->
            <div class="bg-round">
                <div class="bg-round-content-color"
                     v-if="componentData.params.bgstyle === 'color'"
                     :style="{
                        background: getBgStyle,
                    }"
                ></div>
                <div class="bg-round-content-img"
                     v-else
                     :style="{
                        background: getBgStyle,
                    }"
                ></div>
            </div>
            <div class="container"
                 :style="{
                    background: getCardBgStyle,
                }"
            >
                <div class="rect"></div>
                <div class="container-box">
                    <div class="top" @click="clickMemberInfo">
                        <div
                            class="img-box"
                            :class="componentData.style.headstyle"
                        >
                            <img
                                    class="avart"
                                    :src="getAvator"
                                    @error="loadImg"
                            />
                        </div>
                        <div class="body">
                            <p
                                    class="username"
                                    :style="{
                                    color: componentData.style.nickcolor,
                                }"
                            >
                                {{ componentData.info.nickname || "登录/注册" }}
                            </p>
                            <p
                                    class="level"
                                    :style="{
                                    color: componentData.style.levelcolor,
                                    background:
                                        componentData.style.levelbgcolor,
                                }"
                                    v-if="componentData.info.levelname"
                                    @click.stop="toLevel"
                            >
                                <i
                                        :class="componentData.params.levelicon"
                                        :style="{
                                        color: componentData.style.levelcolor,
                                    }"
                                ></i>
                                <span class="levelname">{{
                                    componentData.info.levelname
                                }}</span>
                            </p>
                        </div>
                        <i
                            class="icon-right-btn"
                            :class="componentData.params.seticon"
                            :style="{
                            color: componentData.style.setbtncolor2,
                        }"
                            @click.stop="clickIcon"
                        ></i>
                    </div>
                    <div class="btns" v-if="getFinance.length">
                        <div
                                class="btn"
                                @click="clickBtn(finance.id)"
                                :class="{
                                yue: index < getFinance.length - 1,
                            }"
                                :key="finance.id"
                                v-for="(finance, index) in getFinance"
                                :style="{
                                borderColor: componentData.style.linecolor,
                            }"
                        >
                            <p
                                    class="num"
                                    :style="{
                                    color:  componentData.style.numcolor,
                                }"
                            >
                                {{ finance.value }}
                            </p>
                            <p
                                    class="content"
                                    :style="{
                                    color: componentData.style.titlecolor
                                }"
                            >
                                {{ finance.label }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'member',
    data() {
        return {
            list: [],
            webAppStatus: '0',
            getAppPermMap: '',
        }
    },
    computed: {
        canEnterMyShop(){
            if(this.$isPC){
                return true
            } else {
                return this.componentData.params.enterMyShop
            }
        },
        getAvator() {
            if (this.componentData.info?.avatar) {
                return this.$utils.mediaUrl(this.componentData.info?.avatar)
            } else {
                return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
            }
        },
        getBgStyle(){
            if(this.componentData.params.bgstyle == 'color') {
                return this.componentData.style.bgcolor
            } else {
                if(this.componentData.params.bgimg) {
                    return `url(${this.$utils.mediaUrl(this.componentData.params.bgimg)})`
                } else {
                    return ''
                }
            }
        },
        getCardBgStyle(){
            if(this.componentData.params.cardbgstyle == 'color') {
                return this.componentData.style.cardbgcolor
            } else {
                if(this.componentData.params.cardbgimg) {
                    return `url(${this.$utils.mediaUrl(this.componentData.params.cardbgimg)})`
                } else {
                    return ''
                }
            }
        },
        getFinance(){
            let arr = []
            let {textmoney,money,textcredit,credit,coupon} = this.componentData.info;
            let { financeBtn } = this.componentData.params
            let obj = {
                '0': {
                    id: 0,
                    label: textmoney || '余额',
                    value: this.formatMoney(money)
                },
                '1': {
                    id: 1,
                    label: textcredit || '积分',
                    value: this.formatCredit(credit)
                },
                '2': {
                    id: 2,
                    label: '优惠券',
                    value: this.formatCredit(coupon)
                }
            }

            if(typeof financeBtn === 'undefined'  && !this.$isPC){
                financeBtn = ['0', '1']
            }
            financeBtn.forEach(item=>{
              obj[item] &&  arr.push(obj[item])
            })
            return arr.sort((a,b)=>a.id-b.id)
        }

    },
    beforeMount() {
        this.list = new Array(26).fill('')
        
    },
    methods: {
        clickToMyShop(){
            this.$emit('custom-event', {
                target: 'member/clickToMyShop',
                data: {
                    value: this.componentData
                }
            })
        },
        formatMoney(value) {
            if (parseFloat(value) === 0) {
                return '￥0'
            }
            if (!value) {
                return '￥0'
            }
            return '￥' + value
        },
        formatCredit(value) {
            if (parseFloat(value) === 0) {
                return 0
            }
            if (!value) {
                return 0
            }
            return value
        },
        clickIcon() {
            this.$emit('custom-event', {
                target: 'member/clickIcon',
                data: {
                    value: this.componentData
                }
            })
        },
        toLevel() {
            this.$emit('custom-event', {
                target: 'member/clickLevelInfo',
                data: {
                    value: this.componentData
                }
            })
        },
        clickMemberInfo() {
            this.$emit('custom-event', {
                target: 'member/clickMemberInfo',
                data: {
                    value: this.componentData
                }
            })
        },
        // 
        clickBtn(type) {
            let typesObj = {
                '0': 'money',
                '1': 'credit',
                '2': 'coupon',
            }
            this.$emit('custom-event', {
                target: 'member/' + typesObj[type],
                data: {
                    value: this.componentData
                }
            })
        },
        loadImg() {
            return this.$utils.staticMediaUrl('decorate/avatar_mobile.png')
        }
    }
}
</script>

<style lang="scss" scoped>
@import './decorate.scss';
.member {
    .member_temp1 {
        width: px2rpx(375);
        margin: 0 auto;
        position: relative;
        background: #ff3c29;
        overflow: hidden;
        background-size: cover !important;
        .bg-round {
            position: absolute;
            top: px2rpx(41);
            left: 0;
            transform: translate(-50%, -50%);
            width: px2rpx(726);
            height: px2rpx(726);
            z-index: 0;
            ._i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
        }
        .top {
            padding: px2rpx(16) px2rpx(12) px2rpx(24);
        }
    }

    .member_temp1,
    .member_temp2 {
        .top {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            z-index: 1;
        }
        .img-box {
            width: px2rpx(50);
            height: px2rpx(50);
            flex-shrink: 0;
            overflow: hidden;
            box-sizing: border-box;
            border: px2rpx(0.5) solid $uni-border-color;
            margin-right: px2rpx(10);
            border-radius: 50%;
            &.radius {
                border-radius: px2rpx(6);
            }
            .avart {
                width: 100%;
                height: 100%;
            }
        }
        .body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex: 1;
            font-family: PingFang SC;
            font-style: normal;
            .username {
                font-size: px2rpx(16);
                line-height: px2rpx(16);
                padding: px2rpx(3) 0;
                font-weight: bold;
            } 
            .level {
                margin-top: px2rpx(4);
                font-size: px2rpx(8);
                line-height: px2rpx(8);
                //padding: 0 px2rpx(4) 0 0;
                background: #31312D;
                border-radius: px2rpx(10);
                text-align: center;
                display: inline-block;
                color: #F2DCAC;
                .levelname {
                    font-size: px2rpx(11);
                    line-height: px2rpx(14);
                    padding: px2rpx(2) px2rpx(6) px2rpx(2) 0;
                    //vertical-align: px2rpx(1);
                    display: inline-block;
                    vertical-align: middle;
                }
                > i {
                    flex-shrink: 0;
                    font-size: px2rpx(14);
                    //width: px2rpx(18);
                    //height: px2rpx(18);
                    text-align: center;
                    line-height: px2rpx(18);
                    padding-left: px2rpx(4);
                    padding-right: px2rpx(2);
                    vertical-align: middle;
                }
            }
        }
        .btn-right{
            padding:0 px2rpx(10);
            height: px2rpx(24);
            border: px2rpx(1) solid #FFFFFF;
            box-sizing: border-box;
            border-radius: px2rpx(19);
            margin: auto 0;
            text-align: center;
            display:flex;
            justify-content: center;
            box-sizing: border-box;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: px2rpx(12);
            line-height: px2rpx(22);
        }
        .icon-right,.icon-left {
            flex-shrink: 0;
            font-size: px2rpx(14);
            width: px2rpx(14);
            height: px2rpx(14);
            text-align: center;
            line-height: px2rpx(14);
            margin: auto 0;
        }
        .icon-left{
            line-height: px2rpx(16);
            font-size: px2rpx(16);
            width: px2rpx(16);
            height: px2rpx(16);
            margin:auto 0;
        }
    }
    .icon-right-btn{
        flex-shrink: 0;
        font-size: px2rpx(20);
        width: px2rpx(20);
        height: px2rpx(20);
        text-align: center;
        line-height: px2rpx(20);
        margin: auto 0;
    }
    .member_temp2{
        .btn-right{
            margin-top:px2rpx(10);
        } 
    }
    .btns,
    .footer {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        z-index: 1;
        height: px2rpx(50);
        padding: px2rpx(8) 0 px2rpx(8);
        font-family: PingFang SC;
        font-style: normal;
        .btn {
            width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            text-align: center;
            margin: 0;
            justify-content: space-between;
            padding-top: px2rpx(-4);
        }
        .yue {
            border-right: px2rpx(0.5) solid #fff;
        }
        .num {
            font-weight: bold;
            font-size: px2rpx(14);
            line-height: px2rpx(12);
            margin: 0 auto px2rpx(8);
        }
        .content {
            font-size: px2rpx(12);
            line-height: px2rpx(12);
            margin: 0 auto 0;
        }
    }

    .member_temp2 {
        width: px2rpx(375);
        height: px2rpx(190);
        padding: px2rpx(16) px2rpx(12) px2rpx(8);
        position: relative;

        .bg-rect,
        .bg-round {
            z-index: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: px2rpx(375);
            /*background: linear-gradient(132.57deg, #ff3c29 0%, #ff6f29 94.38%);*/
        }

        .bg-rect {
            height: px2rpx(60);
        }
        .bg-round {
            height: px2rpx(190);
            .bg-round-content-color {
                height: px2rpx(120);
                border-radius:0 0 50% 50%;
                background: linear-gradient(132.57deg, #ff3c29 0%, #ff6f29 94.38%);
            }
            .bg-round-content-img {
                height: px2rpx(190);
                background-size: cover !important;
            }
        }
        .container {
            position: relative;
            padding: px2rpx(16) 0;
            height: px2rpx(166);
            background: #ffffff;
            border-radius: px2rpx(6);
            overflow: hidden;
            background-size: cover !important;

            .rect {
                position: absolute;
                border-radius: px2rpx(25);
                width: px2rpx(200);
                height: px2rpx(200);
                left: px2rpx(130);
                top: px2rpx(-153);
                transform: rotate(30deg);
                background: rgba(33, 33, 33, 0.05);
            }

            .container-box {
                .top {
                    align-items: flex-start;
                    height: px2rpx(92);
                    padding: 0 px2rpx(12);

                    .icon-right {
                        margin: 0;
                    }
                }
                .btns {
                    .num,
                    .content {
                        color: #212121;
                    }
                }
            }
        }
    }

}
</style>
