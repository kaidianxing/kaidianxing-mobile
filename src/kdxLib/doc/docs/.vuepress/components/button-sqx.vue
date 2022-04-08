<template>
  <Button
    :style="styles"
    :class="classes"
    :disabled="disabled"
    @click="handleClickLink"
  >
    <span>
      <slot></slot>
    </span>
  </Button>
</template>
<script>
// 工具类
import { oneOf } from "../../utils";
import PublicMixin from "../../lib/PublicMixin.js";

// 常量
const NAME = "Btn";
const BASE_BTN = "kdx-btn";

export default {
  name: NAME,
  mixins: [PublicMixin],
  props: {
    htmlType: {
      type: String,
      default: "button",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // API 属性控制 控制按钮类型
    type: {
      validator(value) {
        return oneOf(value, [
          "default",
          "primary",
          "dashed",
          "text",
          "info",
          "success",
          "warning",
          "error",
          "do",
          "know",
          "finished",
          "do-get",
        ]);
      },
      default: "default",
    },
    ghost: {
      // 是否是实体  除了  text 和 do-get 代表不同样式
      type: Boolean,
      default: false,
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "large", "middle"]);
      },
      default: "small",
    },
    // 样式
    styles: {
      type: String,
      default: "",
    },
  },
  computed: {
    classes() {
      return [
        `${BASE_BTN}`,
        this.type,
        this.ghost && "ghost",
        this.size,
        ...this.classNames,
      ].join(" ");
    },
    id() {
      return NAME.toLowerCase();
    },
  },
  methods: {
    handleClickLink(e) {
      console.error("tag====>>>", "");
      this.$emit("btn-click", e);
    },
  },
  data() {
    return {};
  },
};
</script>
