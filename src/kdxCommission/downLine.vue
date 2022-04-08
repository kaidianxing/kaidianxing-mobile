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
        <view class="down-line" :class="count == 0? 'bgColor':''">
            <!-- tab切换 -->
            <list-tab type="downLine" :status="status" :current="type" :num="list.length"
                      @changeTab="changeTab"></list-tab>
            <!-- 列表 -->
            <view class="container">
                <block v-if="list.length > 0">
                    <down-line-item :list="list"></down-line-item>
                    <!--加载更多  -->
                    <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
                </block>
                <block v-if="!loading && count <= 0">
                    <!-- 缺省页 -->
                    <view class='default-page flex-column'>
                        <view class="bg">
                            <img class="default-img" :src="$utils.staticMediaUrl('default/subline.png')"/>
                        </view>
                        <view class='default-text'>您暂时还没有下线</view>
                    </view>
                </block>
            </view>
        </view>
    </page-box>
</template>

<script>
import listTab from './components/ListTab'
import downLineItem from './components/DownLineItem'
import PageMixin from '@/common/PageMixin.js'
import {mapState} from "vuex";

export default {
    mixins: [PageMixin],
    name: "downLine",
    components: {
        listTab,
        downLineItem
    },
    props: {},
    data() {
        return {
            type: '1',
            list: [],
            page: 1,
            loading: false,
            count: 0,
            status: [],
        }
    },
    computed: {
        params() {
            return this.$store.state.commissionSet.commissionSetting
        },
        loadingType() {
            let loadingType = 0;
            if (this.loading) {
                loadingType = 1
            } else if (this.list.length == this.count && this.count > 0 && this.loading == false) {
                loadingType = 2
            }
            return loadingType
        }
    },

    beforeMount() {
        this.getCount()
    },
    mounted() {
        this.getList()
    },
    methods: {
        getCount() {
            this.$api.commissionApi.getDownLineCount().then(res => {
                if (res.error == 0) {
                    uni.setNavigationBarTitle({
                        title: `${this.params?.my_down_line}(${res.count.all})`
                    });
                    let arr = [
                        {
                            text: `${this.params.level_name_1}`,
                            type: '1',
                            level_num: res.count.level1_all
                        },
                        {
                            text: `${this.params.level_name_2}`,
                            type: '2',
                            level_num: res.count.level2_all
                        },
                        {
                            text: `${this.params.level_name_3}`,
                            type: '3',
                            level_num: res.count.level3_all
                        }
                    ];
                    this.status = arr.splice(0, res.level)
                }
            })
        },
        changeTab(type) {
            this.type = type;
            this.page = 1;
            this.list = [];
            this.getList()
        },
        getList() {
            // uni.showLoading({title:'加载中'})
            this.loading = true;
            this.$api.commissionApi.getDownLineList({page: this.page, level: this.type}).then(res => {
                if (res.error == 0) {
                    if (res.list.length > 0) {
                        this.list = this.list.concat(res.list);
                    }
                    this.page = this.page + 1;
                    this.loading = false;
                    this.count = res.total;
                } else {
                    this.$toast(res.message)
                }
                this.graceLazyload.load(0, this);
            }).finally(rej => {
                uni.hideLoading()
            })
        },
    },
    onReachBottom() {
        if (this.list.length == this.count && this.page > 1) return;
        this.getList()
    },
}
</script>

<style lang="scss" scoped>
.down-line {
    position: relative;
    min-height: 100vh;
    overflow: auto;
    box-sizing: border-box;

    &.bgColor {
        background: #FFFFFF;
    }

    .container {
        padding: 102rpx 24rpx 16rpx;
    }

    .default-page .bg {
        border-radius: 0;

        .default-img {
            width: 100%;
            height: 100%;
        }
    }

    .relation-count {
        padding: px2rpx(8) px2rpx(12) px2rpx(12);
        margin-bottom: px2rpx(12);
        background-color: #fff;
        border-radius: px2rpx(6);
        box-shadow: 0 0 px2rpx(6) rgba(197, 197, 197, 0.3);

        .flex {
            margin-top: px2rpx(6);
            align-items: flex-end;
            justify-content: space-between;

            .ml-36 {
                margin-left: px2rpx(36);
            }
        }

        .fs-24 {
            font-size: px2rpx(24);
            line-height: px2rpx(24);
        }
    }
}
</style>