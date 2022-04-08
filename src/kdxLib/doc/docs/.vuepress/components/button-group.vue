<!--
 * @Description: 按钮组
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
  <div :class="classes">
    <button-sqx size="middle" class="group" type="default">default</button-sqx>
    <button-sqx size="middle" class="group" type="default">default</button-sqx>
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
  },
  computed: {
    classes() {
      return [`${BASECLASS}`, `${this.type}`, ...this.classNames].join(" ");
    },
  },
};
</script>
