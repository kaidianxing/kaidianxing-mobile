<template>
  <div class="detail-img">
    <!-- 商品 -->
    <div class="detail_swipe">
      <MySwiper
        ref="myswiper"
        :list="list"
        :refreshKey="key"
        @refresh="refresh"
        @change="change"
        @click="click"
      ></MySwiper>
      <ul class="dots round" v-if="list.length > 1">
        <li
          class="dot"
          :class="{ active: activeIndex == index, video: list[index].video }"
          v-for="(item, index) in list"
          :key="index"
        >
          <i class="dot-img icon-m-shipin iconfont-m-"></i>
        </li>
      </ul>
    </div>
    <!-- 优惠券 -->
  </div>
</template>

<script>
import MySwiper from "@/components/decorate/templates-shim/GoodSwiper.vue";

export default {
  name: "DetailSwipe",
  components: {
    MySwiper,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0,
      key: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    // console.log(this.list,'.list>>>>>>');
  },
  methods: {
    refresh(k) {
      this.key = k;
    },
    change(val) {
      this.activeIndex = val;
    },
    click(index) {
      console.log(index);
      // if(this.componentData.params.video) {
      //     index = index - 1
      // }
      // this.$emit('custom-event', {
      //     target: 'detail_swipe/clickImg',
      //     data: {
      //         items:this.componentData.data.map(v=>v.imgurl),
      //         index,
      //         // linkurl: this.componentData.data[index].linkurl // liuxinghai删除
      //     }
      // })
    },
  },
};
</script>

<style lang="scss" scoped>
.detail_swipe {
  -webkit-overflow-scrolling: touch;
  position: relative;
  width: px2rpx(375);
  height: px2rpx(375);
  margin: 0 auto;
  overflow: hidden;
  swiper {
    width: 100%;
    height: px2rpx(375) !important;
    view,
    swiper,
    swiper-item,
    image {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }
  .swiper {
    width: 100%;
    height: px2rpx(375) !important;
    view,
    swiper,
    swiper-item,
    img {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .dots {
    bottom: 0;
    position: absolute;
    display: flex;
    bottom: px2rpx(16);
    box-sizing: border-box;
    left: 0;
    right: 0;
    padding: 0 px2rpx(24);
    margin: px2rpx(5);
    justify-content: center;
    text-align: center;
    opacity: 0.8;
    .dot {
      width: px2rpx(6);
      height: px2rpx(6);
      background: $uni-text-color;
      margin: auto px2rpx(3);
      opacity: 0.34;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .dot-img {
      width: px2rpx(12);
      height: px2rpx(12);
      font-size: px2rpx(12);
      line-height: px2rpx(12);
      text-align: center;
      margin: auto;
      color: #c4c4c4;
    }
    .dot.active {
      opacity: 1;
    }
    &.round {
      .dot.video {
        width: px2rpx(12);
        height: px2rpx(12);
        background: rgba(0, 0, 0, 0) !important;
        color: #c4c4c4;
        opacity: 1;
        transform: scale(0.9);
      }
      .dot.video.active {
        background: #c4c4c4 !important;
        color: #212121;
        opacity: 1;
      }
    }
  }
  .detail_video {
    width: px2rpx(375);
    height: px2rpx(375);
    display: flex;
    position: relative;
    &.ratio-0 {
      height:rpx(345);
    } // 4:3
    &.ratio-1 {
      height:rpx(459);
    } // 1:1
    &.ratio-2 {
      height:rpx(612);
    }
    .myvideo {
      width: 100%;
      height: 100%;
      border-radius: px2rpx(6);
    }
    .modal {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      z-index: 10;
      .poster {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
      }
      .pause {
        display: block;
        width:rpx(120);
        margin: auto;
        position: relative;
        z-index: 100;
      }
    }
  }
}
</style>
