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
    <view class="goods-content">
        <view class="goods-card" :class="[{'active': item.is_selected === true},{'borderRadius': list.length===1}]"
              v-for="(item, index) in list" :key="item.id">
            <div class="goods-card-box">
                <view class="flex">
                  <view class="flex radio-box" @click='radioChange(item, 0)' v-if="!editStatus">
                    <image class="lose-icon" :src="$utils.staticMediaUrl('default/lose_goods.svg')" v-if="item.is_lose_efficacy=='1'"/>
                    <i class="disalbed-icon" v-else-if="getDisabled(item)"></i>
                    <i class="icon-m-yes iconfont-m- theme-primary-color" v-else-if="item.is_selected === true"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                  </view>
                  <view class="flex radio-box" @click='editRadioChange(index)' v-else>
                    <i class="icon-m-yes iconfont-m- theme-primary-color" v-if="item.editStatus === true"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                  </view>
                  <view class="grace-list-body">
                    <view class="goods-block-inner flex">
                      <view class="goods-image" :style="backgroundImage">
                        <image class='grace-img-lazy' :src="$utils.mediaUrl(item.thumb)" @click='detail(item)'/>
                      </view>
                      <view class="goods-info flex1 flex-column" :data-msgindex="index">
                        <view class="title-box" @click='detail(item)'>
                          <view class='title two-line-hide'>{{item.title}}</view>
                          <view class='option-title two-line-hide' v-if="item.option_title">{{item.option_title}}</view>
                        </view>
                        <view class="price-box flex-between">
                          <!-- 商品失效 -->
                          <view v-if="item.is_lose_efficacy=='1'">商品已下架</view>
                          <!-- 商品权限已变更 -->
                          <view class="choose-text" v-else-if="item.buy_perm =='0'">商品权限已变更</view>
                          <!-- 重选规格 -->
                          <view class="choose-text" v-else-if="item.is_reelect =='1'">重新选择商品规格</view>
                          <view class="choose-text" v-else-if="item.stock =='0'">商品已售罄</view>
                          <view class="price theme-primary-price" v-else>￥<text class="primary-price">{{item.price}}</text></view>
                        </view>
                      </view>
                    </view>

                    <!-- 重选规格 -->
                    <view class="choose-btn" @click="choose(item)"  v-if="item.is_reelect =='1'">重选</view>
                    <!-- 1.商品库存为0 2.没有购买权限 3.失效商品-->
                    <block v-else-if="item.stock == '0' || item.buy_perm=='0' || item.is_lose_efficacy=='1'" ></block>
                    <view class="add-num" v-else>
                      <span
                          class="iconfont-m- icon-m-jianhao action-icon left"
                          :class="{'disabled':(item.total<=1)}"
                          @click.stop="clickAdd(-1, item)"
                      ></span>
                      <input class="goods-total" type="number" v-model="item.total" @input="handlerChangeNumber($event, item)" @blur="handlerBlurNumber($event, item)"/>
                      <span
                          class="iconfont-m- icon-m-jiahao action-icon right"
                          :class="{'disabled':(item.total==item.stock)}"
                          @click.stop="clickAdd(1, item)"
                      ></span>
                      <!--                        <div class="numLimit">

                                              </div>-->
                    </view>
                  </view>
                </view>
                <view class="limitBuy"  v-if="item.single_max_buy && item.is_reelect !='1'">
                  <view class="uni-color-primary limit-color">
                    <span>限购{{item.single_max_buy}}件</span>
                  </view>
                </view>

                <view class="grace-fun-btn" :style="{width:funBtnsWidthShow+'px'}" v-if="moveindex == index">
                    <text class="grace-fun-btns" @click.stop="remove(item.goods_id, item.option_id)">删除</text>
                </view>
            </div>
        </view>
    </view>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        props: {
            list: {
                type: Array,
                default: () => []
            },
            editStatus: {
                type: Boolean,
                default: false,
            },
            merchantId: {
                type: [String, Number],
                default: 0,
            },
            parentIndex: {
                type: [String,Number]
            }
        },
        data() {
            return {
                isShow: [],
                funBtnsWidth: 45,
                funBtnsWidthShow: 0,
                moveStart: 0,
                moveindex: -1,
            }
        },
        computed: {
            backgroundImage() {
                return `background-image:url(${this.$utils.staticMediaUrl('decorate/goods_col2.png')})`
            },
        },
        methods: {
            radioChange(data, selectAll) {
                // 判断购买权限
                if (this.getDisabled(data)) {
                    return
                }
                let args = {};
                args.select_all = selectAll;
                args.id = data.id || 0;
                this.$api.goodApi.selectCart(args).then(res => {
                    if (res.error != 0) {
                        uni.showToast({
                            title: res.message,
                            icon: 'none'
                        })
                        return;
                    }
                    this.$emit('getList')
                })
            },
            getDisabled(item){
                // 1.商品规格变更 2.库存为0
                return item.is_reelect =='1' ||  
                item.stock == '0'|| 
                item.buy_perm == '0' || item.is_lose_efficacy == '1'
            },
           
            // 输入数量
            handlerChangeNumber(e, item) {
                setTimeout(() => {
                    let max_buy = item.stock;
                    let min_buy = 1;
                    let num = Number(parseInt(e.target.value));
                    if (num === 0) {
                        item.total = 1
                        return
                    }
                    /*if(num <= min_buy) {
                      item.total = min_buy
                      return;
                    }*/
                    item.total = num;
                    setTimeout(() => {
                        if (item.total > max_buy) {
                            item.total = max_buy;
                            this.$toast('库存不足');
                            return
                        }

                    }, 0)
                },0)
            },
            handlerBlurNumber(e, item) {
                this.changeNum(item, 2, item.total)
            },
            clickAdd(type, item) {
                let max_buy = item.stock;
                let min_buy = 1;
                if (type == 1) {
                    // 增加购物车页面
                    item.total++;
                    if (item.total > max_buy) {
                        item.total = max_buy;
                        this.$toast('不能增加了');
                        return
                    }else if(item.total > item.stock) { // 超库存
                        item.total = item.stock;
                        this.$toast('不能增加了');
                        return
                    }
                    this.changeNum(item, 1, 1)
                } else {
                    // 减少
                    item.total--;
                    if (item.total < min_buy) {
                        item.total = min_buy;
                        this.$toast('不能减少了');
                        return
                    }else if(item.total < 1) {
                        item.total = 1;
                        this.$toast('不能减少了');
                        return
                    }
                    this.changeNum(item, 0, 1)
                }
            },
            changeNum(data, type, total) {
                let args = {
                    total: total,
                    goods_id: data.goods_id,
                    option_id: data.option_id || 0,
                    mode: type  // 1 加 0 减 2 输入的数量值
                };
                this.$api.goodApi.changeCartNum(args).then(res => {
                    if (res.error != 0) {
                        this.$toast(res.message);
                        return;
                    }
                    this.$emit('getList')
                    this.$decorator.getModule('diymenu').getCartNum(true)
                })
            },
           
            editRadioChange(index) {
                this.$emit('editRadioChange', index, this.parentIndex)
            },
            detail(item) {
                // 失效 删除商品跳转失效页面
                if(item.is_lose_efficacy =='1') {
                    this.$Router.auto({
                        path: '/kdxGoods/invalid/index',
                    })
                } else {
                    this.$Router.auto({
                        path: '/kdxGoods/detail/index',
                        query: {
                            goods_id: item.goods_id
                        }
                    })
                }
                
            },
            remove(goodsId, optionId) {
                let args = {
                    clear_all: 0,
                    goods_id: goodsId || 0,
                    option_id: optionId || 0,
                    favorite: 0
                };
                this.$api.goodApi.delCart(args).then(res => {
                    if (res.error != 0) {
                        this.$toast(res.message)
                        return;
                    }
                    this.$decorator.getModule('diymenu').getCartNum(true)
                    this.moveindex = -1;
                    this.$emit('getList')
                })
            },
            // 重选规格
            choose({goods_id,id}){
                this.$emit('on-choose',{goods_id,id});
            },
            // 左滑删除
            // touchstart(e) {
            //     this.moveindex = e.currentTarget.dataset.msgindex;
            //     this.moveStart = e.changedTouches[0].pageX;
            // },
            // touchend(e) {
            //     if (this.funBtnsWidthShow > 0) {
            //         this.funBtnsWidthShow = this.funBtnsWidth;
            //     } else {
            //         this.moveindex = '-';
            //     }
            // },
            // touchmove(e) {
            //     var moveX = e.changedTouches[0].pageX - this.moveStart;
            //     if (moveX < 0) {
            //         moveX = moveX * -1;
            //         if (moveX > this.funBtnsWidth) {
            //             moveX = this.funBtnsWidth;
            //         }
            //         this.funBtnsWidthShow = moveX;
            //     } else {
            //         this.funBtnsWidthShow = 0;
            //     }
            // },
        },
    }
