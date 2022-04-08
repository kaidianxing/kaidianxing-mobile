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
    <view class="express-container">
        <view class="ex-info">
            <view class="flex align-center ex-title">
                <text class="ex-icon"></text>
                <text class="ex-name">{{query.express_name}}</text>
                <text class="ex-sn">{{query.express_sn}}</text>
            </view>
        </view>
        <view v-if="lists.length==0" class="no-list">暂无物流信息</view>
        <view v-else class="ex-content">
            <view class="flex ex-list">
                <view class="ex-time">
                    <view class="ex-time-date"></view>
                    <view class="ex-time-desc"></view>
                </view>
                <view class="flex1 ex-status-info">
                    <view class="ex-desc">{{address}}</view>
                </view>
                <view class="ex-circle">
                    <view class="flex align-center ex-status-icon">
                        <image :src="$utils.staticMediaUrl('order/address.png')" class="ex-status-img" />
                    </view>
                    <view class="ex-line"></view>
                </view>
            </view>
            <view
                class="flex ex-list"
                :class="{ 'on': index=== 0 }"
                v-for="(item,index) in lists"
                :key="index"
            >
                <view class="ex-time">
                    <view class="ex-time-date">{{item.short_date}}</view>
                    <view class="ex-time-desc">{{item.time}}</view>
                </view>
                <view class="flex1 ex-status-info">
                    <rich-text class="ex-desc" :nodes="item.step" @click="callPhone(item.step)"></rich-text>
                </view>
                <view class="ex-circle">
                    <view class="flex align-center ex-status-icon">
                        <image
                            :src="$utils.staticMediaUrl('order/revice_goods.png')"
                            class="ex-status-img"
                            v-if="index === lists.length-1"
                        />
                        <view class="ex-circle-point" :class="{'on' : index === 0 }" v-else></view>
                    </view>
                    <view class="ex-line" v-if="index!==lists.length-1"></view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        query: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            type: '',
            lists: [],
            address: ''
        }
    },
    watch: {
        query: {
            handler() {
                this.getInfo()
            },
            immediate: true
        }
    },
    methods: {
        getInfo() {
            this.$api.orderApi.queryExpress(this.query).then(res => {
                if (res.error === 0) {
                    this.address = res.refund_info?.address
                    res.data.data.forEach(item => {
                        item.step = item.step.replace(
                            /[1]([3-9])[0-9]{9}/g,
                            ($1, $2) => {
                                return `<a style="color: #518def">${$1}</a>`
                            }
                        )
                    })
                    this.lists = res.data?.data || []
                }
            })
        },
        callPhone(data) {
            data = data.match(/[1]([3-9])[0-9]{9}/g)
            if (data) {
                uni.makePhoneCall({
                    phoneNumber: data[0]
                })
            }
        }
    }
}
</script>


<style lang="scss" scoped>
</style>