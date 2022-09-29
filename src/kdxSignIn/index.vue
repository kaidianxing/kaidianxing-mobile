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
    <page-box>
        <view class="sign-main" :style="disabledScroll ? 'height: 100vh' : ''">
            <view class="sign-main_tip" @click="navSignRule">说明</view>
            <view class="sign-main_signBox">
                <img class="sign-main_signBg" :src="signBg" alt="">
                <view class="sign-main_signContent">
                    <!-- 今日签到-->
                    <view class="sign-main_signNm">
                        <text class="sign-main_nmTitle" v-if="!isTodaySign || activityStop">签到奖励</text>
                        <text class="sign-main_nmTitle" v-else>明日签到奖励</text>
                        <!--是否显示大礼包-->
                        <template v-if="!continuity_status">
                            <!-- 奖励小于等于5个字符-->
                            <text v-if="integral && integral.length < 4"
                                  class="sign-main_subtitle">
                                {{ integral || '-' }}
                            </text>
                            <!-- 奖励超过5个字符-->
                            <text v-else class="sign-main_subtitleL">{{
                                    integral || '-'
                                }}
                            </text>
                        </template>
                        <template v-else>
                            <text class="sign-main_subtitle--gift"> 大礼包</text>
                        </template>
                        <text class="sign-main_creditName" v-if="!continuity_status">{{
                                credit_text
                            }}
                        </text>
                        <text class="sign-main_creditName" v-else></text>
                    </view>
                    <!-- 明日签到提醒-->
<!--                    <view v-else class="sign-main_signNm">-->
<!--                        <text class="sign-main_nmTitle">明日签到奖励</text>-->
<!--                        &lt;!&ndash;是否显示大礼包&ndash;&gt;-->
<!--                        <template v-if="!tomorrowReward.continuity_status">-->
<!--                            &lt;!&ndash; 奖励小于等于5个字符&ndash;&gt;-->
<!--                            <text v-if="pageSetup.day_reward && pageSetup.day_reward.length < 4"-->
<!--                                  class="sign-main_subtitle">-->
<!--                                &lt;!&ndash;因为有 当日重置活动的原因 所以在明日奖励中判断是显示今日的积分 还是 明日的积分&ndash;&gt;-->
<!--                                <template v-if="ifShowToday"> {{ todayReward.credit || '-' }}</template>-->
<!--                                <template v-else> {{ tomorrowReward.credit || '-' }}</template>-->
<!--                            </text>-->
<!--                            &lt;!&ndash; 奖励超过5个字符&ndash;&gt;-->
<!--                            <text v-else class="sign-main_subtitleL">-->
<!--                                <template v-if="ifShowToday"> {{ todayReward.credit || '-' }}</template>-->
<!--                                <template v-else> {{ tomorrowReward.credit || '-' }}</template>-->
<!--                            </text>-->
<!--                        </template>-->
<!--                        <template v-else>-->
<!--                            <text class="sign-main_subtitle&#45;&#45;gift"> 大礼包</text>-->
<!--                        </template>-->
<!--                        <text class="sign-main_creditName" v-if="!tomorrowReward.continuity_status">{{-->
<!--                                credit_text-->
<!--                            }}-->
<!--                        </text>-->
<!--                        <text class="sign-main_creditName" v-else></text>-->

