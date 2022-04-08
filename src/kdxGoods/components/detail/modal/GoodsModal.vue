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
    <message-box
        :value="value"
        @input="modalChange"
        :title="title"
        :height="getHeight"
        :custom-style="customStyle"
    >
        <!-- 服务 -->
        <goods-service
            v-if="type == 'biaoqian'"
            :info="info"
        ></goods-service>
        <!-- 不配送区域 -->
        <div v-else-if="type == 'bupeisong'">
            <div>{{info.content.value}}</div>
        </div>
        <!-- 活动 -->
        <goods-active
            v-else-if="type == 'active'"
            :info="info"
        ></goods-active>
        <!-- 优惠券 -->
        <goods-coupon
            v-else-if="type == 'coupon'"
            :info="info"
            @on-refresh="refreshHandler"
            @on-input="modalChange"
        ></goods-coupon>
    </message-box>
</template>

<script>
import MessageBox from '@/components/picker/MessageBox.vue'
import GoodsService from './GoodsService'
import GoodsActive from './GoodsActive'
import GoodsCoupon from './GoodsCoupon.vue'
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        info: {
            type: Object,
            default: () => { }
        },
        title: {
            type: String,
        },
        customStyle: {
            type: Object,
            default: () => { }
        },
        type: {
            type: String,
            required: true
        }
    },
    components: {
        MessageBox,
        GoodsService,
        GoodsActive,
        GoodsCoupon
    },
    computed: {
        getHeight() {
            let special = ['coupon', 'biaoqian', 'active']
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
