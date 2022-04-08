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
    <div class="delivery-type">
        <div class="tab">
            <div class="tab-item" :class="{ active: item.dispatch_type === dispatch_type && dispatchList && dispatchList.length>1}"
                 v-for="(item,index) in dispatchList" :key="index"
                 @click="changeDeliveryType(item.dispatch_type)">
                <block v-if="dispatchList.length==1">
                    {{item.type_name}}
                </block>
                <block v-else-if="dispatchList.length>2 && index==1">
                    <img class="left" :src="$utils.staticMediaUrl('order/address_card_left.png')" alt=""/>
                    {{item.type_name}}
                    <img class="right" :src="$utils.staticMediaUrl('order/address_card_right.png')" alt=""/>
                </block>
                <block v-else>
                    <img v-if="index==0" :src="$utils.staticMediaUrl('order/address_card_right.png')" alt=""/>
                    {{item.type_name}}
                    <img v-if="index>0" :src="$utils.staticMediaUrl('order/address_card_left.png')" alt=""/>
                </block>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";
const dispatch_obj = {
    10: {
        type_name: '快递配送',
        dispatch_type: '10',
        type: 'dispatch_express',
        enable: 'express_enable'
    },
};
export default {
    data() {
        return {
            dispatch_type: '',
            express_enable: 0, // 普通快递可用状态
            // dispatchList: []
        }
    },
    props: {
        value: {
            type: String
        }
    },
    computed: {
        ...mapState('orderCreate', ['dispatch_status']),
        ...mapState('setting', ['systemSetting']),
        dispatchList() {
            let dispatch_sort = this.systemSetting?.dispatch_sort,
                dispatch_name = this.systemSetting?.dispatch_name,
                arr = [];
            if(dispatch_sort){
                dispatch_sort = dispatch_sort.split(',')
            } else {
                dispatch_sort = []
            }
            dispatch_sort.forEach(item => {
                if (this.dispatch_status[dispatch_obj[item].type] == '1' && this.dispatch_status[dispatch_obj[item].enable] == 1) {
                    // 普通快递可用
                    this[dispatch_obj[item].enable] = 1;
                    dispatch_obj[item].type_name = dispatch_name[item] ? dispatch_name[item] : dispatch_obj[item].type_name
                    arr.push(dispatch_obj[item])
                } else {
                    this[dispatch_obj[item].enable] = 0
                }
            });
            return arr
        }
    },
    watch: {
        value: {
            handler(value) {
                this.dispatch_type = value
            },
            immediate: true,
        }
    },
    methods: {
        changeDeliveryType(type) {
            if (this.dispatch_type === type) {
                return
            }
            this.$emit('input', type)
        },
    },
}
</script>

<style lang="scss" scoped>
.delivery-type {
    .tab {
        height: 80rpx;
        display: flex;
        align-items: flex-end;
        .tab-item {
            flex: 1;
            height: 68rpx;
            background: rgba(255, 255, 255, 0.87);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            line-height: 40rpx;
            color: #565656;
            position: relative;
            img {
                position: absolute;
                top: 0;
                height: 80rpx;
                width: 60rpx;
                display: none;
            }
            &:first-child {
                border-top-left-radius: 12rpx;
                img {
                    right: -40rpx;
                }
            }

            &:last-child {
                border-top-right-radius: 12rpx;
                img {
                    left: -40rpx;
                }
            }
            &.active {
                font-weight: bold;
                color: #212121;
                background-color: #fff;
                height: 80rpx;
                img {
                    display: block;
                    &.right {
                        right: -40rpx;
                    }
                    &.left {
                        left: -40rpx;
                    }
                }
            }
        }
    }
}
</style>
