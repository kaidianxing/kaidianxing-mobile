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
        mounted() {
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