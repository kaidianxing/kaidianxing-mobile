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
    <picker mode="time" :value="model.value" :disabled="disabled" @change="changeDate">
        <view v-if="model.value">{{model.value}}</view>
        <div class="item-placeholder" v-else>
            {{model.tip}}
        </div>
    </picker>
</template>

<script>
    export default {
        name: "FormDate",
        props: {
            model: {
                type: Object,
                default: () => {}
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            changeDate(e) {
                this.$emit('on-change', e.target.value);
            }
        },
        mounted() {
            // 当为当前时间且value不存在时
            if (this.model?.status === 0 && !this.model.value) {
                this.$emit('on-change', this.$utils.formatDateTime(new Date(), 'hh:mm:ss'));
            }
        }
    };
</script>

<style scoped lang="scss">
    /* #ifdef  MP-WEIXIN */
    .item-placeholder {
        color: #CCCCCC;
        flex: 1;
        cursor: pointer;
    }
    /* #endif */
</style>
