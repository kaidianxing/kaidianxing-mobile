/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <!-- <view class="article-coupon" >
        <view class="coupon-tag">{{couponDetail.tag}}</view>
        <view class="coupon-price">
            <span v-if="couponDetail.coupon_sale_type == '1'" class="span">￥</span>{{couponDetail.discount_price}}<span v-if="couponDetail.coupon_sale_type == '2'" class="span">折</span>
        </view>
        <view class="coupon-content">
            <view class="coupon-title">{{couponContent(couponDetail)}}</view>
            <view v-if="couponDetail.time_limit === '1'" class="coupon-content-text">{{couponDetail.time}}</view>
            <view v-else class="coupon-content-text">{{ couponDetail.start_time | formatTime }}~{{ couponDetail.end_time | formatTime }}</view>
        </view>
        <view class="coupon-btn">{{couponDetail.receive_status == 1 ? "去使用" : "立即领取"}}</view>
    </view> -->

    <view class="article-coupon" @click="toCoupon" v-if="couponDetail.coupon_member_status != '1'">
        <img class="coupon-bg" :src="$utils.staticMediaUrl('article/coupon-bg.png')" alt="" />
        <view class="left">
            <view class="coupon-price-icon" v-if="couponDetail.is_free == '0'">
                <img class="img" :src="$utils.staticMediaUrl('coupon/coupon-price-icon.png')" alt="" />
                <span>付费券</span>
            </view>
            <view class="box">
                <view class="price">
                    <span class="rmb" v-if="couponDetail.coupon_sale_type === '1'">¥</span>
                    <span class="num" >
                        {{ couponDetail.discount_price | formatPrice }}
                    </span>
                    <span class="discount" v-if="couponDetail.coupon_sale_type === '2'">折</span>
                </view>
                <view v-if="couponDetail.enough != '0.00'" class="rule">
                    满{{`¥${parseFloat(couponDetail.enough)}`}}可用
                </view>
                <view v-else class="rule">无门槛</view>
            </view>
            <view class="coupon-name">{{ couponDetail.coupon_name }}</view>
        </view>
        <view class="right">
            {{couponDetail.receive_status == 1 ? "去使用" : "立即领取"}}
        </view>
    </view>
</template>

