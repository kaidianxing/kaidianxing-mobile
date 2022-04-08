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
    <div>
        <!-- 绑定手机 -->
        <div class='bindmobile' :style='{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}' v-if='componentData&&componentData.id=="bindmobile"&&componentData.params.show!==false'>
            <div class="container" :style='{
            background:componentData.style.background,color:componentData.style.textcolor,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }'>
                <div class="main">
                    <p class="title" :style='{color:componentData.style.titlecolor}'>
                        <i class='custom-icon' :class="[componentData.params.iconclass]" :style='{color:componentData.style.iconcolor}'></i>{{componentData.params.title}}
                    </p>
                </div>

                <div class="btn" v-if='!componentData.params.mobile' @click="clickBtn" :style="{background:componentData.style.btnbackground,color:componentData.style.btntextcolor}">{{componentData.params.btntext || '立即绑定'}}</div>

            </div>
        </div>

        <!-- 退出登录 -->
        <div class='logout'  :style="{paddingTop:px2rpx(componentData.style.margintop),paddingBottom:px2rpx(componentData.style.marginbottom)}" v-if="componentData&&componentData.id=='logout'">
            <div class="container">
                <p class="logout2 btn"  :style="{background:componentData.style.maincolor,color:componentData.style.subcolor}" @click='logout'>退出登录</p>
            </div>
        </div>
    </div>

</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'bindmobile',
        methods: {
            clickBtn() {
                this.$emit('custom-event', {
                    target: 'bindmobile/clickBtn',
                    data: this.componentData
                })
            },
            changePW() {
                this.$emit('custom-event', {
                    target: 'logout/changePW',
                    data: this.componentData
                })
            },
            logout() {
                this.$emit('custom-event', {
                    target: 'logout/logout',
                    data: this.componentData
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .bindmobile .container {
        margin: 0 auto;
        display: flex;
        flex-wrap: nowrap;
        box-sizing: border-box;
        padding: px2rpx(10) rpx(12);
        border-radius: px2rpx(6);
    }
    .container .main {
        flex: 1;
    }
    .container .main .title {
        font-size: px2rpx(12);
        line-height: px2rpx(14);
        padding: px2rpx(7) 0 px2rpx(6);
        display: flex;
    }
    .main .title .custom-icon {
        font-size: px2rpx(14);
        width: px2rpx(14);
        height: px2rpx(14);
        line-height: px2rpx(14);
        text-align: center;
        margin: auto rpx(4) auto 0;
    }
    .bindmobile .btn {
        min-width: px2rpx(78);
        height: px2rpx(27);
        padding: px2rpx(8);
        border-radius: px2rpx(27);
        background: linear-gradient(159.36deg, $uni-color-primary 0%, #FF6F29 94.38%);
        color: #fff;
        font-size: px2rpx(12);
        line-height: px2rpx(12);
        text-align: center;
        margin: auto 0;
    }
    .container .text {
        font-size: px2rpx(12);
        line-height: px2rpx(18);
    }

    .logout {
        width: 100%;
        .container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .btn {
                width: px2rpx(351);
                height: px2rpx(40);
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                flex-direction: column;
                text-align: center;
                font-size: px2rpx(14);
                margin: 0 auto;
                border-radius: px2rpx(40);
            }
        }
    }
    .logout2 {
        background: linear-gradient(172.93deg, $uni-color-primary 0%, #FF6F29 94.38%);
    }
    .changePw {
        border: px2rpx(0.5) solid #ccc;
    }
</style>
