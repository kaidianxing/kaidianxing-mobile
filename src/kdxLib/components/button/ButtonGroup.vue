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
 * @Description: 按钮组
 * @Autor:青岛开店星信息技术有限公司
-->
<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "ButtonGroup";
const BASECLASS = "kdx-button-group";

export default {
  name: NAME,
  mixins: [PublicMixin],
  props: {
    type: {
      type: String,
      default: "entity",
    },
    simple: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    classes() {
      return [
        `${BASECLASS}`,
        `${this.type}`,
        `${this.simple ? "" : "simple"}`,
        ...this.classNames,
      ].join(" ");
    },
  },
};
</script>
