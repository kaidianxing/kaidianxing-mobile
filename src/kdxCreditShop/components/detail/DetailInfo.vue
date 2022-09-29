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
  <div class="detail-info">
    <div class="price-floor">
      <div>
        <span class="max">{{ infoData.min_price_credit }}</span>
        <span class="min">{{ credit_text }}</span>
        <span class="max">+</span>
        <span class="max">{{ infoData.min_price }}</span>
        <span class="min">元</span>
      </div>
      <div class="origin-price-line">￥{{ infoData.origin_min_price }}</div>
      <i class="iconfont-m- icon-m-jifen1-1"></i>
    </div>

    <div class="title-floor floor">
      <p class="title">{{ infoData.title }}</p>
    </div>

    <div class="desc-floor floor" v-if="infoData.type === '0' && infoData.sub_title">
      {{ infoData.sub_title }}
    </div>

    <div class="express-floor floor">
      <p v-if="infoData.type === '0'">
        <i class="icon-m-shangpinxiangqing-kuaidi iconfont-m-"></i>
        <span class="floor-text">运费：{{ infoData.expressFee }}</span>
      </p>
      <p v-if="infoData.type === '0'">
        <i class="icon-m-shangpinxiangqing-xiaoliang iconfont-m-"></i>
        <span class="floor-text">销量：{{ infoData.sales }}</span>
      </p>
      <p>
        <i class="icon-m-kucun iconfont-m-"></i>
        <span class="floor-text">库存：{{ infoData.credit_shop_stock }}</span>
      </p>
    </div>

    <!-- 分享 -->
    <div class="float-share" @click.stop="clickShare">
      <i class="share-icon iconfont-m- icon-m-shangpinxiangqing-fenxiang"></i>
      <span class="share-word">分享</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DetailInfo",
  components: {},
  props: {
    infoData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("setting", {
      credit_text: (state) => state.systemSetting.credit_text,
    }),
  },
  created() {},
  mounted() {},
  methods: {
    clickShare() {
      this.$emit("clickShare");
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-info {
  position: relative;
  padding: px2rpx(57) px2rpx(12) px2rpx(9);
  background-color: #fff;
  .floor {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    &-text {
      margin-left: px2rpx(4);
    }
  }
  .price-floor {
    position: absolute;
    left: px2rpx(8);
    top: px2rpx(-39);
    align-items: center;
    width: px2rpx(359);
    height: px2rpx(72);
    padding: px2rpx(8) px2rpx(12);
    background: linear-gradient(90deg, #ffb800 0%, #fd8620 100%);
    border-radius: px2rpx(6);
    overflow: hidden;
    .icon-m-jifen1-1 {
      position: absolute;
      right: 0;
      bottom: px2rpx(-18);
      width: px2rpx(60);
      height: px2rpx(60);
      font-size: px2rpx(60);
      color: #fff;
      opacity: 0.2;
    }
    span {
      color: #fff;
    }
    .max {
      font-size: px2rpx(28);
    }
    .min {
      font-size: px2rpx(16);
    }
    .origin-price-line {
      margin-left: px2rpx(4);
      line-height: px2rpx(17);
      font-size: px2rpx(12);
      text-decoration: line-through;
      color: #fff;
      opacity: 0.8;
    }
  }
  .title-floor {
    margin-bottom: px2rpx(8);
    .title {
      color: $uni-text-color;
      width: 0;
      flex: 1;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: bold;
      font-size: px2rpx(14);
      line-height: px2rpx(20);
    }
  }
  .desc-floor {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: px2rpx(12);
    line-height: px2rpx(17);
    color: #969696;
    margin-bottom: px2rpx(8);
  }
  .express-floor {
    justify-content: space-between;
    p {
      line-height: px2rpx(17);
      font-size: px2rpx(12);
      color: $uni-text-color-grey;
    }
    color: $uni-text-color-grey;
    .iconfont-m- {
      vertical-align: px2rpx(-2);
    }
  }

  .float-share {
    position: fixed;
    right: 0;
    top: 60%;
    background: rgba(0, 0, 0, 0.5);
    font-size: px2rpx(12);
    text-align: center;
    line-height: px2rpx(24);
    height: px2rpx(24);
    color: #fff;
    padding: 0 px2rpx(6);
    border-radius: px2rpx(12) 0 0 px2rpx(12);
    z-index: 666;
    display: flex;

    .share-icon {
      display: inline-block;
      width: px2rpx(18);
      height: px2rpx(18);
      font-size: px2rpx(14);
      line-height: px2rpx(18);
      text-align: center;
      margin: auto px2rpx(2);
    }

    .share-word {
      text-align: center;
      font-size: px2rpx(10);
      line-height: px2rpx(18);
      height: px2rpx(18);
      margin: auto 0;
    }
  }
}
</style>