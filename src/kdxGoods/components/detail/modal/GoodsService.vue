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
<theme-content>
    <ul class="tag-list">
        <li
            v-for="(val,key) in info.items"
            :key="key"
            class="biaoqian"
        >
            <div class="word">
                <div class="circle-icon theme-primary-bgcolor"></div>
                <div class="active-tag">
                    <div class="active-tag-name">{{val.name}}</div>
                    <div
                        class="active-tag-content"
                        v-if="val.content"
                    >{{val.content}}</div>
                </div>
            </div>
        </li>
    </ul>
    </theme-content>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        }
    }
}
</script>

<style lang="scss" scoped>
.biaoqian {
    font-size: px2rpx(12);
    font-weight: 500;
    margin-bottom: px2rpx(16);
    .word {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        font-size: px2rpx(12);

        .circle-icon {
            flex-shrink: 0;
            margin: px2rpx(6) px2rpx(12) 0 0;
            background: #ff3c29;
            width: px2rpx(6);
            height: px2rpx(6);
            border-radius: 50%;
        }

        .active-tag {
            &-name {
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                font-weight: bold;
                color: #212121;
            }

            &-content {
                margin-top: px2rpx(8);
                font-size: px2rpx(12);
                line-height: px2rpx(17);
                color: #969696;
            }
        }
    }
}
</style>