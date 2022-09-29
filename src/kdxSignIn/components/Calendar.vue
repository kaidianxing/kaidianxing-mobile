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
    <view>
        <view class="sign-calendar_calendar">
            <view class="sign-calendar_Box">
                <!-- bar -->
                <view class="sign-calendar_Bar van-hairline--bottom">
                    <!--最长回看历史记录-->
                    <view v-if="maxHistorySign!= 0" class="sign-calendar_BarSides" @click="handleCalendar(0)">
                        <i class="iconfont-m- icon-m-left"></i>
                    </view>
                    <view v-else class="sign-calendar_BarSides sign-calendar_BarSides--grey">
                        <i class="iconfont-m- icon-m-left"></i>
                    </view>

                    <view class="sign-calendar_BarCenter">
                        {{ cur_year || "--" }}年{{ cur_month || "--" }}月
                    </view>
                    <!-- 禁止查看下一年 -->
                    <view v-if="!disableNextYear" class="sign-calendar_BarSides" @click="handleCalendar(1)">
                        <i class="iconfont-m- icon-m-right"></i>
                    </view>
                    <view v-else class="sign-calendar_BarSides sign-calendar_BarSides--grey">
                        <i class="iconfont-m- icon-m-right"></i>
                    </view>
                </view>
                <!-- content -->
                <view class="sign-calendar_Content">
                    <!-- 显示星期 -->
                    <view class="sign-calendar_Week">
                        <text v-for="(item,index) in weeks" :key="index">{{ item }}</text>
                    </view>
                    <view class="sign-calendar_Table">
                        <view v-for="(item,j) in days" :key="j" class='sign-calendar_dateCell'>
                            <view v-if="item.date==undefined||item.date == null" class='sign-calendar_cell'>
                                <text :decode="true">&nbsp;&nbsp;</text>
                            </view>
                            <view v-else>
                                <!-- 单次签到 并且当月只有一次签到  -->
                                <view
                                    v-if="item.isSign && item.isSign == true && dataSource.length == '1'  "
                                    class='sign-calendar_cell  sign-calendar_cell--signOnce  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 单次签到 -->
                                <view
                                    v-else-if="item.isSign && item.isSign == true && !days[j-1].isSign && !days[j+1].isSign"
                                    class='sign-calendar_cell  sign-calendar_cell--signOnce  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到左椭圆  但在右边边缘位置 -->
                                <view
                                    v-else-if="item.isSign == true && !days[j-1].isSign &&  j+1 < days.length && days[j+1].isSign && ((j+1 )% 7) === 0"
                                    class='sign-calendar_cell  sign-calendar_cell--signOnce  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到左椭圆 开始位置 -->
                                <view
                                    v-else-if="item.isSign == true && !days[j-1].isSign &&  j+1 < days.length && days[j+1].isSign || (item.isSign == true &&  j+1 < days.length &&  days[j+1].isSign && j % 7 === 0)"
                                    class='sign-calendar_cell  sign-calendar_cell--signStart  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到中间位置 但在日历边缘-->
                                <view
                                    v-else-if="item.isSign == true && days[j-1].isSign &&  j+1 < days.length &&  days[j+1].isSign && ((j+1 )% 7) === 0"
                                    class='sign-calendar_cell  sign-calendar_cell--signEnd  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到中间位置 -->
                                <view
                                    v-else-if="item.isSign == true && days[j-1].isSign &&  j+1 < days.length &&  days[j+1].isSign"
                                    class='sign-calendar_cell  sign-calendar_cell--signIng  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>

                                <!-- 连续签到右椭圆位置 但在最左边开始位置 -->
                                <view
                                    v-else-if="item.isSign == true &&  j+1 < days.length && !days[j+1].isSign && j % 7 === 0"
                                    class='sign-calendar_cell  sign-calendar_cell--signOnce  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到右椭圆位置 但在最左边开始位置 并且是日历最后一个 -->
                                <view v-else-if="item.isSign == true &&  j + 1 === days.length "
                                      class='sign-calendar_cell  sign-calendar_cell--signOnce  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到右椭圆位置 -->
                                <view
                                    v-else-if="item.isSign == true && days[j-1].isSign && j+1 < days.length && !days[j+1].isSign"
                                    class='sign-calendar_cell  sign-calendar_cell--signEnd  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 连续签到右椭圆位置 并且是日历最后一个-->
                                <view v-else-if="item.isSign == true && days[j-1].isSign && j+1 === days.length "
                                      class='sign-calendar_cell  sign-calendar_cell--signEnd  sign-calendar_cell--white  '>
                                    <text>{{ item.date }}</text>
                                </view>

                                <!-- 漏签 -->
                                <view @click="clickSignUp(item.date,0)"
                                      class="sign-calendar_cell sign-calendar_cell--black"
                                      v-else-if="cur_year<toYear||(cur_year==toYear&&cur_month<toMonth)||(cur_year==toYear&&cur_month==toMonth&&item.date<today)">
                                    <text>{{ item.date }}</text>
                                </view>
                                <!-- 今日未签到-->
                                <view @click="clickSignUp(item.date,1)"
                                      class="sign-calendar_today"
                                      v-else-if="item.date==today&&cur_month==toMonth&&cur_year==toYear">
                                    <text>今</text>
                                </view>
                                <!-- 当前日期之后 -->
                                <view class="sign-calendar_cell sign-calendar_cell--grey" v-else>
                                    <text>{{ item.date }}</text>
                                </view>
                            </view>

                        </view>
                    </view>
                </view>

                <!-- 连续签到提醒 -->
                <view v-if="ShowSMS" class="sign-calendar_inform">
                    <text>开启每日签到提醒，天天得奖</text>
                    <view style="position: relative;right:-6px;">
                        <switch :checked="isRemind == '0'?false:true" :disabled="activityStop" style="transform:scale(0.7)" color="#FF6F29"
                                @change="switchChange"/>
                    </view>
                </view>
                <!-- 底部连签礼物领取 -->
                <view v-if="rewardSource && rewardSource.length > 0" class="sign-calendar_giftBox">
                    <view class="sign-calendar_giftTime">
                        <slot name="start"></slot> &nbsp; - &nbsp;
                        <slot name="end"></slot>
                        连签可领取以下奖励
                    </view>
                    <view class="sign-calendar_giftItemBox">
                        <view class="sign-calendar_giftItem" @click="getReward(item,i)"
                              v-for="(item,i) in rewardSource" :key="i">
                            <!-- 已经领取 -->
                            <img v-if="item.status == '1' && item.is_receive_award"
                                 :src="iconRadio" alt="">
                            <!-- 未领 -->
                            <img v-else-if="item.status == '0' && item.is_receive_award"
                                 :src="iconGift" alt="">
                            <!-- 未达到 -->
                            <img v-else :src="iconGift2" alt="">
                            <text class="sign-calendar_giftDay"> {{ item.day }}天</text>
                            <!--再签X天只存在不能领取的下面-->
                            <text v-if="i == rewardIndex"
                                  class="sign-calendar_giftTip"> 再签{{ item.several_days || '' }}天
                            </text>
                        </view>
                    </view>
                </view>
            </view>

        </view>
    </view>
