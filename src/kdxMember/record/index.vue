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
            <div class="list" v-if="!requestFlag && list.length">
                <list-items type="record" :list="list"></list-items>
            </div>
            <default-page v-else-if="!requestFlag && !list.length" :title="nodataTip"
                          :imgUrl="$utils.staticMediaUrl('default/cash.png')">
            </default-page>
        </div>
    </page-box>
</template>

<script>
import ListItems from '../components/ListItems'
let cacheCurPageNum = -1 //缓存当前页码
let cacheTotalPageNum = -1 //总页数
let searching = false
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        ListItems,
    },
    data() {
        return {
            requestFlag: false,
            finished: false, //没有更多了
            list: [],
            nodataTip: '暂时没有提现记录',
        }
    },
    methods: {
        refreshList() {
            this.list = []
            cacheCurPageNum = -1
            cacheTotalPageNum = -1
            this.initPage()
        },
        initPage() {
            //加载数据
            if (!searching) {
                searching = true
                if (
                    Math.ceil(this.list.length / 20) < cacheTotalPageNum ||
                    cacheCurPageNum == -1 ||
                    cacheTotalPageNum == -1
                ) {
                    cacheCurPageNum = Math.ceil(this.list.length / 20) + 1
                    this.getList()
                } else {
                    this.finished = true
                    searching = false
                }
            }
        },
        getList() {
            this.requestFlag = true
            this.$api.memberApi
                .withdrawRecord({
                    page: cacheCurPageNum,
                    pageSize: 20,
                })
                .then((res) => {
                    this.requestFlag = false
                    if (res.error == 0) {
                        cacheTotalPageNum = Math.ceil(res.total / 20) //总页数
                        searching = false
                        this.list = this.list.concat(
                            res.list.map((item) => {
                                return {
                                    icon:
                                        item.pay_type === '20'
                                            ? 'iconfont-m- icon-m-pay-wechatpay'
                                            : 'iconfont-m- icon-m-pay-alipay',
                                    pay_type: item.pay_type,
                                    title: `提现到${item.pay_type_text}`,
                                    subTitle: item.created_at,
                                    badge:
                                        item.status === '0'
                                            ? '待审核'
                                            : item.status_text,
                                    badgeColor:
                                        item.status === '40'
                                            ? '#FF3C29'
                                            : '#09C15F',
                                    content: `${item.real_money}元`,
                                    contentColor: '#212121',
                                    cash: item.money,
                                    charge: item.deduct_money,
                                }
                            })
                        )
                        this.finished =
                            Math.ceil(this.list.length / 20) ==
                            cacheTotalPageNum
                    } else {
                        searching = false
                        this.$toast(res.message || '出错啦')
                    }
                })
                .catch((err) => {
                    searching = false
                    this.$toast('出错啦')
                })
        },
    },
    beforeDestroy() {
        cacheCurPageNum = -1 //缓存当前页码
        cacheTotalPageNum = -1 //总页数
        searching = false
    },
    onReachBottom() {
        this.initPage()
    },
    mounted() {
        this.initPage()
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
}
</style>
