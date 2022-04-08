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
        <!-- 积分明细 -->
        <div class="credit-detail">
            <!-- 积分信息卡片 -->
            <info-card></info-card>
            <!-- 分类选项 -->
            <view class="list-tab">
                <view class="tab flex">
                    <view class="item" :class="current == item.type?'active':''" v-for="(item, index) in status" :key="index" @click="changeTab(item.type)">
                        {{item.text}}<span class="line"></span>
                    </view>
                </view>
            </view>
            <!-- 积分数据 -->
            <div class="detail-index">
                <div class="list" v-if="list.length">
                    <list-items
                        :type="getPageId.listType"
                        :list="list"
                    ></list-items>
                </div>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
                <!-- 缺省图 -->
                <default-page v-else-if="!loading && !list.length" title="暂无记录"
                              :imgUrl="$utils.staticMediaUrl('default/credit-new.png')"></default-page>
            </div>
        </div>
    </page-box>
    
</template>

<script>
import InfoCard from "../components/InfoCard"
import ListItems from '../components/ListItems'
import PageMixin from '@/common/PageMixin.js'
import { mapState } from 'vuex'

const payTypeIcon = {
    0: 'member/detail/balance-recharge.png',
    20: 'member/detail/score-give.png', // 积分赠送
    21: 'member/detail/score.png', // 积分抵扣
    22: 'member/detail/recharge.png', // 后台充值
    23: 'member/detail/cancel-bill.png', // 取消订单返还
    24: 'member/detail/refund.png', // 维权商品退还
    25: 'member/detail/points-refund.png', // 积分赠送退还
}

export default {
    mixins: [PageMixin],
    components: {
        InfoCard, ListItems
    },
    data() {
        return {
            loading: false,
            finished: false, // 没有更多了
            page: 1,
            list: [],
            count: '',
            current: '0',
            unit: '',
            getPageId: {
                type: 0,
                listType: 'detail',
            },
            nodataType: 'nocredit',
        }
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapState('setting', {
            credit_text: state => state.systemSetting.credit_text,
        }),
        status() {
            return ([
                {
                    text: '全部记录',
                    type: '0'
                },
                {
                    text: `${this.credit_text}获得`,
                    type: '1'
                },
                {
                    text: `${this.credit_text}抵扣`,
                    type: '2'
                },
                {
                    text: `${this.credit_text}消费`,
                    type: '3'
                }
            ])
        },
        nodataTip() {
            return `暂时没有${this.credit_text}明细`
        },
        loadingType() {
            let loadingType = 0;
            if (this.loading) {
                loadingType = 1
            } else if (this.list.length == this.total && this.total > 0 && this.loading == false) {
                loadingType = 2
            }
            return loadingType
        }
    },
    methods: {
        changeTab(type) {
            this.current = type;
            this.page = ''
            this.list = []
            this.getList()
        },
        refreshList() {
            this.list = []
            this.page = 1
            this.getList()
        },
        getList() {
            this.loading = true;
            let params = {
                type: this.current,
                page: this.page,
                pageSize: 20,
            }
            this.$api.memberApi
                .getCreditDetail(params)
                .then((res) => {
                    this.loading = false
                    if (res.error === 0) {
                        this.total = res.data.total
                        // this.finished = res.data.list.length !== res.data.page_size
                        this.finished = this.list.length == this.total;
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
        }
        
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
    }
}
</script>

<style lang="scss" scoped>
.credit-detail {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.list-tab {
    width: 100%;
    padding: 0 px2rpx(12);
    position: absolute;
    left: 0;
    top: px2rpx(112);
    z-index: 99;
    .tab {
        background-color: #fff;
        border-bottom: 1px solid $uni-border-color;
        border-radius: 12rpx 12rpx 0 0;
        display: flex;
        justify-content: space-evenly;
        .item {
            // -webkit-box-flex: 1;
            // -ms-flex: 1;
            // -webkit-flex: 1;
            // flex: 1;
            text-align: center;
            line-height: 100rpx;
            font-size: 28rpx;
            color: #565656;
            position: relative;
            .line {
                width: 56rpx;
                height: 4rpx;
                position: absolute;
                bottom: 0;
                left: 50%;
                display: none;
                background-color: transparent;
                transform: translateX(-50%);
                border-radius: 4rpx !important;
            }
        }
        .item.active {
            // font-size: 32rpx;
            color: $uni-color-primary;
            font-weight: 600;
            .line {
                display: block;
                background-color: $uni-color-primary;
            }
        }
    }
}
.detail-index {
    flex: 1;
    padding: 0 px2rpx(12) px2rpx(16);
    .list {
        padding-top: 46rpx;
    }
    /deep/ .kdx-default-page-wrap > .default {
        height: calc(100vh - 280rpx - 32rpx);
    }
}
</style>