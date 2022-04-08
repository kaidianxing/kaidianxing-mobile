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
  <view class="address">
    <refund-cell title="退货地址" prefixIcon="icon-m-dingwei" prefix-class="prefix theme-primary-color">
      <template v-slot:append>
        <btn :classNames="['ptb','theme-primary-bgcolor']" type="do" @btn-click="submitExpress">查看并填写快递信息</btn>
      </template>
    </refund-cell>
  </view>
</template>


<script>
import RefundCell from '../RefundCell'

export default {
  components: {
    RefundCell
  },
  methods: {
    submitExpress() {
      this.$emit('express')
    }
  }
}
</script>


<style lang="scss" scoped>
.address {
  overflow: hidden;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  background-color: #fff;
  /deep/ .cell {
    .cell-inner {
      border-bottom: none;
    }
  }

   .prefix {
    margin-right: 16rpx;
    font-size: 40rpx;
  }
}
</style>