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
     <picker class="form-select-picker" :range="model.data" :disabled="disabled" range-key="name" @change="changeSelect">
                <view v-if="model.params.value">{{model.params.value}}</view>
         <div class="item-placeholder" v-else>
             {{model.params.tip}}
         </div>
      </picker>
</template>

<script>
    export default {
        name: "FormSelect",
        props: {
            model: {
                type: Object,
                default: () => {
                    params: {
                        value: ''
                    }
                }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                value: 0
            }
        },
        methods: {
            changeSelect(e) {
                console.log('select', e.target.value, this.model.data[e.target.value].title)
                this.$emit('on-change', this.model.data[e.target.value].name);
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
