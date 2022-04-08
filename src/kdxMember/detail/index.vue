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
        <div class="detail-index">
            <div class="list" v-if="list.length">
                <list-items
                    :type="getPageId.listType"
                    :list="list"
                ></list-items>
            </div>
            <default-page v-else-if="!requestFlag && !list.length" :desc="nodataTip" :imgUrl="$utils.staticMediaUrl('default/balance.png')"></default-page>
        </div>
    </page-box>
</template>

<script>
import ListItems from '../components/ListItems'
const payTypeIcon = {
    0: 'member/detail/balance-recharge.png',
    10: 'member/detail/balance-recharge.png', // 余额充值
    11: 'member/detail/recharge.png', // 后台充值
    12: 'member/detail/balance-cash.png', // 余额提现
    13: 'member/detail/balance-deduction.png', // 余额抵扣
    14: 'member/detail/shopping.png', // 余额支付
    15: 'member/detail/balance-refund.png', // 余额退款
    16: 'member/detail/balance-gift.png', // 余额赠送
    17: 'member/detail/commission-withdrawal.png', // 佣金提现 TODO
    20: 'member/detail/score-give.png', // 积分赠送
    21: 'member/detail/score.png', // 积分抵扣
    22: 'member/detail/recharge.png', // 后台充值
    23: 'member/detail/cancel-bill.png', // 取消订单返还
    24: 'member/detail/refund.png', // 维权商品退还
    25: 'member/detail/points-refund.png', // 积分赠送退还
}
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        ListItems,
    },
    data() {
        return {
            getPageId: {
                type: 1,
                listType: 'detail',
            },
            nodataTip: '',
            nodataType: 'nobalance',
            page: 1,
            list: [],
            finished: false, // 没有更多了
            requestFlag: false,
            unit: '',
        }
    },
    computed: {
        balance_text() {
            return this.$store.state.setting.systemSetting.balance_text
        },
        credit_text() {
            return this.$store.state.setting.systemSetting.credit_text
        },
    },
    mounted() {
        if (this.$Route.query.page == 'balance') {
            uni.setNavigationBarTitle({
                title: this.balance_text + '明细',
            })
            this.nodataTip = `暂时没有${this.balance_text}明细`
            this.nodataType = 'nobalance'
            this.getPageId.type = 2
            this.unit = '元'
        } /* else if (this.$Route.query.page == 'credit') {
            uni.setNavigationBarTitle({
                title: this.credit_text + '明细',
            })
            this.nodataTip = `暂时没有${this.credit_text}明细`
            this.nodataType = 'nocredit'
            this.getPageId.type = 1
            this.unit = this.credit_text
        } */
        this.getList()
    },
    methods: {
        getList() {
            this.requestFlag = true
            this.$api.memberApi
                .getLog({
                    type: this.getPageId.type,
                    page: this.page,
                    pageSize: 20,
                })
                .then((res) => {
                    this.requestFlag = false
                    if (res.error === 0) {
                        this.finished =
                            res.data.list.length !== res.data.page_size
                        this.list = this.list.concat(
                            res.data.list.map((item) => {
                                return {
                                    img: payTypeIcon[item.status]
                                        ? this.$utils.staticMediaUrl(
                                              payTypeIcon[item.status]
                                          )
                                        : this.$utils.staticMediaUrl(
                                              payTypeIcon['0']
                                          ),
                                    title: item.status_text,
                                    subTitle: item.created_at,
                                    badge: '',
                                    badgeColor: '#FF3C29',
                                    content:
                                        item.num > 0
                                            ? `+${parseFloat(item.num)}${
                                                  this.unit
                                              }`
                                            : `${parseFloat(item.num)}${
                                                  this.unit
                                              }`,
                                    contentColor:
                                        item.num > 0 ? `#FF3C29` : `#09C15F`,
                                    cash: 0,
                                    charge: 0,
                                    order_no: item.order_no,
                                    order_id: item.order_id,
                                    user_delete: item.user_delete,
                                }
                            })
                        )
                    } else {
                        this.$toast(res.message || '出错啦')
                    }
                })
        },
        refreshList() {
            this.list = []
            this.page = 1
            this.getList()
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
    },
}
</script>

<style lang="scss" scoped>
.detail-index {
    width: 100%;
    .list {
        padding-top: 16rpx;
        margin: 0 24rpx;
    }
    .nodata {
        display: flex;
        flex-direction: column;
        .nodata-icon {
            width: px2rpx(100);
            height: px2rpx(100);
            margin: px2rpx(47) auto px2rpx(16);
        }
        .demon {
            text-align: center;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #969696;
        }
    }
}
</style>
