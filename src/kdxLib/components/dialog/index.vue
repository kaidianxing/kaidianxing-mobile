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
<!--
 * @Description: 默认弹窗
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div v-if="isShowDialog" :class="classes" :style="style">
        <div class="shadow-wrap"></div>
        <div class="ct-wrap">
          <div class="tith">
            <div class="th">{{tith}}</div>
            <div class="close" @click="controlDialogStatus">
              <slot name="close"></slot>
            </div>
          </div>
          <div class="main">
            <slot name="main"></slot>
          </div>
          <div v-if="isShowButton" class="sub hairline--top">
            <btn type="do" size="middle">关闭</btn>
          </div>
        </div>
    </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "DefaultDialog";

export default{
  name: NAME,
  mixins: [PublicMixin],
  props: {
    // 主标题
    tith: {
      type: String,
      default: " ",
    },
    // 是否显示按钮
    isShowButton:{
      type: Boolean,
      default: false,
    },
    // 是否显示dialog
    isShowDialog: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
    }
  },
  methods:{
    controlDialogStatus(){
      // this.isShowDialog = false;
      this.$emit("on-close", false);
    }
  },
  computed: {
      // 样式计算
      classes() {
        return ["kdx-default-dialog-wrap", this.size,...this.classNames].join(" ");
      },
      style() {
        return `${this.styles}`;
      }
  }
}
</script>