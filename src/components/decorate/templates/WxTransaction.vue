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
    <div>
        <!-- #ifdef MP-WEIXIN -->
        <div class='wxTransaction'
             :style="{ padding:`${px2rpx(componentData.style.margintop)}  ${px2rpx(componentData.style.marginleft)}  ${px2rpx(componentData.style.marginbottom)} `}"
             v-if='componentData&&componentData.id=="wxTransaction"'>
            <div style="overflow: hidden;background-size: cover;" :style="{
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
             background: getContentBackground}">
                <div class="container space-between align-center">
                    <div class="flex-column">
                        <div class="flex">
                            <div class="status flex align-center"
                                 :class="{gray:liveStatus==3 && !appoint && live}"
                                 :style="{color: componentData.style.statuscolor,background: componentData.style.statusBgcolor}">
                            <span
                                class="iconfont-m-"
                                :class="appointText.icon"
                                :style="{color: componentData.style.statuscolor}"
                                v-if="appoint && liveStatus!=2"
                            ></span>
                                <span
                                    class="iconfont-m-"
                                    :class="liveText.icon"
                                    :style="{color: componentData.style.statuscolor}"
                                    v-if="(!appoint && live) || liveStatus==2"
                                ></span>
                                <template v-if="(!appoint && live) || liveStatus==2">
                                    {{ liveText.title }}
                                </template>
                                <template v-if="appoint && liveStatus!=2">
                                    {{ appointText.title }}
                                </template>
                            </div>
                            <div class="title" :style="{color: componentData.style.titlecolor}">{{ nickname }}的直播</div>
                        </div>
                        <div class="time"
                             v-if="startTime && liveStatus!=2"
                             :style="{color: componentData.style.advancecolor}">
                            {{ startTime }} 开播
                        </div>
                    </div>
                    <button class="btn"
                            :class="{gray:liveStatus==3}"
                            :style="{color: componentData.style.btncolor,background: componentData.style.btnBgcolor}"
                            @click="goLive"
                            v-if="(!appoint && live) || liveStatus==2">
                        {{ liveText.btnText }}</button>
                    <!-- 预约直播 -->
                    <div class="btn"
                         :disabled="appointStatus==2"
                         :class="{gray:appointStatus==2}"
                         :style="{color: componentData.style.btncolor,background: componentData.style.btnBgcolor}"
                         v-if="appoint && liveStatus!=2"
                         @click="goAppoint">
                        {{ appointText.btnText }}</div>
                </div>
            </div>
        </div>
        <!-- #endif -->
    </div>
</template>

