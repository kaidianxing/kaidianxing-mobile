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
  <Button
    :style="styles"
    :class="classes"
    :disabled="disabled"
    @click.stop="handleClickLink"
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
    classNames: {
      type: [String, Array]
    }
  },
  computed: {
    classes() {
      let base = [
        `${BASE_BTN}`,
        this.type,
        this.ghost && "ghost",
        this.size,
      ]

      let classNames = this.classNames
      if(classNames) {
        if(typeof classNames == 'string') {
          classNames = [classNames]
        }
        base = base.concat([...classNames])
      }
      return base.join(" ");
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
