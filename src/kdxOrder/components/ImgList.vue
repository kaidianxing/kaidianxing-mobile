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
  <view class="img-list">
    <view class="img-list-items" v-for="(item, index) in imgLists" :key="index">
      <image
         :src="$utils.mediaUrl(item.thumb)"
        :data-imgurl="item.thumb"
        @tap="detail(item)"
        class="img-list-image"
      />
      <slot name="foot" :row="item"></slot>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      imgLists: []
    }
  },
  created: function() {
    this.imgLists = this.items
  },
  computed: {
    getImg() {
      const lists = this.imgLists.map(v => {
        if (typeof v === 'object') {
          return v.thumb
        } else {
          return v
        }
      })
      return lists
    }
  },
  methods: {
    detail(id) {
      this.$emit('detail', id)
    }
  }
}
</script>
<style lang="scss" scoped>
.img-list {
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

.img-list-items {
  box-sizing: border-box;
  width: 120rpx;
  height: 120rpx;
  margin-right: 12rpx;
  font-size: 0;
  position: relative;
  border: 2rpx dashed #e6e7eb;

  &:last-child {
    margin-right: 0;
  }
}

.img-list-image {
  height: 100%;
  width: 100%;
}
</style>