</template>

<script>
export default {
    name: "Calendar",
    data() {
        return {
            days: [],
            SignUp: [],
            cur_year: 0, //当前选的年
            cur_month: 0, //当前选的月
            maxHistorySign: '12',//最长历史记录12个月
            maxYearSign:  parseInt(new Date().getFullYear()), //最多能查看的年份
            disableNextYear:false,//禁止查看下一年
            today: parseInt(new Date().getDate()), //本日
            toMonth: parseInt(new Date().getMonth() + 1), //本月
            toYear: parseInt(new Date().getFullYear()), //本年
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            giftList: [{icon: 1, day: 1}, {icon: 2, agen: 2, day: 2}, {icon: 3, day: 5}, {icon: 3, agen: 2, day: 7}],
            iconRadio: this.$utils.staticMediaUrl('SignIn/signRadio.png'),//已领礼物
            iconGift: this.$utils.staticMediaUrl('SignIn/signGift.png'),//未领
            iconGift2: this.$utils.staticMediaUrl('SignIn/signGift2.png'),//不可领取
        };
    },
    props: {
        sendYear: {
            type: Number,
            default: new Date().getFullYear()
        },
        sendMonth: {
            type: Number,
            default: new Date().getMonth() + 1
        },
        dataSource: { //已签到的数据源
            type: Array,
            default: () => {
                return []
            }
        },
        rewardSource: { //奖励
            type: Array,
            default: () => {
                return []
            }
        },
        activityStop: Boolean,
        isRemind :String | Number,//日签提醒
        ShowSMS:Boolean//短信提醒
    },
    created() {
        this.cur_year = this.sendYear;
        this.cur_month = this.sendMonth;
        this.SignUp = this.dataSource;

        this.calculateEmptyGrids(this.cur_year, this.cur_month);
        this.calculateDays(this.cur_year, this.cur_month);
        this.onJudgeSign();
        if(this.toMonth == '12'){//如果本月已经是12月了 不让查看下一年
            this.disableNextYear = true
        }
    },
    computed: {
        rewardIndex() {
            if (this.rewardSource.length === 0) {
                return 0
            } else {
                let index
                let allTrue = true
                for(let i in this.rewardSource){
                    if(!this.rewardSource[i].is_receive_award){
                        allTrue = false
                        index = i
                        return index
                    }
                }//只展示在不能领取的礼物下面
                if(allTrue){
                    return -1
                }else {
                    return index
                }
                // let arr = this.rewardSource.reward_info
                // arr.reverse()
                // for(let i = 0 ; i < arr.length; i++){
                //     // status：0未领取；1已领取    在可以领取的礼物下一个展示
                //     if(this.rewardSource.reward_info[i].status && (this.rewardSource.reward_info[i].status === '1' || this.rewardSource.reward_info[i].status === '0' )){
                //         return  i + 1
                //         break;
                //     }
                // }
            }
        },

    },
    watch: {
        dataSource: 'onResChange',
    },
    methods: {
        getReward(item, index) {//领取奖励
            // if (this.rewardSource.reward_info[index] && this.rewardSource.reward_info[index].status === '0') {
            let objB = this.rewardSource[index] || {}
            let objA = Object.assign(objB, item)
            this.$emit('receiveReward', objA)
            // }
        },
        changeType() {
            this.allow = !this.allow;
            // this.$emit('changeType', this.allow)
        },
        sign() {
            this.clickSignUp(this.today, 1)
        },
        // 获取当月共多少天
        getThisMonthDays(year, month) {
            return new Date(year, month, 0).getDate()
        },
        // 获取当月第一天星期几
        getFirstDayOfWeek(year, month) {
            return new Date(Date.UTC(year, month - 1, 1)).getDay();
        },
        // 计算当月1号前空了几个格子，把它填充在days数组的前面
        calculateEmptyGrids(year, month) {
            //计算每个月时要清零
            this.days = [];
            const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
            if (firstDayOfWeek > 0) {
                for (let i = 0; i < firstDayOfWeek; i++) {
                    var obj = {
                        date: null,
                        isSign: false
                    }
                    this.days.push(obj);
                }
            }
        },

        // 绘制当月天数占的格子，并把它放到days数组中
        calculateDays(year, month) {

            const thisMonthDays = this.getThisMonthDays(year, month);
            // this.columnsLen=Math.ceil(thisMonthDays/7);
            // console.log(this.columnsLen);
            for (let i = 1; i <= thisMonthDays; i++) {
                var obj = {
                    date: i,
                    isSign: false
                }
                this.days.push(obj);
            }
            //console.log(this.days);

        },

        onResChange(newD, oldD) {
            this.SignUp = newD;
            this.onJudgeSign();
        },

        //匹配判断当月与当月哪些日子签到打卡
        onJudgeSign() {
            var signs = this.SignUp;
            var daysArr = this.days;
            // console.log("daysArr: ", this.days);
            for (var i = 0; i < signs.length; i++) {
                var current = new Date(signs[i].replace(/-/g, "/"));
                var year = current.getFullYear();
                var month = current.getMonth() + 1;
                var day = current.getDate();
                day = parseInt(day);
                for (var j = 0; j < daysArr.length; j++) {
                    //年月日相同则打卡成功
                    if (year == this.cur_year && month == this.cur_month && daysArr[j].date == day) { //&& signs[i].isSign == "今日已打卡"
                        // console.log(daysArr[j].date, day);
                        daysArr[j].isSign = true;
                    }
                }
            }
            // console.log("this.days: ", this.days);
            this.days = daysArr;
        },

        // 切换控制年月，上一个月，下一个月
        handleCalendar(type) {
            const cur_year = parseInt(this.cur_year);
            const cur_month = parseInt(this.cur_month);
            var newMonth;
            var newYear = cur_year;
            if (type === 0) { //上个月
                this.maxHistorySign--
                if(this.disableNextYear) {
                    this.disableNextYear = false
                }
                newMonth = cur_month - 1;
                if (newMonth < 1 && this.maxHistorySign != 0) {//计算最长回看记录
                    newYear = cur_year - 1;
                    newMonth = 12;
                }
            } else {//下个月
                newMonth = cur_month + 1;
                if (newMonth > 12 ){
                    newYear = cur_year + 1;
                    newMonth = 1;
                }
                if(newYear <= this.maxYearSign){
                    this.maxHistorySign++
                }
                if(newYear > this.maxYearSign){//不能大于当前年
                    newYear = this.maxYearSign
                    newMonth = 12
                }
                if(newYear == this.maxYearSign && newMonth === 12){
                    this.disableNextYear = true
                }
            }
            this.calculateEmptyGrids(newYear, newMonth);
            this.calculateDays(newYear, newMonth);

            this.cur_year = newYear;
            this.cur_month = newMonth;

            this.SignUp = []; //先清空
            this.$emit('dateChange', this.cur_year + "-" + this.cur_month); //传给调用模板页面去拿新数据
        },

        clickSignUp(date, type) { //type=0补签，type=1当日签到
            var str = "签到";
            if (type == 0) {//如果不需要补签功能直接在这阻止不执行后面的代码就行。
                str = "补签";
            }
            this.$emit('clickChange', this.cur_year + "-" + this.getFullStr(this.cur_month) + "-" + this.getFullStr(date), type); //传给调用模板页面
            this.onJudgeSign();
        },
        switchChange(evnt){
            console.log(evnt.detail.value,"evnt.detail.value");
            if(evnt.detail.value){//开启
                this.$emit('setDailyReminder','1')
            }else{//关闭
                this.$emit('setDailyReminder','0')
            }
        },
        getFullStr(num) {
            if (num) {
                num = parseInt(num)
                return num < 10 ? '0' + num : num
            }
        },
    }
}
</script>

