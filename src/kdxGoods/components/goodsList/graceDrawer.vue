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
	<view class="grace-drawer-shade" v-if="show" @tap.stop="closeDrawer" @touchmove.stop @touchmove.prevent :style="{background:background}">
		<view  :class="['grace-drawer-shade-nav', direction == 'left' ? 'gdSlideLeft' : 'gdSlideRight']" :style="{width:width,padding:padding}" @tap.stop="stopFun">
			<slot name="links"></slot>
		</view>
	</view>
</template>
<script>
export default {
	name: "graceDrawer",
	props: {
		show : {
			type : Boolean,
			default : false
		},
		direction : {
			type : String,
			default : 'left'
		},
		width : {
			type : String,
			default : '60%'
		},
		background:{
			type : String,
			default : 'rgba(0, 0, 0, 0.5)'
		},
		padding :{
			type : String,
			default : '30rpx'
		}
	},
	methods:{
		closeDrawer : function(){
			this.$emit('closeDrawer');
		},
		stopFun : function(){}
	}
}
</script>
<style>
@keyframes gdSlideLeft{ from {left:-300px; } 100% { left:0px; }}
.gdSlideLeft {animation:gdSlideLeft 200ms linear; left:0;}
@keyframes gdSlideRight{ from {right:-300px; } 100% { right:0px; }}
.gdSlideRight {animation:gdSlideRight 200ms linear; right:0;}
.grace-drawer-shade{position:fixed; width:100%; height:100%; top:0; left:0; z-index:9991; background:rgba(0, 0, 0, 0.5);}
.grace-drawer-shade-nav{height:100%; background:#FFFFFF; position:absolute; top:0; z-index:9992; box-sizing:border-box;}
</style>