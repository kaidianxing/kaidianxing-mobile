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
        class="es-category-content"
        :class="level == 0?'category-content-first':''"
    >
        <!-- 左侧按钮 -->
        <div class="left">
            <category-menu
                v-if="level == 1||level == 2"
                :template="level"
                :list="catelist"
                :menuChose.sync="menuChose"
                @changeMenu="changeMenu"
            >
            </category-menu>
        </div>
        <div
            class="right"
            style="width: 100%;"
        >
            <categoryTemplate
                :template="level"
                :advData="advData"
                :rightData="rightData"
                :scrollTop="scrollTop"
                :styleType="tempStyle"
                :list="catelist"
                @getGoodsList="getGoodsList"
                @scrollFn="scrollFn"
            >
            </categoryTemplate>
        </div>
    </div>
</template>

<script>
import categoryMenu from './CategoryMenu'
import categoryTemplate from './CategoryTemplate'
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        level: {
            type: [String, Number],
            default: '0'
        },
        tempStyle: {
            type: [String,Number],
            default: '0'
        }
    },
    components: {
        categoryMenu,
        categoryTemplate,
    },
    data() {
        return {
            scrollTop: 0,
            rightData: [], // 右侧数据
            advData: {}, // 广告图
            catelist: [],
            menuChose: 0
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            // let list = []
            // if (this.level == 1) {
            //     list = this.list.filter(item => item.children.length > 0);
            // } else if (this.level == 2) {
            //     let level1 = this.list.filter(item => item.children.length > 0);
            //     let result = level1.filter(item => {
            //         for (let i = 0; i < item.children.length; i++) {
            //             if (item.children[i].children.length > 0) {
            //                 return item
            //             }
            //         }
            //     });
            //     list = result
            // } else {
            //     list = this.list
            // }
            this.catelist = this.list;
            this.advData = {
                advurl: this.catelist[0]?.advurl || '',
                advimg: this.catelist[0]?.advimg || ''
            };
            this.rightData = this.catelist[0]?.children;
        },
        changeMenu(index) {
            this.scrollTop = this.catelist[index].scrollTop + 0.01;
            this.$nextTick(() => {
                if (this.catelist[index].scrollTop) {
                    this.scrollTop = this.catelist[index].scrollTop
                } else {
                    this.scrollTop = 0
                }
            });
            this.advData = {
                advurl: this.catelist[index].advurl || '',
                advimg: this.catelist[index].advimg || ''
            };
            this.rightData = this.catelist[index].children;
            this.menuChose = index
        },
        scrollFn(e) {
            this.catelist[this.menuChose].scrollTop = e.detail.scrollTop
        },
        refresh() {
            if (this.catelist.length >= this.menuChose + 1) {
                this.rightData = this.catelist[this.menuChose].children;
            } else {
                this.rightData = this.catelist[0].children;
            }
        },
        getGoodsList(id) {
            this.$emit('on-skip', id)
        }
    }
}
</script>

<style lang="scss" scoped>

    .es-category-content {
        flex: 1;
        display: flex;
    }
    .category-content-first {
        padding: 0 24rpx;
        margin-bottom: 16rpx;
    }
</style>