<script>
export default {
    props: {
        couponData: {
            typa:Object,
            default: () => {}
        },
        articleId: {
            typa: String,
            default: ""
        }
    },
    filters: {
        formatPrice(value) {
            return parseFloat(value)
        },
        formatTime(value) {
            if (value) {
                return value.split(' ')[0].replace(/-/g, '/')
            } else {
                return ''
            }
            // return new Date(value).toLocaleDateString()
        },
    },
    data() {
        return {};
    },
    computed: {
        couponDetail() {
            let res = {};
            res = {
                id: this.couponData.coupon_id,
                tag: this.couponTag(this.couponData),
                time: this.couponTimeLimit(this.couponData),
                ...this.couponData
            }
            return res
        },
    },
    methods: {
		
		toCoupon() {
			const data = this.couponDetail
			if(this.couponDetail.receive_status != "1") {
			    const path = `/kdxMember/coupon/detail/index?id=${this.couponDetail.id}from=0`
				this.$Router.auto({
				    path,
				});
				return
			}
			if(data.goods_limit % 2 != 0) {
				uni.setStorageSync('coupon_desc',data.content)
				const path = "/kdxGoods/goodList/index"
				this.$Router.auto({
				    path,
				    query: {
						coupon_id: data.coupon_id,
						from: 'coupon',
				    },
				})
				return
			}
			this.$Router.replace({
			    //#ifndef H5
			    path: '/pages/index/index',
			    //#endif
			    //#ifdef H5
			    path: '/'
			    //#endif
			})
		},
        couponContent(data) {
            let res = "";
            if(data.coupon_sale_type == "2") {
                res = `满${parseFloat(data.enough)}享${parseFloat(data.discount_price)}折`;
            }else {
                res = `满${parseFloat(data.enough)}减${parseFloat(data.discount_price)}`;
            }
            return res
        },
        // 优惠券角标
        couponTag(data) {
            let res = "店铺优惠券"
            if(this.$utils.is_merchant) {
                res = "平台优惠券"
                // if(data.sub_shop_id != 0) {
                //     res = "商户优惠券"
                // }else {
                //     res = "平台优惠券"
                // }
            }
            return res
        },
        // 优惠券有效期
        couponTimeLimit(data) {
            let res = "";
            if(data.time_limit === "1") {
                if(data.limit_day === "0") {
                    res = "无限制"
                }else {
                    res = `领取${data.limit_day}日之内支持使用`
                }
            }
            return res
        },
    },
};
</script>
<style lang='scss' scoped>
// .article-coupon {
//     position: relative;
//     display: flex;
//     width: 100%;
//     justify-content: space-between;
//     background: #FDF5F1;
//     border-radius: px2rpx(6);
//     padding: px2rpx(20) px2rpx(12);
//     overflow: hidden;
//     margin: px2rpx(8) 0;
//     .coupon-tag {
//         position: absolute;
//         top: 0;
//         left: 0;
//         padding: px2rpx(1) px2rpx(20);
//         background: #FBE6E6;
//         color: $uni-color-primary;
//         font-size: px2rpx(10);
//         border-bottom-right-radius: px2rpx(6);
//     }
//     .coupon-price {
//         font-size: px2rpx(24);
//         color: $uni-color-primary;
//         line-height: px2rpx(34);
//         margin-top: px2rpx(2);
//         margin-right: px2rpx(12);
//         span {
//             font-size: px2rpx(14);
//             line-height: 2px2rpx(6);
//             line-height: px2rpx(18);
//         }
//     }
//     .coupon-content {
//         flex: 1;
//         .coupon-title {
//             font-size: px2rpx(14);
//             font-weight: bold;
//             color: $uni-text-color;
//             margin-bottom: px2rpx(8);
//         }
//         .coupon-content-text {
//             font-size: px2rpx(12);
//             color: #565656;
//         }
//     }
//     .coupon-btn {    
//         height: px2rpx(28);
//         line-height: px2rpx(14);
//         box-sizing: border-box;
//         align-self: center;
//         color: $uni-color-primary;
//         font-size: px2rpx(12);
//         padding: px2rpx(6) px2rpx(12);
//         border: 1px solid $uni-color-primary;
//         border-radius: px2rpx(79);
//     }
// }

.article-coupon {
    position: relative;
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    border-radius: 8rpx;
    overflow: hidden;
    .coupon-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
    .left {
        flex: 1;
        height: 156rpx;
        padding-left: 26rpx;
        flex-shrink: 0;
        position: relative;
        font-weight: 500;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 20rpx 0 0 20rpx;
        .coupon-price-icon{
            width: 120rpx;
            height: 28rpx;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 48rpx;
            & span{
                position: absolute;
                top: 46%;
                left: 50%;
                font-size: 20px;
                transform: translate(-50%,-50%) scale(0.5);
                color: #793A0F;
                white-space: nowrap;
            }
            & .img {
                width: 120rpx;
                height: 28rpx;
                
            }
        }
        .box {
            width: 160rpx;
            .price {
                color: #FF3C29;
                .rmb{
                    font-size: 32rpx;
                    font-weight: 600;
                }
                .num {
                    font-size: 60rpx;
                    font-weight: 600;
                }
                .discount{
                    font-size: 24rpx;
                    font-weight: 400;
                }
            }
            .rule {
                color: rgba(0, 0, 0, 0.6);
                font-size: 20rpx;
            }
        }
        
        .coupon-name {
            flex: 1;
            text-align: left;
            margin-left: 44rpx;
            font-size: 28rpx;
            color: #212121;
            font-weight: bold;
            white-space: nowrap; 
            overflow: hidden;
            text-overflow:ellipsis;
        }
    }
    .right {
        width: 160rpx;
        height: 156rpx;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: center;
        font-size: 28rpx;
        color: #FF3C29;
        font-weight: 600;
    }
}
</style>