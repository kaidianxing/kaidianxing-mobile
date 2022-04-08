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
    <div class="form-pictures">
        <select-img ref="myPictures" :items="item"  :maxFileNumber="maxFileNumber" :beforeUpload="beforeUpload"  @change="imgChange"></select-img>
    </div>
</template>

<script>
    import SelectImg from "../../image/SelectImg";
    export default {
        name: "FormPictures",
        components: {
            SelectImg
        },
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
        computed: {
            item() {
                return this.model?.params?.value
            },
            maxFileNumber() {
                if (this.model?.params?.maxNumber) {
                    return parseInt(this.model?.params?.maxNumber)
                } else {
                    return 10
                }
            },
        },
        methods: {
            imgChange(data) {
                this.$emit('on-change', data);
            },
            // 抛出聚集操作
            beforeUpload(){
                if(this.disabled) {
                    this.$emit('on-click')
                    return false
                } else {
                    return true                    
                }
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
