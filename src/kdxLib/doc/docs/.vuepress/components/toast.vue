<!--
 * @Description: Toast轻提示
 * @Autor: wangyanan
-->
<template>
  <div v-if="isShowToast" :class="classes" :style="style">
    <div class="toast toast--middle" :class="{pad8: !options.icon}">
      <!-- icon -->
      <div v-if="options.icon" class="iconfont-m- toastIcon" :class="options.icon"></div>
      <div class="toastTitle">{{options.message}}</div>
    </div>
  </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";
import Vue from 'vue'

const list = []
Vue.prototype.$pushTarget = function (observer) {
  list.push(observer)
}
Vue.prototype.$message = function (obj) {
  for (let i = list.length - 1; i > -1; i--) {
    list[i](obj)
  }
}
Vue.prototype.$popTarget = function () {
  list.pop()
}

const NAME = "Toast";

export default{
  name: NAME,
  mixins: [PublicMixin],
  props: {},
  computed: {
    // 样式计算
    classes() {
      return ["kdx-toast-wrap", ...this.classNames].join(" ");
    },
    style() {
      return `${this.styles}`;
    }
  },
  created() {
    // Object.defineProperty(obj, "a", {get : ()=>{},set : (a)=>{//do},})

    this.$pushTarget((obj) => {
      let config = {
        message: '',
        duration: 2000,
        icon: ''
      }
      if (obj === undefined || obj === null) {
        return
      } else if(typeof obj === 'string') {
        config.message = obj
      }else {
        config = {...config,...obj}
      }
      this.options = config
      this.isShowToast = true
      setTimeout(()=> {
        this.isShowToast = false
      },config.duration)
      this.isShowToast = true;
    });
  },
  destroyed() {
    this.$popTarget();
  },
  data() {
    return {
      options: {},
      isShowToast: false
    }
  }
}
</script>