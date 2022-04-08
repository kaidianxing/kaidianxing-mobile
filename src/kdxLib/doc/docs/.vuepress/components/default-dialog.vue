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
            <button-sqx type="do" size="middle">关闭</button-sqx>
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
        return ["kdx-default-dialog-wrap", ...this.classNames].join(" ");
      },
      style() {
        return `${this.styles}`;
      }
  }
}
</script>