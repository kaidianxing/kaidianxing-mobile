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
    <message-box :value="value" :title="title" :height="getHeight" @input="modalChange">
        <!-- 不配送区域 -->
        <div v-if="type == 'bupeisong'">
            <div>{{info.content.value}}</div>
        </div>
        <!-- 活动 -->
        <goods-active
                v-else-if="type == 'active'"
                :info="info"
        ></goods-active>
    </message-box>
</template>

<script>
    import MessageBox from '@/components/picker/MessageBox.vue'
    import GoodsActive from './GoodsActive'

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            info: {
                type: Object,
                default: () => {}
            },
            title: {
                type: String,
            },
            type: {
                type: String,
                required: true
            }
        },
        components: {
            MessageBox,
            GoodsActive
        },
        computed: {
            getHeight() {
                let special = ['coupon', 'biaoqian','active']
                return special.includes(this.info.type) ? '980rpx' : '600rpx'
            }
        },
        methods: {
            modalChange(e) {
                this.$emit('input', e)
            },
            refreshHandler() {
                this.$emit('on-refresh')
            }
        }

    }
</script>