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
  <view class="goods-list">
    <img-list :items="items" @detail="detail">
      <template v-slot:foot="{row}">
        <view class="price" v-if="row.price === '0.00' && row.credit !== '0'">{{ row.credit }}{{ credit_text }}</view>
        <view class="price" v-if="row.price !== '0.00' && row.credit === '0'">￥{{ row.price }}</view>
        <view class="price" v-if="row.price !== '0.00' && row.credit !== '0'">{{ row.credit }}{{ credit_text }}+￥{{ row.price }}</view>
      </template>
    </img-list>
  </view>
</template>

<script>
import ImgList from '../ImgList'
import { mapState } from 'vuex'

export default {
  props: {
    items: Array
  },
  components: {
    ImgList
  },
  computed: {
    ...mapState('setting', {
      credit_text: state => state.systemSetting.credit_text,
    }),
  },
  methods: {
    detail(id) {
      this.$emit('detail', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-list {}
</style>