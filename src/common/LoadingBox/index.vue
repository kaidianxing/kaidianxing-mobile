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
  <view v-if="isConfig">
    <!--flg<1房颤用-->
    <view v-if="isShowLoading && flg < 1">
      <!--如果是loading就现实否则直接加载slot显示内部骨架屏-->
      <custom-loading
        v-if="-1 !== style"
        :styles="style"
        :imgUrl="imgUrl"
        :styleRules="styleRules"
      ></custom-loading>
      <view v-else>
        <view v-if="false">
          骨架屏幕为了包的大小只能在分包处理了
        </view>
        <slot></slot>
      </view>
    </view>
    <view v-else class="content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapActions, mapState } = createNamespacedHelpers("loading");

import CustomLoading from "./components/CustomLoading";
export default {
  created(){
    // this.$loading.hideLoading();
  },
  
  data(){
    return{
      flg:0,
    }
  },
  watch:{
    isShowLoading(e){
      if(!e){
        ++this.flg
      }
    }
  },
  computed: {
    ...mapState(["isShowLoading", "style", "styleRules", "imgUrl", "isConfig"]),
  },
  components: {
    CustomLoading,
  },
};
</script>

<style lang="scss" scoped>
  .content {}
</style>