<!--                    </view>-->
                    <!--                    活动停止-->
                    <view v-if="activityStop" @click="onActivityStop"
                          class="sign-main_signBt sign-main_signBt--success">
                        今日签到
                    </view>
                    <!--                    活动未停止-->
                    <view v-else class="sign-main_signBt " :class="[{'sign-main_signBt--success':isTodaySign }]"
                          @click="clickSignUp">
                        今日签到
                    </view>
                </view>
            </view>

            <!--   日历     -->
            <Calendar ref="Calendar" :sendYear="toYear" :sendMonth="toMonth" :isRemind="isRemind"
                      :dataSource="signData" :rewardSource="rewardData" :ShowSMS="SMS_Show" :activityStop="activityStop"
                      @dateChange="getData" @clickChange="signChange" @receiveReward="receiveReward"
                      @setDailyReminder="setDailyReminder">
                <template v-slot:start>
                    <text class="sign-main_activeTime">{{ start_time || '' }}</text>
                </template>
                <template v-slot:end>
                    <text class="sign-main_activeTime">{{ end_time || '' }}</text>
                </template>
            </Calendar>

            <!-- 标题跳转 -->
            <button @click="navTitlePage" v-if="pageSetup.activity_link && pageSetup.activity_link ==='1' "
                    :open-type="pageSetup.link_url=='wx_service'?'contact':''"
                    class="sign-main_navBox flex-between align-center">
                <view class="sign-main_navTitle">{{ pageSetup.activity_title || '' }}</view>
                <view class="sign-main_navSubtitle flex align-center">
                    <text>{{ pageSetup.content || "查看" }}</text>
                    <i class="iconfont-m- icon-m-right"></i>
                </view>
            </button>
            <!-- 签到成功 补签成功 弹窗-->
            <signSuccess :popupShow="popupShow" :noticeInfo="noticeInfo" :dayReward="pageSetup.day_reward"
                         :ponitNum="integral" @cancel="popupHide"></signSuccess>
            <!-- 连续签到弹窗-->
            <signContinuous :popupShow="popupShow" :rewardDetail="rewardDetail" @getReward="popupGetReward"
                            @cancel="popupHide"></signContinuous>
            <!-- 补签确认-->
            <signFill :popupShow="popupShow" :supplementCount="supplementCount" @fillClick="fillClick"
                      @cancel="popupHide"></signFill>
            <!-- 补签次数不足-->
            <signFillNumFail :popupShow="popupShow" @cancel="popupHide"></signFillNumFail>
            <!-- 积分不足-->
            <signFillPointFail :popupShow="popupShow" @cancel="popupHide"></signFillPointFail>
        </view>
    </page-box>
</template>

<script>
import Calendar from './components/Calendar'
import signSuccess from "./components/popUp/signSuccess";
import signFill from "./components/popUp/signFill";
import signFillNumFail from "./components/popUp/signFillNumFail";
import signFillPointFail from "./components/popUp/signFillPointFail";
import signContinuous from "./components/popUp/signContinuous";

