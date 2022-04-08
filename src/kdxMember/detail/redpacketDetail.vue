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
    <page-box>
        <div class="redpacket_detail" v-if="list.length">
            <div class="redpacket_total">
                <img :src="$utils.staticMediaUrl('activity/redpacket/redpacketDetail.png')" alt="">
                <div class="redpacket_title flex-column">
                    <div class="text">累计领取金额</div>
                    <div class="money">￥{{ total_money }}</div>
                </div>
            </div>
            <ul class="list-item">
                <li class="item" v-for="(item,index) in list" :key="index">
                    <div class="flex align-center">
                        <img :src="$utils.staticMediaUrl('activity/redpacket/smallRedpacket.png')" alt="">
                        <div class="flex-column flex1" style="margin-left: 12px;">
                            <div class="title">{{ item.scene_text }}</div>
                            <div class="receive_date">领取时间：{{item.updated_at}}</div>
                        </div>
                        <div class="receive_money">+{{ item.money }}元</div>
                    </div>
                    <img class="receive-img" :src="$utils.staticMediaUrl('coupon/receive.png')" alt="">
                </li>
            </ul>
        </div>

        <default-page v-else-if="!requestFlag && !list.length" :title="nodataTip" :imgUrl="$utils.staticMediaUrl('default/no_redpacket.png')"></default-page>

        <!-- 领取微信红包奖励弹窗 -->
        <redpacket :activityType="activityType" :activityData="activityData" :redpackNum="redpackNum" :path="true" :isShow="false"
                   @update:visible="changeShowReward"></redpacket>

    </page-box>
</template>

<script>
import redpacket from '@/components/modal-reward/Redpacket'
import PageMixin from '@/common/PageMixin.js'

export default {
    name: "redpacket_detail",
    mixins: [PageMixin],
    components: {
        redpacket
    },
    data() {
        return {
            list: [],
            nodataTip: '暂无红包',
            nodataType: 'noRedpacket',
            page: 1,
            finished: false, // 没有更多了
            requestFlag: false,
            activityType: '', //红包活动
            activityData: {},
            total_money: '', //红包总金额
            redpackNum: 0,//未领取红包数量
        }
    },
    mounted() {
        this.getList()
        this.getNoRedpacket()
    },
    methods: {
        // 获取红包明细列表数据
        getList() {
            this.requestFlag = true
            this.$api.memberApi
                .getRedpacketList({
                    page: this.page,
                    pageSize: 20,
                })
                .then((res) => {
                    this.requestFlag = false;
                    if (res.error === 0) {
                        this.finished = res.list.length !== res.page_size
                        this.list = this.list.concat(res.list)
                        this.total_money = res.total_money;
                    } else {
                        this.$toast(res.message || '出错啦')
                    }
                })
        },
        // 获取可领取的红包
        getNoRedpacket() {
            this.$api.memberApi
                .getNoRedpacket({
                    page: this.page,
                    pageSize: 20,
                }).then(res => {
                this.redpackNum = res.list.length;
                if(res.error == 0 && res.list.length) {
                    let item = res.list[0];
                    this.activityType = SCENE_MAP[item.scene]
                    this.activityData = {
                        blessing: item.extend.blessing,
                        created_at: item.created_at,
                        expire_time: item.expire_time,
                        limit: item.extend.limit,
                        money: item.money,
                        id: item.id,
                    }
                }
            })
        },
        refreshList() {
            this.list = []
            this.page = 1
            this.getList()
            this.getNoRedpacket()
        },
        //红包领取弹窗是否刷新当前页面
        changeShowReward(value) {
            if(value.update) {
                this.refreshList()
            }
        },
    },
    onReachBottom() {
        if (this.finished) {
            this.$toast('没有更多了~')
            return
        }
        this.page++
        this.getList()
    },
    onPullDownRefresh() {
        this.refreshList()
        setTimeout(() => {
            uni.stopPullDownRefresh();
        }, 1000);
    },
}


const SCENE_MAP = {
    '12': 'consumeReward',
    '11': 'shoppingReward',
}
</script>

<style scoped lang="scss">
.redpacket_detail {
    background: #F5F5F5;
    padding: 0 px2rpx(12);
    .redpacket_total {
        height: px2rpx(112);
        overflow: hidden;
        border-radius: px2rpx(12);
        position: relative;
        margin: px2rpx(16) 0;
        background-color: #ff3c29;
        img {
            width: 100%;
            height: 100%;
        }
        .redpacket_title {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            justify-content: center;
            align-items: center;
            .text {
                font-size: px2rpx(12);
                line-height: px2rpx(16);
                color: #FFFFFF;
                margin-bottom: px2rpx(4);
            }
            .money {
                font-weight: bold;
                font-size: px2rpx(24);
                line-height: px2rpx(34);
                color: #FFFFFF;
            }
        }
    }
    .item {
        background-color: #FFFFFF;
        border-radius: px2rpx(6);
        position: relative;
        margin-bottom: px2rpx(8);
        padding: px2rpx(16) px2rpx(12);
        justify-content: center;
        overflow: hidden;
        img {
            width: px2rpx(32);
            height: px2rpx(32);
            border-radius: px2rpx(4);
        }
        .title {
            color: #212121;
            font-size: px2rpx(14);
            line-height: px2rpx(16);
            margin-bottom: px2rpx(4);
        }
        .receive_date {
            color: #969696;
            font-size: px2rpx(12);
            line-height: px2rpx(16);
        }
        .receive_money {
            z-index: 999;
            font-weight: bold;
            color: #FF3C29;
            font-size: px2rpx(14);
            line-height: px2rpx(16);
        }
        .receive-img {
            position: absolute;
            top: px2rpx(27);
            right: 0;
            width: px2rpx(56);
            height: px2rpx(56);
            transform: rotate(8deg);
        }
    }
}
</style>