</script>

<style lang="scss" scoped>
    .goods-content {
        flex: 1;
        /*border-radius: 12rpx;*/
        overflow: auto;
        box-sizing: border-box;
        .goods-card {
            padding: 32rpx 24rpx 32rpx 18rpx;
            background-color: #fff;
            &.active {
                background-color: #fafafa;
            }
            &.borderRadius {
                // border-radius: px2rpx(6) !important;
            }
            &:first-child {
                // border-radius: px2rpx(6) px2rpx(6) 0 0;
            }
            &:last-child {
                // border-radius: 0 0 px2rpx(6) px2rpx(6);
            }
            .goods-card-box {
                align-items: center;
            }
            .no-selected-tips {
                padding-left: 66rpx;
                color: #FF3C29;
                padding-top: 16rpx;
                font-size: 20rpx;
                line-height: 28rpx;
            }
            .grace-list-body {
                position: relative;
                width: 100%;
                margin: 0;
                padding: 0;
                transition: transform .15s ease-in-out,-webkit-transform .15s ease-in-out;
            }
            .radio-box {
                padding-right: 18rpx;
                align-items: center;

                .lose-icon {
                    width: px2rpx(24);
                    height: px2rpx(24);
                }

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
        }
        .grace-fun-btn {
            width: 120rpx;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            margin-left: 20rpx;
            z-index: 2;
            transition: transform .15s ease-in-out,-webkit-transform .15s ease-in-out;
        }
        .grace-fun-btns {
            display: block;
            width: 120rpx;
            text-align: center;
            line-height: 160rpx;
            background-color: #FF0036;
            color: #FFFFFF;
            font-size: 28rpx;
            height: 160rpx;
            overflow: hidden;
        }
        .goods-block-inner {
            position: relative;
            overflow: hidden;
            .goods-image {
                flex-shrink: 0;
                width: 180rpx;
                height: 180rpx;
                margin-right: 24rpx;
                position: relative;
                border-radius: 6rpx;
                background-color: #fff;
                background-position: 0% 0%;
                background-size: 100% 100%;
                background-repeat: no-repeat;

                image {
                    width: 180rpx;
                    height: 180rpx;
                    border-radius: 6rpx;
                    display: block;
                }
            }
            .goods-info {
                justify-content: space-between;
                color: $uni-text-color;
                font-size: 28rpx;
                overflow: hidden;
                .title {
                    line-height: 34rpx;
                }
                .option-title {
                    width: fit-content;
                    margin-top: 7px;
                    padding: 1px 16rpx;
                    color: $uni-text-color-grey;
                    font-size: 20rpx;
                    background: $uni-bg-color-grey;
                    border-radius: 22rpx;
                }
                .price-box {
                    align-items: center;
                    //height: px2rpx(40);
                    .choose-text {
                        font-size: px2rpx(12);
                        line-height: px2rpx(21);
                        color:#212121;
                    }
                }
                .price {
                    color: $uni-color-primary;
                    font-size: 24rpx;
                    //margin-top: -16px;
                }
            }
        }
        .add-num {
            position: absolute;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            //flex-direction: column;
            height: px2rpx(24);
            .goods-total {
                display: inline-block;
                height: px2rpx(18);
                margin: px2rpx(4) 0;
                line-height: px2rpx(18);
                background: $uni-bg-color-grey;
                border-radius: px2rpx(2);
                color: #212121;
                font-size: px2rpx(12);
                text-align: center;
                width: px2rpx(36);
            }

            .action-icon {
                font-size: px2rpx(12);
                padding: px2rpx(6) px2rpx(6) px2rpx(4);
                font-weight: bold;
                position: relative;
                &.left:after {
                    content: '';
                    position: absolute;
                    width: px2rpx(32);
                    height: px2rpx(32);
                    left: -16rpx;
                    top: -8rpx;
                    /*padding-left: 38rpx;*/
                    /*padding-right: 8rpx;*/
                }

                &.right:after {
                    /*padding-left: 8rpx;*/
                    content: '';
                    position: absolute;
                    width: px2rpx(32);
                    height: px2rpx(32);
                    right: -16rpx;
                    top: 50%;
                    margin-top: -32rpx;
                }
                &.disabled {
                    color: #ccc;
                }
            }
            .numLimit {
                display: flex;
                align-items: center;
            }
        }
      .limitBuy {
        display: flex;
        justify-content: flex-end;
        height: px2rpx(14);
         .limit-color {
           line-height: 14px;
           font-size: 10px;
           font-weight: 400;
           width: px2rpx(84);
           text-align: center;
         }
      }

      
        .choose-btn,.lose-del-btn {
            position: absolute;
            right: 0;
            bottom: 0;
            border-radius: px2rpx(40);
            width: px2rpx(44);
            height: px2rpx(21);
            font-size: px2rpx(12);
            line-height:px2rpx(21);
            text-align:center;
            background:#fff;
        }

        .choose-btn {
            border: px2rpx(1) solid #FF3C29;
            color: #ff3c29;
        }

        .lose-del-btn {
            border: px2rpx(1) solid #E6E7EB;
            color: #212121;
        }

    }
</style>