export default {
    name: "SignInIndex",
    components: {
        Calendar,
        signSuccess,
        signFill,
        signFillNumFail,
        signFillPointFail,
        signContinuous
    },
    data() {
        return {
            userInfo: {},//用户信息
            activityStop: false,//没有活动
            disabledFillSign: '0',//0禁止补签 1可以补签
            ifClickSign: true,//节流
            signBg: this.$utils.staticMediaUrl('SignIn/signBg.png'),
            toYear: parseInt(new Date().getFullYear()), //本年
            toMonth: parseInt(new Date().getMonth() + 1), //本月
            toDay: parseInt(new Date().getDate()), //本日
            cur_year: '',//当前显示的年
            cur_month: '',//当前显示的月
            signData: [],//已签到天数
            supplementCount: {},//补签次数 补签消耗积分
            start_time: '',
            end_time: '',
            ifShowToday: false, //true显示当日积分  false显示明日积分
            todayReward: {
                credit: ''
            },//今日
            tomorrowReward: {},//明日
            // rewardData: {
            //     count: '',//奖励总数量
            //     difference: '',//用户还差XX天能领取下次奖励
            //     info: [],//奖励列表
            //     reward_num: '',//用户已领取次数
            //     reward_info: []//可领取的列表
            // },//连续奖励
            rewardData:[],
            tempDay: '',//当前要签到的日期
            isTodaySign: false,//当日是否签到
            disabledScroll: false,//禁止滚动
            rewardDetail: {},//连签奖励详情
            pageSetup: {},//跳转标题 页面名称
            isRemind: '0',//每日签到提醒
            noticeInfo: {},//模板消息
            SMS_Show: false,//短信提醒
            popupShow: {
                onceShow: false,//单次签到成功
                retroactiveSign: false,//补签成功
                continuousShow: false,//连续签到
                fillShow: false,//是否补签
                fillNumFailShow: false,//补签次数不足
                fillPointFailShow: false,//积分不足
            },
            continuity_status: false,//是否展示大礼包字样
            integral:'',//日签奖励积分
            activityId:''
        }
    },
    async created() {
        this.userInfo = this.$store.state.login.userInfo || {}
        // #ifndef MP-TOUTIAO
        this.$loading.showLoading()
        // #endif
        //签到天数
        await this.getData(this.toYear + "-" + this.toMonth);
        await this.getOnLoadData()


    },
    onPullDownRefresh() {
        this.getData(this.cur_year + "-" + this.cur_month);
        this.getOnLoadData()
        setTimeout(function () {
            uni.stopPullDownRefresh();
        }, 1000);
    },
    watch: {

        popupShow: {
            handler() {//监听禁止滚动
                let bl = false
                for (let key in this.popupShow) {
                    if (this.popupShow[key] === true) {
                        bl = true
                        break;
                    }
                }
                bl ? this.disabledScroll = true : this.disabledScroll = false
            },
            deep: true

        },
    },
    computed: {
        credit_text() {
            return (this.$store.state.setting?.systemSetting?.credit_text || '积分')
        },
        credit_textLength() {
            let text = this.$store.state.setting?.systemSetting?.credit_text || '积分'
            return text.length
        }
    },
    methods: {
        dateChange(y, m) {
            this.cur_year = y
            this.cur_month = m
            this.getData(y, m)
        },

        navSignRule() {
            if (this.activityStop) {
                this.$message('无进行中的活动')
                return
            }
            this.$Router.push({path: '/kdxSignIn/signRule'})
        },
        navTitlePage() {
            if (this.pageSetup.link_url && this.pageSetup.link_url != 'wx_service') {
                this.$Router.push({path: this.pageSetup.link_url})
            }
        },
        popupHide(reload = false) {
            if (reload) {
                this.getOnLoadData() //刷新连签奖励
            }
            this.popupShow = {
                onceShow: false,//单次签到成功
                retroactiveSign: false,//补签成功
                continuousShow: false,//连续签到
                fillShow: false,//是否补签
                fillNumFailShow: false,//补签次数不足
                fillPointFailShow: false,//积分不足
            }
        },
        clickSignUp() {
            if (!this.isTodaySign) {//如果未签到
                if (this.ifClickSign) {
                    this.ifClickSign = false
                    this.$refs.Calendar.sign()
                    setTimeout(() => {
                        this.ifClickSign = true
                    }, 1000)
                }
            } else {
                this.$message('今日已签到')
            }
        },
        signChange(day, type) { //type=0补签，type=1当日签到
            if(this.$store.state.login.isLogin === false){
                this.$store.commit('login/setModal', true)
                return
            }
            if (this.activityStop) return
            this.tempDay = day    // 2021-11-01

            // 活动日期外不可补签  ios 兼容格式
            let clickDay = day.replace(/\.|\-/g, '/')
            clickDay = new Date(day).getTime()
            let startDay = this.start_time.replace(/\.|\-/g, '/')
            startDay = new Date(this.start_time).getTime()
            if (clickDay < startDay) {
                this.$message('活动日期外不可签到')
                return
            }
            // console.log("在模版页签到了", day, this.signData, type);
            if (type == 1) {//签到
                this.$api.signInApi.clickSignIn({
                    uid: this.userInfo.id || ''
                }).then(res => {
                    console.log(res, '签到结果')
                    if (res.error === 0) {
                        this.getData(this.cur_year + "-" + this.cur_month);
                        this.isTodaySign = true
                        this.popupShow.onceShow = true
                        this.signData.push(day)
                    } else {
                        this.$message(res.message)
                    }

                })

            }
            if (type === 0) {//补签
                if (this.disabledFillSign === '0') return //补签未开始
                this.$api.signInApi.getSupplement({
                    id: this.activityId || ''
                }, {errorToast: false}).then(res => {
                    // console.log(data, '补签次数----------')
                    if (res.error === 0) {
                        this.supplementCount = res.data
                        this.popupShow.fillShow = true//打开补签消耗提醒页
                    } else {
                        this.popupShow.fillNumFailShow = true
                        // this.$message('补签次数不足')
                    }

                })

            }

        },
        fillClick() {//补签
            this.$api.signInApi.supplementSignIn({
                uid: this.userInfo.id || '',
                time: this.tempDay,

            }, {errorToast: false}).then(res => {
                this.popupHide()
                console.log('补签结果', res)
                if (res.error === 0) {
                    this.signData.push(this.tempDay);
                    this.popupShow.retroactiveSign = true
                    this.getOnLoadData()
                    this.getData(this.cur_year + "-" + this.cur_month);
                } else {
                    // this.$message(res.message)
                    if (res.error == '750206') {//积分不足
                        this.popupShow.fillPointFailShow = true
                    } else if (res.error == "750205") { //次数不足
                        this.popupShow.fillNumFailShow = true
                    } else {
                        this.$message(res.message)
                    }
                }
            })

        },
        getData(val) {//获取签到天数
            let y = this.getFullStr(val.split('-')[0]);
            let m = this.getFullStr(val.split('-')[1]);
            let d = this.getFullStr(this.toDay)
            let lastD = this.getThisMonthDays(y, m)//一共多少天
            // -----------签到天数---------------
            this.$api.signInApi.getSignInfo({
                uid: this.userInfo.id || '',
                start_time: `${y}-${m}-01`,
                end_time: `${y}-${m}-${lastD}`
            },{cache: 20}).then(date => {
                console.log(date,"date-------------------------------")
                this.cur_year = y
                this.cur_month = m
                if (y == this.toYear && m == this.getFullStr(this.toMonth)) {//如果是本年本月的
                    this.checkSignIn(date?.list)//检查今日是否签到
                }
                this.signData = date?.list || [];
                this.ifShowToday = date?.status || false  //true显示当日积分  false显示明日积分
                this.$refs.Calendar.onJudgeSign();//匹配是否签到
            })

        },

        async getOnLoadData() {
            await this.getActivity()//当前进行中的活动信息
            // await this.getRewards()//获取连签奖励
        },
        getActivity() {
            // -------当前进行中的活动信息 及时间配置---------
            // this.$api.signInApi.getActivity({
            //     uid: this.userInfo.id,
            // },{cache: 20}).then(res => {
            //     if (res.error === 0) {
            //         console.log(res, '当前进行中的活动')
            //         this.start_time = this.getSubTime(res.activity.start_time)//活动开始时间
            //         this.end_time = this.getSubTime(res.activity.end_time)
            //         this.todayReward = {} //今日
            //         this.todayReward = res.day || {} //今日
            //         this.tomorrowReward = {}//明日
            //         this.tomorrowReward = res.tomorrow || {}//明日
            //         let ext_field = JSON.parse(res.activity.ext_field)
            //         this.pageSetup = ext_field.page_setup || {}//跳转标题
            //         this.pageSetup.day_reward = Number(ext_field.day_reward).toString() || ''
            //         this.disabledFillSign = ext_field.supplementary.status || '0'//禁止补签
            //         this.isRemind = res.is_remind || '0' //每日签到提醒
            //         this.noticeInfo = res.notice || {}//模板消息
            //         this.SMS_Show = res.notice_status || false//短信提醒是否显示
            //         if (ext_field?.page_setup?.link_name) {
            //             uni.setNavigationBarTitle({
            //                 title: ext_field.page_setup.link_name || '积分签到'
            //             });
            //         }
            //     } else {
            //         this.activityStop = true //没有活动
            //     }
            this.$api.signInApi.getDetail({
                uid: this.userInfo.id,
            },{cache: 20}).then(res => {
                if (res.error === 0) {
                    console.log(res, '当前进行中的活动')
                    this.activityId = res.data.activity.id
                    this.start_time = this.getSubTime(res.data.activity.start_time)//活动开始时间
                    this.end_time = this.getSubTime(res.data.activity.end_time)
                    // this.todayReward = {} //今日
                    // this.todayReward = res.day || {} //今日
                    // this.tomorrowReward = {}//明日
                    // this.tomorrowReward = res.tomorrow || {}//明日
                    this.continuity_status = res.data.continuity_status
                    this.isTodaySign = res.data.is_sign
                    this.integral = res.data.integral
                    let ext_field = res.data.activity.ext_field
                    this.pageSetup = ext_field.page_setup || {}//跳转标题
                    this.pageSetup.day_reward = Number(ext_field.day_reward).toString() || ''
                    this.disabledFillSign = ext_field.supplementary.status || '0'//禁止补签
                    this.isRemind = res.data.is_remind || '0' //每日签到提醒
                    // this.noticeInfo = res.  || {}//模板消息
                    this.SMS_Show = res.data.notice_status || false//短信提醒是否显示
                    if (ext_field?.page_setup?.link_name) {
                        uni.setNavigationBarTitle({
                            title: ext_field.page_setup.link_name || '积分签到'
                        });
                    }
                    this.getRewards()
                } else {
                    this.activityStop = true //没有活动
                }
                // #ifndef MP-TOUTIAO
                this.$loading.hideLoading()
                // #endif
            })
        },
        getRewards() {
            console.log(this.activityId,"111111111111111-activityId");
            // -----------连续签到奖励展示---------------
            this.$api.signInApi.getRewards({
                id: this.activityId
            }, {errorToast: false,cache: 20}).then(res => {
                if (res.error === 0) {
                    this.rewardData = {}
                    this.rewardData = res.data
                    console.log(this.rewardData, '连签信息 更新成功----------')
                }
            })
        },
        receiveReward(item) {//领取连签礼包
            if (this.activityStop) return
            this.rewardDetail = item
            this.popupShow.continuousShow = true

        },
        popupGetReward() {
            this.$api.signInApi.receiveReward({
                uid: this.userInfo.id,
                id: this.rewardDetail.id
            }).then(res => {
                if (res.error === 0) {//领取成功
                    this.rewardDetail.status = ''
                    this.rewardDetail.status = '1' //已领取
                    setTimeout(() => {
                        this.getRewards()//刷新连签奖励
                    }, 20)

                    if (Array.isArray(res.message)) {//库存不足
                        this.$message(res.message[0].data)
                    }
                } else {
                    this.$message(res.message)
                }
            })
        },
        checkSignIn(dateList) {
            let today = `${this.toYear}-${this.getFullStr(this.toMonth)}-${this.getFullStr(this.toDay)}`
            if (dateList.indexOf(today) > -1) {//当日是否已经签到
                this.isTodaySign = true
            }
        },
        setDailyReminder(status) {//开启每日签到提醒
            if (this.activityStop) {
                this.$message('无进行中的活动')
                return
            }
            this.$api.signInApi.setDailyReminder({
                remind_status: status, //0 关闭 1 开启
            },{errorToast: false}).then(res => {
                if (res.error === 0) {
                    this.isRemind = status
                } else {//防止接口失败 但前端的开关已经打开了
                    this.$message(res.message)
                    this.isRemind = ''
                    setTimeout(() => {
                        status == '1' ? this.isRemind = '0' : this.isRemind = '1'
                    }, 20)
                }
            })
        },
        // 获取当月共多少天
        getThisMonthDays(year, month) {
            let day = new Date(year, month, 0).getDate()
            day = day < 10 ? '0' + day : day
            return day
        },
        getFullStr(num) {
            if (num) {
                num = parseInt(num)
                return num < 10 ? '0' + num : num
            }
        },
        getSubTime(time) {
            if (time && time.length > 10) {
                return time.substr(0, 10).replace(/-/g, '.')
            } else if (time.length === 10) {
                return time.replace(/-/g, '.')
            } else {
                return ''
            }
        },
        onActivityStop() {
            this.$message('无进行中的活动')
        }
    }
}
</script>
<style>
page {
    background: #FF5C00;
}
</style>
<style scoped lang="scss">
.sign-main {
    overflow: hidden;

    &_ {
        &tip {
            position: absolute;
            z-index: 10;
            right: 0;
            border-top-left-radius: px2rpx(12);
            border-bottom-left-radius: px2rpx(12);
            top: px2rpx(20);
            width: px2rpx(48);
            height: px2rpx(24);
            background: linear-gradient(110.78deg, #FEE08A 7.33%, #FBC11E 86.7%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: px2rpx(12);
            color: $uni-color-primary;
            font-weight: 500;
        }

        &signBox {
            position: relative;
            padding-top: px2rpx(25);
            padding-bottom: px2rpx(12);

        }

        &signContent {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        &signBg {
            position: absolute;
            width: px2rpx(298);
            height: px2rpx(194);
            left: 50%;
            transform: translateX(-50%);
            top: 0;
        }

        &signNm {
            flex-shrink: 0;
            box-sizing: border-box;
            width: px2rpx(120);
            height: px2rpx(120);
            border-radius: 50%;
            border: px2rpx(2) solid #ff6527;
            background: linear-gradient(359.74deg, #FADEAD 17.94%, #FFF1DD 100%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
            padding: px2rpx(21) 0;
        }

        &nmTitle {
            line-height: px2rpx(17);
            color: #FF480D;
            font-weight: bold;
            font-size: px2rpx(12);
        }

        &subtitle {
            font-weight: bold;
            color: #FF480D;
            font-size: px2rpx(40);
            line-height: px2rpx(40);
            text-align: center;
            white-space: nowrap;
            &--{
                &gift{
                    font-size: px2rpx(30);
                    color: #FF480D;
                    font-weight: bold;
                }
            }
        }

        &subtitleL {
            font-weight: bold;
            color: #FF480D;
            font-size: px2rpx(22);
            line-height: px2rpx(22);
            padding: 0 px2rpx(2);
            text-align: center;
            white-space: nowrap;
        }

        &creditName {
            display: block;
            font-weight: bold;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #FF480D;
        }

        &signBt {
            margin-top: px2rpx(10);
            background: black;
            width: px2rpx(160);
            height: px2rpx(38);
            background: linear-gradient(184.39deg, #FEE08A 30.34%, #FBC11E 107.37%);
            border-radius: px2rpx(64);
            line-height: px2rpx(38);
            text-align: center;
            color: $uni-color-primary;
            font-size: px2rpx(14);
            font-weight: 500;

            &-- {
                &success {
                    background: #CB4900;
                    color: #FFFFFF;
                }
            }
        }

        &activeTime {
            color: $uni-text-color-grey;
            font-size: px2rpx(10);
            line-height: px2rpx(14);
            height: px2rpx(14);
        }

        &navBox {
            width: px2rpx(351);
            height: px2rpx(48);
            border-radius: px2rpx(6);
            background: #ffffff;
            margin: px2rpx(8) px2rpx(12);
            padding-left: px2rpx(12);
            border: none;
            position: relative;

            &:after {
                border: 0;
            }

            &:hover {
                border: 0;
                color: inherit;
            }
        }

        &navTitle {
            width: px2rpx(200);
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: $uni-text-color;
            font-size: px2rpx(14);
            font-weight: 500;
            text-align: left;

        }

        &navSubtitle {
            justify-content: center;
            padding: 0 px2rpx(12);
            height: px2rpx(48);
            color: #565656;
            font-size: px2rpx(14);
            position: absolute;
            right: 0;
        }
    }
}
</style>
