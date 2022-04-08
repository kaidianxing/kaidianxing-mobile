<!--
 * @Description: 数量增加删除
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
  <div :class="classes" :style="style">
    <div class="iconfont-m- icon-m-jianhao" @click="doNum(0)"></div>
    <input
      @blur="ch"
      type="number"
      class="txt"
      v-model="num"
      :minlength="min"
      :maxlength="max"
    />
    <div class="iconfont-m- icon-m-jiahao" @click="doNum(1)"></div>
  </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "Num";

export default {
  name: NAME,
  mixins: [PublicMixin],
  props: {
    min: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    classes() {
      return ["kdx-num-wrap", ...this.classNames].join(" ");
    },
    style() {
      return `${this.styles}`;
    },
  },
  methods: {
    doNum(flg = 0) {
      if (!flg) {
        this.min < this.num && --this.num;
      } else {
        this.max > this.num && ++this.num;
      }
      // 发射
      this.emit(this.num);
    },
    ch(e) {
      console.log("tag", "");
      let str = e.target.value;
      let temp = "";

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 47 && str.charCodeAt(i) < 58) {
          temp += str.charAt(i);
        }
      }
      console.log(temp, "king----->>>");
      this.num = temp;

      // 判断是否越界
      if(this.num < this.min){
        this.num = this.min;
      }else if(this.num > this.max){
        this.num = this.max;
      }
      
      // 发射
      this.emit(this.num);
    },
    emit(num = 0) {
      if (this.nextVal != num) {
        this.$emit("on-change", num);
      }

      this.nextVal = num;
    },
  },
  mounted() {
    console.log(this);
  },
  data() {
    return {
      num: this.min,
    };
  },
};
</script>
