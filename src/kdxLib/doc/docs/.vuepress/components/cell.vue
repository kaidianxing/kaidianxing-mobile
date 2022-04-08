<!--
 * @Description: 单元格
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div :class="classes" :style="style" @click="ck">
        <div class="van-hairline--bottom" :class="{'more-line': abstractContent || mainAbstract}">
          <!--icon-->
          <div v-if="classPayIconName" class="iconfont-m- left-icon" :class="classPayIconName"></div>
          <!--主内容区域-->
          <div class="main-content-wrap">
            <div class="m-wp">
              <!--主标题-->
              {{tith}}
              <!--状态-->
              <div v-if="statusContent" class="status">
                <div>{{statusContent}}</div>
              </div>
            </div>
            <!--摘要-->
            <div v-if="mainAbstract" class="main-abstract">{{mainAbstract}}</div>
          </div>
          <!--右侧区域-->
          <div class="icon-wp">
            <div v-if="content || abstractContent" class="content">
              <!--主内容-->
              {{content}}
              <!--内容摘要-->
              <div class="abstract-content" v-if="abstractContent">{{abstractContent}}</div>
            </div>
            <!--箭头图标-->
            <div v-if="classRightIconName" class="icon iconfont-m-" :class="classRightIconName"></div>
          </div>
          <!--按钮-->
          <button-sqx v-if="buttonContent" type="default" @btn-click="itemButtonClick">{{buttonContent}}</button-sqx>
        </div>
    </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "Cell";

export default{
  name: NAME,
  mixins: [PublicMixin],
  props: {
    // 主标题
    tith: {
      type: String,
      default: "",
    },
    // 右侧主内容
    content: {
      type: String,
      default: "",
    },
    //右侧icon
    classRightIconName:{
      type: String,
      default: "icon-m-right",
    },
    // icon 类的名字
    classPayIconName: {
      type: String,
      // default: "icon-m-zhifubao1",
      default: "",
    },
    // 状态内容
    statusContent: {
      type: String,
      default: "",
    },
    // 主要摘要
    mainAbstract: {
      type: String,
      default: "",
    },
    // 内容摘要
    abstractContent: {
      type: String,
      default: "",
    },
    // 按钮
    buttonContent: {
      type: String,
      default: "",
    },
  },
  computed: {
      // 样式计算
      classes() {
        const MORELINE = this.mainAbstract || this.abstractContent ? 'more-line' : '';
        return ["kdx-cell-wrap", MORELINE, ...this.classNames].join(" ");
      },
      style() {
        return `${this.styles}`;
      }
  },
  methods:{
    ck(e){
      console.log(e,'---->>>>');
      // emit
      this.$emit('custom-event', {});
    },
    itemButtonClick(e){
      this.$emit('item-button-click', {});
    }
  }
}
</script>