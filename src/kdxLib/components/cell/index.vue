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
 * @Description: 单元格
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div :class="classes" :style="style" @click="ck">
        <div class="van-hairline--bottom" :class="{'more-line': abstractContent || mainAbstract}">
          <!--icon-->
          <div v-if="$slots.prefix" class="prefix" :class="['with-content','without-content']">
            <slot name="prefix"></slot>
          </div>
          <div v-if="!$slots.prefix &&classPayIconName" class="iconfont-m- left-icon" :class="classPayIconName"></div>
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
            <div>
              <slot></slot>
            </div>
            <!--箭头图标-->
            <div v-if="classRightIconName" class="icon iconfont-m-" :class="classRightIconName"></div>
          </div>
          <!--按钮-->
          <btn v-if="buttonContent" :classNames="cellBtnClass" type="default" @btn-click="itemButtonClick">{{buttonContent}}</btn>
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
    // btn 补充样式
    cellBtnClass: {
      type: String,
      default: "",
    }
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