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
    <view class="card-footer">
        <view class="card-footer-content align-center flex-between">
            <view class="flex">
                <view class="flex radio-box" @click="radioChange" v-if="!editStatus">
                    <i class="disalbed-icon" v-if="goodsDisabled"></i>
                    <i class="icon-m-yes iconfont-m- theme-primary-color" v-else-if="footerObj.all_selected == true"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                </view>
                <view class="flex radio-box" @click="allSelectedRadioChange" v-else>
                    <i class="icon-m-yes iconfont-m- theme-primary-color" v-if="allSelected"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                </view>
                <text class="block fl text text-w2">全选</text>
            </view>
            <view class="right flex align-center">
                <block v-if="!editStatus">
                    <view class="count">
                        <text>合计：</text>
                        <text class="price theme-primary-price">￥</text>
                        <text class="price theme-primary-price" style="font-size: 40rpx;">
                            {{ Number(footerObj.total_price.toFixed(2))}}
                        </text>
                    </view>
                    <view class="button">
                        <btn :disabled="footerObj.selected_goods == 0" classNames="theme-primary-bgcolor" styles="margin-left: 28rpx;width:200rpx" type="do" size="middle" @btn-click="create">去结算({{ footerObj.selected_goods }})</btn>
                    </view>
                </block>
                <block v-else>
                    <button-group>
                        <btn styles="width:200rpx" class="group" classNames="theme-sub-bgcolor theme-primary-color" type="do" size="middle" @btn-click="favorites">移至收藏夹</btn>
                        <btn styles="width:200rpx" class="group" classNames="theme-primary-bgcolor" type="do" size="middle" @btn-click="deleteFn">删除</btn>
                    </button-group>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        components: {},
        props: {
            list: {
                type: Array,
                default: () => [],
            },
            editStatus: {
                type: Boolean,
                default: false,
            },
            express_enable: {
                type: Number,
                default: 0,
            },
            footerObj: {
                type: Object,
            },
        },
        data() {
            return {}
        },
        computed: {
            // 编辑控制是否全选
            allSelected() {
                return !this.list.some(item => {
                    return item.goods.some(v=> v.editStatus === false)
                })
            },
            // 不满足购买条件
            goodsDisabled() {
                let list = this.list;
                return list.some(item => item.is_reelect == '1' || item.stock == '0' || item.buy_perm == '0')
            }
        },
        methods: {
            radioChange() {
                // 1. 判断是否存在商品不满足购买权限
                if (this.goodsDisabled) {
                    return
                }
                let args = {
                    select_all: 1,
                }
                this.$api.goodApi.selectCart(args).then((res) => {
                    if (res.error != 0) {
                        this.$toast(res.message)
                    }
                    this.$emit('getList')
                })
            },
            allSelectedRadioChange() {
                this.$emit('allSelectedRadioChange', !this.allSelected)
            },
            create() {
                /**
                 * 判断是否有选中商品
                 * 是否全选
                 * 是否有商品库存不足
                 * 限购*/
                let result = false;
                let arr= []
                let actives = []; // 购物车选中商品活动列表
                this.list.forEach(item=> {
                    item.goods.forEach(goods => {
                        if(goods.is_selected) {
                            result = true;
                            arr.push(goods.goods_id);

                            // 获取购物车选中商品活动类型
                            if(goods.activity_type?.length){
                                actives = [...new Set(actives.concat(goods.activity_type))]
                            }
                        }
                    })
                })
                // 存在多个活动类型商品时，不能同时下单
                if(actives.length>1){
                   return this.$toast('不同的活动类型 暂不支持同时下单')
                }

                if (result || this.footerObj.all_selected) {
                    this.$emit('create', arr)
                }

                //  else {
                //     this.$toast('未选择商品')
                // }
            },
            handleList() {
                let result = [];
                this.list.map(item => {
                    result.push(
                        ...item.goods
                    );
                });
                // 移至收藏夹
                let _selectedList = result.filter(item => {
                    return item.editStatus === true
                });
                if (_selectedList.length === 0) {
                    return
                }
                return _selectedList
            },
            favorites() {
                let _selectedList = this.handleList();
                let _id = _selectedList.map(item => item.id)
                this.$api.goodApi.delCart({
                    clear_all: 0,
                    favorite: 1,
                    id: _id.join(',')
                }).then((res) => {
                    if (res.error != 0) {
                        this.$toast(res.message)
                        return
                    }
                    this.$decorator.getModule('diymenu').getCartNum(true)
                    this.$toast('收藏成功')
                    this.$emit('getList')
                })
            },
            deleteFn() {
                let _selectedList = this.handleList();
                let _id = _selectedList.map(item => item.id)
                this.$api.goodApi.delCart({
                    clear_all: 0,
                    favorite: 0,
                    id: _id.join(',')
                }).then((res) => {
                    if (res.error != 0) {
                        this.$toast(res.message)
                        return
                    }
                    this.$decorator.getModule('diymenu').getCartNum(true)
                    this.$emit('getList')
                })
            },
        },
    }
</script>

<style lang="scss">
.card-footer {
    width: 100%;
    padding: 14rpx 24rpx;
    height: 96rpx;
    line-height: 96rpx;
    background-color: #fff;
    border-top: 1px solid $uni-border-color;
    color: $uni-text-color;
    font-size: 28rpx;
    box-sizing: border-box;
    .radio-box {
        padding-right: 16rpx;
        align-items: center;
        .iconfont-m- {
            font-size: px2rpx(24);
            color: $uni-border-color;
        }

        .icon-m-yes {
            font-size: px2rpx(24);
            line-height: px2rpx(24);
            text-align: center;
            border-radius: 50%;
            color: $uni-color-primary;
        }
        .disalbed-icon {
            height: px2rpx(18);
            width: px2rpx(18);
            border-radius: 50%;
            margin: px2rpx(3);
            background:#f5f5f5;
            border: px2rpx(1) solid #E6E7EB;
        }
    }

    .card-footer-content {
        height: 100%;
    }
    .count {
        .price {
            color: $uni-color-primary;
        }
    }
    .button {
        view {
            width: 200rpx;
            height: 68rpx;
            line-height: 68rpx;
            text-align: center;
            color: #fff;
            font-size: 28rpx;
        }
    }
    .create-btn {
        margin-left: 28rpx;
        border-radius: 34rpx;
        background: linear-gradient(
            159.69deg,
            $uni-color-primary 0%,
            #ff6f29 94.38%
        );

        &.disabled {
            background:#ccc;
        }
    }
    .favorite-btn {
        background: $uni-text-color;
        border-radius: 40rpx 0 0 40rpx;
    }
    .delete-btn {
        background: linear-gradient(
            159.69deg,
            $uni-color-primary 0%,
            #ff6f29 94.38%
        );
        border-radius: 0 40rpx 40rpx 0;
    }
}
</style>
