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
    <ul class='navbar' v-if="getNavbars[0].name != '请选择'">
        <li class='item' v-for='(item,index) in getNavbars' :class="{'theme-primary-color': isLastIndex(index)}"  :key='index' @click='clickNavbarItem(item)' style='white-space: nowrap;'>
            {{item.name}}
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            activeIndex: {
                type: Number,
                default: 0,
            },
            maxLength: {
                type: Number,
                default: 3,
            },
            navbars: {
                type: Array,
                default: []
            },
        },
        computed: {
            getNavbars() {
                return this.navbars.concat({
                    name: '请选择'
                }).map((item, index) => {
                    if (item) {
                        item.index = index;
                    }
                    return item;
                }).slice(0, this.maxLength)
            },
        },
        data(){
          return {
              liShow : 0
          }
        },
        methods: {
            clickNavbarItem(item) {
                this.liShow = item.index;
                this.$emit('click', item)
            },
            isLastIndex(index){
                return index == this.getNavbars?.length -1
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
        .item {
            line-height: 40rpx;
            width: fit-content;
            margin-right: 67rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #212121;
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:last-child {
                margin-right: 0;
                color: #ff3c29;
            }
            &.active:after {
                content: "";
                position: absolute;
                width: 56rpx;
                height: 4rpx;
                background: $uni-color-primary;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }
        }
    }
</style>