<style scoped lang="scss">
.sign-calendar {
    &_ {
        &calendar {
            padding: 0 px2rpx(12);
        }

        &Box {
            background: #ffffff;
            border-radius: px2rpx(6);
            overflow: hidden;
        }

        &Bar {
            //border-bottom:  px2rpx(0.5) solid #E6E7EB;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: px2rpx(40);
            &.van-hairline--bottom:after {
                border-bottom-color: $uni-border-color;
                border-style: solid;
            }
        }

        &BarCenter {
            font-weight: 500;
            font-size: px2rpx(14);
            color: $uni-text-color;
        }

        &BarSides {
            padding: px2rpx(5) px2rpx(17);

            i {
                color: #565656;
                font-size: px2rpx(23);

            }

            &--grey {
                i {
                    color: $uni-text-color-grey;
                    font-size: px2rpx(23);
                }
            }
        }

        &Content {
            min-height: px2rpx(260);
            padding: 0 px2rpx(18) px2rpx(7.5);

        }

        &Week {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: px2rpx(8) 0;
            background-color: #fff;

            text {
                color: $uni-text-color;
                font-style: px2rpx(14);
                //width: px2rpx(21.25);
                width: 14.285%;
                height: px2rpx(30);
                text-align: center;
                line-height: px2rpx(30);
                display: block;
                font-weight: 500;
            }
        }

        &Table {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: flex-start;
        }

        &dateCell {
            margin-top: px2rpx(14);
            //margin-left: px2rpx(24);
            display: inline-block;
            //width: px2rpx(21.25);
            width: 14.285%;
            height: px2rpx(30);
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &cell {
            width: px2rpx(21.25);
            height: px2rpx(30);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: px2rpx(30);

            text {
                left: 0;
                top: 0;
                position: absolute;
                z-index: 1;
                line-height: px2rpx(30);
                text-align: center;
                font-size: px2rpx(14);
                font-weight: 500;
                width: px2rpx(21.25);
                height: px2rpx(30);
            }

            &-- {
                &signOnce {
                    &:after {
                        content: '';
                        display: block;
                        width: px2rpx(24);
                        height: px2rpx(24);
                        border-radius: 50%;
                        background: #FF6F29;
                        position: absolute;
                        left: px2rpx(-1.5);
                        top: px2rpx(3);
                        z-index: 0;

                    }
                }

                &signStart {
                    &:after {
                        content: '';
                        display: block;
                        width: px2rpx(42);
                        height: px2rpx(24);
                        border-top-left-radius: px2rpx(15);
                        border-bottom-left-radius: px2rpx(15);
                        background: #FF6F29;
                        position: absolute;
                        left: px2rpx(-7.5);
                        top: px2rpx(3);
                        z-index: 0;
                    }
                }

                &signIng {
                    &:after {
                        content: '';
                        display: block;
                        width: px2rpx(50);
                        height: px2rpx(24);
                        background: #FF6F29;
                        position: absolute;
                        left: px2rpx(-14);
                        top: px2rpx(3);
                        z-index: 0;
                    }
                }

                &signEnd {
                    &:after {
                        content: '';
                        display: block;
                        width: px2rpx(42);
                        height: px2rpx(24);
                        background: #FF6F29;
                        border-top-right-radius: px2rpx(15);
                        border-bottom-right-radius: px2rpx(15);
                        position: absolute;
                        right: px2rpx(-7.5);
                        top: px2rpx(3);
                        z-index: 0;
                    }
                }

                &grey {
                    color: $uni-text-color-grey;
                }

                &black {
                    color: $uni-text-color;
                }

                &white {
                    color: #ffffff;
                }
            }
        }

        &today {
            text {
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                width: px2rpx(21.25);
                height: px2rpx(21.25);
                color: #FF6F29;
                border: 1px solid #FF6F29;
                border-radius: 50%;
            }
        }

        &inform {
            margin: 0 px2rpx(12);
            border-top: px2rpx(0.5) solid $color-line;
            height: px2rpx(35);
            display: flex;
            align-items: center;
            justify-content: space-between;

            text {
                font-size: px2rpx(12);
                color: $uni-text-color;
            }
        }

        &giftBox {
            height: px2rpx(91);
            padding: px2rpx(8) 0;
            position: relative;
            &::before{
                content: '';
                display: block;
                width: px2rpx(327);
                position: absolute;
                left: px2rpx(12);
                top: 0;
                height: 0;
                border-top: px2rpx(0.5) solid $color-line;

            }
        }

        &giftTime {
            color: $uni-text-color-grey;
            font-size: px2rpx(10);
            line-height: px2rpx(14);
            height: px2rpx(14);
            display: block;
            padding-left: px2rpx(12);

        }

        &giftItemBox {
            padding-top: px2rpx(5);
            display: flex;
            align-items: flex-start;
            justify-content: center;
        }

        &giftItem {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: px2rpx(30);
            height: auto;
            margin: 0 px2rpx(10);


            img {
                width: px2rpx(30);
                height: px2rpx(30);
            }

        }

        &giftDay {
            color: #565656;
            font-size: px2rpx(12);
            line-height: px2rpx(14);
            transform: scale(0.83, 0.83);
            white-space: nowrap;
        }

        &giftTip {
            font-size: px2rpx(12);
            transform: scale(0.66, 0.66);
            white-space: nowrap;
            line-height: px2rpx(11);
            color: #FF6F29;
        }
    }

    .radio-box {
        padding-right: px2rpx(24);
        align-items: center;

        .iconfont-m- {
            margin-right: px2rpx(8);
            font-size: px2rpx(20);
            color: $uni-border-color;
        }

        .icon-m-yes {
            font-size: px2rpx(20);
            line-height: px2rpx(20);
            text-align: center;
            border-radius: 50%;
            color: $uni-color-primary;
        }
    }
}
</style>
