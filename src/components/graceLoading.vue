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
<template name="graceLoading">
	<view class="grace-loading grace-ellipsis" v-if="loadingType < 4">
		<text :style="{color:textColor}">{{loadingText[loadingType]}}</text>
	</view>
</template>
<script>
export default {
	props: {
		loadingType: {
			type : Number,
			default: 0
		},
		loadingText : {
			type  : Array,
			default : function () {
				// 0 上拉加载更多
				// 1 加载中
				// 2 加载全部
				// 3 空文本
				// 4 不展示组件
				return ["上拉加载更多", "正在努力加载", "已经加载全部数据",'',''];
			}
		},
		iconColor : {
			type : String,
			default : "#888888"
		},
		textColor : {
			type : String,
			default : "#888888"
		}
	}
}
</script>
<style scoped>
@keyframes grace-rotate360{0%{transform:rotate(0deg);} 50%{transform:rotate(180deg);} 100%{transform:rotate(360deg);}}
.grace-loading{display:flex; width:100%; justify-content:center; padding:16rpx 0; padding-bottom:36rpx; line-height:40rpx; color:#888;}
.grace-loading text{margin-left:12rpx;}
.grace-loading-icon{width:40rpx; height:40rpx; justify-content:center; line-height:40rpx; font-size:30rpx; text-align:center; font-family:"grace-iconfont"; animation:grace-rotate360 1200ms infinite linear;}
.grace-loading-icon:before {content:"\e9db";}
</style>