<script>
import mixin from './mixin.js'
import {mapState} from "vuex";
export default {
    mixins: [mixin],
    name: 'wxTransaction',
    data() {
        return {
            live: false, //是否可看直播
            appoint: false, //是否可预约
            noticeId: '', //预约直播id
            startTime: '', //直播时间
            nickname: '', //视频号昵称
            appointStatus: '', //是否预约
            appointText: {}, // 预约处理
            liveText: {}, // 直播处理
            liveStatus: '', //直播状态
        }
    },
    computed: {
        getContentBackground() {
            let bgStyle = this.componentData.params.bgstyle;
            if (bgStyle === 'color') {
                return this.componentData.style.bgcolor
            }
            if (bgStyle === 'img' && this.componentData.params.bgimg) {
                return `url(${this.$utils.mediaUrl(this.componentData.params.bgimg)})`
            } else {
                return ''
            }
        },
    },
    async mounted() {
            await this.formatParam();
            await this.formatLive();
    },
    methods: {
        // 去直播间
        goLive() {
            wx.openChannelsLive({ finderUserName: this.componentData.params.video_number_id })
        },
        // 预约直播
        goAppoint() {
            wx.reserveChannelsLive({ noticeId: this.noticeId })
        },
        // 时间处理 02:00:00
        formatTime(m){
            return m<10?'0'+m:m
        },
        // 日期处理
        formatDate(time) {
            let m = time.getMonth()+1, d = time.getDate(), h = time.getHours(), mm = time.getMinutes(), s = time.getSeconds();
            return `${m}月${d}日 ${this.formatTime(h)}:${this.formatTime(mm)}:${this.formatTime(s)}`
        },
        /*
        * 预约状态文案
        * status 状态值
        * type 类型
        * */
        formatText(status, type) {
            if(type == 'appoint') {
                // 0可预约 1取消 2已用
                switch (status) {
                    case 0:
                        this.appointText = {
                            title: '预告',
                            icon: 'icon-m-a-Ellipse365',
                            btnText: '预约直播'
                        }
                        break;
                    case 2:
                        this.appointText = {
                            title: '已预约',
                            icon: 'icon-m-a-Ellipse365',
                            btnText: '已预约'
                        }
                        break;
                }
            }else {
                // 2直播中 3直播结束
                switch (status) {
                    case 2:
                        this.liveText = {
                            title: '直播中',
                            icon: 'icon-m-a-Ellipse366',
                            btnText: '观看直播'
                        }
                        break;
                    case 3:
                        this.liveText = {
                            title: '已结束',
                            icon: 'icon-m-a-Ellipse366',
                            btnText: '已结束'
                        }
                        break;
                }
            }

        },
        // 无预告 - 直接进入直播
        formatLive() {
            return new Promise(resolve =>{
                wx.getChannelsLiveInfo({
                    finderUserName: this.componentData.params.video_number_id,
                    success: (res) => {
                        console.log('这是什么情况',res)
                        this.live = true;
                        this.liveStatus = res.status;
                        this.nickname = res.nickname;
                        this.formatText(res.status, 'live');
                        resolve()
                    },
                    fail: (res) => {
                        this.live = false;
                        console.log('这是什么情况2',res)
                        resolve()
                    }
                })
            })
        },
        // 预约
        formatParam() {
            return new Promise((resolve) =>{
                // if(!wx.getChannelsLiveNoticeInfo) {
                //     resolve()
                //     return
                // }
                wx.getChannelsLiveNoticeInfo({
                    finderUserName: this.componentData.params.video_number_id,
                    success: (res) => {
                        if(res.reservable) {
                            console.log('这是什么情况3',res)
                            // 是否可预约
                            this.appoint = true;
                            this.noticeId = res.noticeId;
                            this.startTime = this.formatDate(new Date(res?.startTime*1000));
                            this.nickname = res.nickname;
                            this.appointStatus = res.status;
                            this.formatText(res.status, 'appoint');
                        }else {
                            this.appoint = false
                        }
                        resolve()
                    },
                    fail: (res) => {
                        console.log('这是什么情况4',res)
                        this.appoint = false;
                        resolve()
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import './decorate.scss';
@import '../templates-shim/followbar.scss';
.wxTransaction {
    width: 100%;
    .container {
        height: px2rpx(68);
        padding: px2rpx(12) px2rpx(16);
        display: flex;
    }
    .status {
        height: px2rpx(20);
        font-size: px2rpx(10);
        padding: px2rpx(2) px2rpx(6);
        border-radius: px2rpx(4);
        margin-right: px2rpx(8);
        .iconfont {
            font-size: px2rpx(4);
            transform: scale(0.6);
        }
        .iconfont-m- {
            font-size: px2rpx(6);
            margin-right: px2rpx(4);
        }
        &.gray {
            background: #EEEEEE !important;
            color: #8F8F8F !important;
        }
    }
    .title {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        font-weight: 600;
    }
    .time {
        margin-top: px2rpx(7);
        font-size: px2rpx(12);
        line-height: px2rpx(17);
    }
    .btn {
        font-size: px2rpx(12);
        font-weight: 600;
        width: px2rpx(76);
        height: px2rpx(28);
        line-height: px2rpx(28);
        border-radius: px2rpx(14);
        text-align: center;
        &.gray {
            background: #EEEEEE !important;
            color: #8F8F8F !important;
        }
    }
}
</style>
