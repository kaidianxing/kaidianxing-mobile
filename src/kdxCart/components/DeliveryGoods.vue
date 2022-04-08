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
    <view class="delivery">
        <view class="header">
            <img
                class="header-img"
                :src="$utils.staticMediaUrl(getIcon)"
            />
            <view class="header-title">{{getTitle}}</view>
        </view>
        <view class="content">
            <scroll-view
                class="scroll-content"
                scroll-x
            >
                <view class="scroll-container">
                    <img
                        v-for="(item,index) in info.list"
                        :key="index"
                        class="scroll-img"
                        :src="$utils.mediaUrl(item.thumb)"
                    />
                </view>
            </scroll-view>
            <view class="pay flex">
                <view class="pay-total"><text>共{{info.total}}件，合计：</text><text class="pay-price theme-primary-price">¥ {{info.total_price}}</text></view>
                <btn @btn-click="create" class="addClass" classNames="theme-primary-bgcolor">结算</btn>
            </view>
        </view>
        <view class="footer"></view>
    </view>
</template>

<script>

import {mapState} from "vuex";

export default {
    props: {
        type: String,
        info: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        ...mapState('setting', ['systemSetting']),
        dispatchName() {
            return this.systemSetting?.dispatch_name
        },
        getIcon() {
            let opt = {
                'express': 'order/delivery_map.png',
            }
            return opt[this.type] || ''
        },
        getTitle() {
            let opt = {
                'express': this.dispatchName['10'] ? this.dispatchName['10'] : '快递配送',
            }
            return opt[this.type] || ''
        }
    },
    methods: {
        create(){
            let preState = {goods_id: [],actives:[]}
            let {goods_id,actives} = this.info.list.reduce(({goods_id,actives}, current)=> {
                 // 获取购物车选中商品活动类型
                if(current.activity_type?.length){
                    actives = [...new Set(actives.concat(current.activity_type))]
                }
                goods_id.push(current.goods_id)
                return {goods_id,actives}
            }, preState) 
            
              // 存在多个活动类型商品时，不能同时下单
            if(actives.length>1){
                return this.$toast('不同的活动类型 暂不支持同时下单')
            }

            this.$emit('create',goods_id, this.type,this.info.list)
        }
    }
}
</script>


<style lang="scss" scoped>
.delivery {
    padding-top: px2rpx(12);
    .header {
        display: flex;
        align-items: center;

        &-img {
            height: px2rpx(16);
            width: px2rpx(16);
        }

        &-title {
            margin-left: px2rpx(4);
            font-size: px2rpx(14);
            font-weight: bold;
        }
    }

    .content {
        margin-top: px2rpx(8);
        border-radius: px2rpx(6);
        padding: px2rpx(12) 0;
        background: #f5f5f5;

        .scroll-content {
            width: px2rpx(350);
            padding: 0 px2rpx(12) 0 px2rpx(4);

            .scroll-img {
                border-radius: px2rpx(6);
                display: inline-block;
                margin-left: px2rpx(8);
                width: px2rpx(58);
                height: px2rpx(58);
            }
        }

        .scroll-container {
            white-space: nowrap;
        }

        .pay {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: px2rpx(12);
            padding: 0 px2rpx(12);
            font-size: px2rpx(12);
            line-height: px2rpx(17);

            &-btn {
                border-radius: px2rpx(27);
                width: px2rpx(44);
                height: px2rpx(23);
                font-size: px2rpx(12);
                text-align: center;
                line-height: px2rpx(23);
                color: #fff;
                background: #ff3c29;
            }

            &-price {
                font-weight: bold;
                color: #ff3c29;
            }

            .addClass {
                width: auto;
                  // #ifndef H5
                /deep/ button {
                    padding: 0 px2rpx(12);
                    width: auto;
                    font-size: px2rpx(12);
                }
                // #endif
            }

            // #ifdef H5
            .addClass {
                padding: 0 px2rpx(12);
                    width: auto;
                    font-size: px2rpx(12);
            }
            // #endif
        }
    }

    .footer {
    }
}
</style>