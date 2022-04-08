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
    <div class='diyform-item'>
        <div class="form-item" v-for="(item,index) in items" :key='index'>
            <form-item :type="type" :model='item' :refreshData='formData' @on-change="changeItem(index, $event)" @on-focus="focusHandle"></form-item>
        </div>
    </div>
</template>

<script>
    import formItem from '../systemformItems/index'
    export default {
        props: {
            items: {
                type: Array,
                default: () => []
            },
            type: { // 表单类型
                type: String, 
                default: ''
            }
        },
        computed:{
            formData(){
                return this.$store.state.decorate.formData
            }
        },
        components: {
            formItem
        },
        methods: {
            changeItem(index, data) {
                this.items[index] = data;
                this.$decorator.refreshForm(data);
                this.$emit('on-change', this.items);
            },
            focusHandle(e){
                this.$emit('on-focus',e)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .diyform-item {
       background-color: #ffffff;
        padding-bottom: px2rpx(16);
        .form-item {
            /*margin-left: px2rpx(12);*/
            /*padding: 0 px2rpx(12);*/
            /*border-bottom: 1rpx solid #E6E7EB;*/
            &:last-child {
                border-bottom: none;
            }
        }
    }
</style>
