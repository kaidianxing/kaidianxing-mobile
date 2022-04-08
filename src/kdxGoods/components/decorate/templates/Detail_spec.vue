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
    <div
        class="detail_spec"
        :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)}  ${px2rpx(componentData.style.marginbottom)}`}"
        @click="clickItem"
        v-if='componentData&&componentData.id=="detail_spec"&&componentData.show!==false && (componentData.form_status == 1)'
    >
        <div style="overflow: hidden" :style="{'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}">
        <div class="container" :style="{background:componentData.style.background}">
            <span class="label" :style="{color: componentData.style.titlecolor}" v-if="componentData.params.specs">已选</span>
            <span class="label" :style="{color: componentData.style.titlecolor}" v-else>选择</span>
            <span
                class="content"
                :style="{color:componentData.style.textcolor}"
            >{{componentData.params.specs||'请选择商品规格'}}</span>
            <i class="iconfont-m- icon-m-right"  :style="{color: componentData.style.arrowcolor}"></i>
        </div>
        </div>
    </div>
</template>

<script>
import mixin from "./mixin.js";
export default {
    mixins: [mixin],
    name: "detail_spec",
    methods: {
        clickItem() {
            if(this.componentData.params.virtual_account) {
                this.$toast('商品暂时无法购买')
                return
            } else {
                this.$emit("custom-event", {
                    target: "detail_spec/clickItem",
                    data: this.componentData
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./decorate.scss";
.detail_spec {
    width: 100%;
    .container {
        width: 100%;
        height: rpx(70);
        background: #fff;
        display: flex;
        flex-wrap: nowrap;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        .label {
            font-size: px2rpx(12);
            line-height: px2rpx(12);
            margin: auto px2rpx(12);
            color: $uni-text-color-grey;
            flex-shrink: 0;
        }
        .content {
            width: 0;
            flex: 1;
            font-size: px2rpx(14);
            line-height: px2rpx(44);
            box-sizing: border-box;
            padding: 0 rpx(10) 0 rpx(20);
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: auto 0;
            color: $uni-text-color;
        }
        .icon-m-right {
            height: rpx(70);
            flex-shrink: 0;
            line-height: rpx(70);
            margin-right: px2rpx(12);
            font-size: px2rpx(16);
            color: #888;
        }
    }
}
</style>
