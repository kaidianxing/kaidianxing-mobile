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
  <view class="tip-box">
    <view class="flex flex-between align-center header">
      <view>
        <text class="iconfont-m- icon-m-tishi tip-icon"></text>
        <text class="title">{{title}}</text>
      </view>
      <view class="action-text" @click="show = !show">{{show? '收起':'展开'}}</view>
    </view>
    <view class="content" v-if="show" v-html="formatHtml(content)"></view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    content: String
  },
  data() {
    return {
      show: false
    }
  },
    methods: {
        formatHtml(content) {
            // #ifdef MP-TOUTIAO
            // 字节跳动小程序不识别 引号 特殊字符， 需要转一下
            content = content.replace(/&ldquo;/g, '“')
            return content.replace(/&rdquo;/g, '”')
            // #endif
            // #ifndef MP-TOUTIAO
            return content
            // #endif
        },
    },
}
</script>

<style lang="scss" scoped>
.tip-box {
  margin-bottom: 16rpx;
  box-sizing: border-box;
  border: 2rpx solid #ffcdd0;
  border-radius: 12rpx;
  padding: 0 24rpx;
  background: #fff3f5;

  .header {
    padding-left: 2rpx;
    height: 68rpx;

    .tip-icon {
      margin-right: 10rpx;
      font-size: 24rpx;
      color: $uni-color-primary;
    }

    .title {
      font-size: 24rpx;
      line-height: 34rpx;
      color: $uni-color-primary;
    }

    .action-text {
      font-size: 24rpx;
      line-height: 34rpx;
      color: #518def;
    }
  }

  .content {
    margin-bottom: 16rpx;
    font-size: 24rpx;
    line-height: 28rpx;
    color: $uni-text-color;
  }
}
</style>