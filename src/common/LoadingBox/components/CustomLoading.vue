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
  <view
    class="custom-loading"
    :style="{ position: type === 'page' ? 'fixed' : 'absolute' }"
  >
    <block v-if="!imgUrl">
      <div class="loading-default-block" v-if="styles === 1">
        <div
          class="loading-block-top-left"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div
          class="loading-block-top-right"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div
          class="loading-block-bottom-left"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div
          class="loading-block-bottom-right"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
      </div>

      <div class="loading-content-circle" v-else-if="styles === 0">
        <div class="circle-item-box">
          <div
            class="loading-circle-item"
            :style="{ backgroundColor: backgroundColor }"
          ></div>
          <div
            class="loading-circle-item"
            :style="{ backgroundColor: backgroundColor }"
          ></div>
        </div>
      </div>
      <div class="loading-default-line" v-else>
        <div
          class="loading-line-left"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div
          class="loading-line-middle"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div
          class="loading-line-right"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
      </div>
    </block>
    <block v-else>
      <div class="loading-image">
        <image :src="imgUrlStr"></image>
      </div>
    </block>
  </view>
</template>

<script>
import * as utils from "@/common/util.js";

export default {
  name: "CustomLoading",
  props: {
    // 获取loading类型
    styles: {
      type: Number,
      default: 0,
    },
    styleRules: {
      type: Object,
      default: () => ({}),
    },
    imgUrl: {
      type: String,
      imgUrl: "",
    },
    type: {
      // page/tab
      type: String,
      default: "page",
    },
    loadingStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingPageStatus: false,
    };
  },
  computed: {
    imgUrlStr() {
      return utils.mediaUrl(this.imgUrl);
    },
    loading() {
      // 骨架屏状态
      if (this.loadingType == "2") {
        return false;
      }
      let res = false;
      switch (this.type) {
        case "page":
          // #ifndef H5
          res = this.$store?.state?.loading?.loading;
          // #endif
          // #ifdef H5
          res = this.loadingPageStatus;
          // #endif
          break;
        case "tab":
          res = this.loadingStatus;
          break;
        default:
          res = false;
      }
      return res;
    },
    backgroundColor() {
      return this.styleRules.color || "#f5f5f5";
    },
    loadingType() {
      return this.$store?.state?.loading?.type || "0";
    },
    loadingStyle() {
      return this.$store?.state?.loading?.style || "0";
    },
  },
  methods: {
    show() {
      this.loadingPageStatus = true;
    },
    hide() {
      this.loadingPageStatus = false;
    },
  },
};
</script>

<style scoped lang="scss">
.custom-loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  z-index: 9999999999;
  > div {
    width: px2rpx(60);
    height: px2rpx(60);
  }
  .loading-content-circle {
    //width: 80rpx;
    //height: 80rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(px2rpx(-30), px2rpx(-30));
    .circle-item-box {
      width: px2rpx(30);
      height: px2rpx(30);
      position: relative;
    }
    .loading-circle-item {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #ff3c29;
      animation: loading-circle 1.6s linear infinite;
      opacity: 0.2;
      &:nth-child(2) {
        animation-delay: 0.8s;
      }
    }
  }
  .loading-default-block {
    //width: px2rpx(50);
    // height: px2rpx(50);
    position: relative;
    .loading-block-top-left,
    .loading-block-top-right,
    .loading-block-bottom-left,
    .loading-block-bottom-right {
      position: absolute;
      width: px2rpx(12);
      height: px2rpx(12);
      opacity: 0.2;
      transform: translate3d(0,0,0);
      -webkit-transform: translate3d(0,0,0);      
    }
    .loading-block-top-left {
      top: px2rpx(15);
      left: px2rpx(15);
      animation: default-block 1.2s ease-in-out infinite 0s;
    }
    .loading-block-top-right {
      top: px2rpx(15);
      left: px2rpx(33);
      animation: default-block 1.2s ease-in-out infinite 0.3s;
    }
    .loading-block-bottom-left {
      top: px2rpx(33);
      left: px2rpx(15);
      animation: default-block 1.2s ease-in-out infinite 0.9s;
    }
    .loading-block-bottom-right {
      top: px2rpx(33);
      left: px2rpx(33);
      animation: default-block 1.2s ease-in-out infinite 0.6s;
    }
  }
  .loading-default-line {
    //width: px2rpx(50);
    //height: px2rpx(30);
    display: flex;
    align-items: center;
    justify-content: center;
    div {
      margin-right: px2rpx(6);
      &:last-child {
        margin-right: 0;
      }
    }
    .loading-line-left,
    .loading-line-middle,
    .loading-line-right {
      width: px2rpx(6);
      height: px2rpx(30);
    }
    .loading-line-left {
      animation: default-line infinite 1.2s ease-in-out -0.2s;
    }
    .loading-line-middle {
      animation: default-line infinite 1.2s ease-in-out -0.4s;
    }
    .loading-line-right {
      animation: default-line infinite 1.2s ease-in-out -0.6s;
    }
  }
  .loading-image {
    image {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
@keyframes loading-circle {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
@keyframes default-block {
  0%,
  50%,
  75%,
  100% {
    opacity: 0.2;
  }
  25% {
    opacity: 1;
  }
}
@keyframes default-line {
  0%,
  100% {
    transform: scaleY(0.1);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>
