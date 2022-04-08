<!--
 * @Description: 图片
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
  <div :class="classes" :style="style"></div>
</template>
<script>
// 工具类
import { oneOf } from "../../utils";
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "Img";

export default {
  name: NAME,
  mixins: [PublicMixin],
  props: {
    size: {
      validator(value) {
        return oneOf(value, [
          "small-1",
          "small-2",
          "middle-1",
          "middle-2",
          "large-1",
          "large-2",
        ]);
      },
      default: "small-1",
    },
    src: {
      type: String,
      default: "",
    },
  },
  computed: {
    // 样式计算
    classes() {
      return ["kdx-img-box", this.size].join(" ");
    },
    style() {
      return `background:url('${this.src}') no-repeat;background-size:auto 100%;`;
    },
  },
};
</script>
