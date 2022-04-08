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
        <template v-slot:top>
            <view class="flex align-center search-box">
                <text
                    class="iconfont-m- icon-m-shangpinxiangqing-search search-icon"
                ></text>
                <input
                    type="text"
                    v-model="code"
                    placeholder="搜索快递公司"
                    class="search-input"
                    placeholder-class="search-input-text"
                />
            </view>
        </template>
        <view class="content">
            <view
                class="content-list"
                v-for="list in lists"
                :key="list.id"
                hover-class="active"
            >
                <refund-cell
                    :title="list.name"
                    @click.native="chooseExpress(list)"
                    :rightIcon="
                        list.code === refund_checkEx.code
                            ? 'icon-m-dingwei-xuanzhong theme-primary-color'
                            : ''
                    "
                ></refund-cell>
            </view>
        </view>
    </page-box>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import RefundCell from '../components/refund/RefundCell'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        RefundCell,
    },
    data() {
        return {
            lists: [],
            allList: [],
            timer: null,
            code: '',
        }
    },
    computed: {
        ...mapGetters('order', ['refund_checkEx']),
    },
    watch: {
        code() {
            clearTimeout(this.timer)
            this.timer = setTimeout(this.search, 300)
        },
    },
    mounted() {
        this.getExpress()
    },
    methods: {
        ...mapMutations('order', ['setRefundCheckEx']),
        chooseExpress(list) {
            this.setRefundCheckEx(list)
            this.$Router.back(1)
        },
        getExpress() {
            this.$api.orderApi
                .expressList()
                .then((res) => {
                    if (res.error === 0) {
                        this.allList = res.list
                        this.lists = res.list
                        this.show = true
                    }
                })
        },
        search() {
            this.lists = this.allList.filter(
                (v) => v.name.indexOf(this.code) > -1
            )
        },
    },
}
</script>

<style lang="scss" scoped>
/deep/ .my-istop {
    padding-bottom: 16rpx;
}
.search-box {
    margin: 16rpx 24rpx 0;
    border-radius: 12rpx;
    padding: 0 24rpx;
    height: 60rpx;
    background: #ffffff;

    .search-icon {
        margin-right: 12rpx;
        font-size: 32rpx;
        color: rgba(0, 0, 0, 0.24);
    }

    .search-input {
        font-size: 24rpx;
        line-height: 32rpx;
        color: $uni-text-color;
        &-text {
            color: rgba(0, 0, 0, 0.24);
        }
    }
}
/deep/ .page-bg,
/deep/ .my-istop {
    background-color: #f5f5f5;
}
.content {
    padding: 92rpx 24rpx 32rpx;

    &-list {
        background-color: #fff;
        padding-left: 24rpx;
        overflow: hidden;
        &:first-child {
            border-top-left-radius: 12rpx;
            border-top-right-radius: 12rpx;
        }
        &:last-child {
            border-bottom-right-radius: 12rpx;
            border-bottom-left-radius: 12rpx;
            /deep/ .cell {
                .cell-inner {
                    border-bottom: 0;
                }
            }
        }
    }

    /deep/ .cell:last-child {
        padding: 0;

        .cell-icon {
            font-size: 40rpx;
            color: $uni-color-primary;
        }
    }
}
</style>
