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
      return ["kdx-img-box", this.size, ...this.classNames].join(" ");
    },
    style() {
      return `background:url('${this.src}') no-repeat;background-size:auto 100%;${this.styles}`;
    },
  },
};
</script>
