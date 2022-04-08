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
    <div class='menu-swiper' :style='"height:"+getHeight'>
        <!--        分页按钮组-->
        <swiper v-if="list.length>1" :current='value' touchable :autoplay="!setting.autoplay===false"
                :circular="!setting.loop===false" :interval="setting.autoplaySpeed" @change='change' :key='key'>
            <swiper-item v-for="(item,index) in list" :key='index' :style='{height:getHeight}'>
                <ul class='menu-box'
                    :style='{color:item.style.color,background:item.style.background,height:getHeight,paddingBottom:(dots?"14rpx":"8rpx")}'
                    :class='[item.style.navstyle]' >
                    <li class='menu-item' :class='["col"+item.style.rownum]' v-for='(val,index) in item.items'
                        :key='index'>
                        <div class="img-box" @click='clickItem(index)'>
                            <img  lazy-load class='menu-item-img' :src="getImgUrl(val)" alt="">
                        </div>
                        <p>{{ val.text }}
                        </p>
                    </li>
                </ul>
            </swiper-item>
        </swiper>
        <!--        不分页按钮-->
        <ul class='menu-box' :style='getStyle' :class='[list[0]&&list[0].style.navstyle]'
            v-if='canLoad[0] && list.length==1'>
            <button class='menu-item' :class='["col"+(list[0]&&list[0].style.rownum)]' v-for='(val,index) in getList'
                :key='index' :open-type="val.linkurl=='wx_service'?'contact':''"  @click='clickItem(index)'>
                <div class="img-box">
                    <img lazy-load class='menu-item-img' :src="getImgUrl(val)" alt="">
                </div>
                <p>{{ val.text }}</p>
            </button>
        </ul>
        <ul class='swiper-dots' v-if='dots'>
            <li class='dots' :key="index" v-for='(item,index) in list.length' :class='{active:index==value}'></li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        dots: {
            type: Boolean,
            default: false
        },
        imgMode: {
            type: String,
            default: "scaleToFill"
        },
        imgStyle: {
            type: Object,
            default: () => ({})
        },
        height: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: () => []
        },
        startIndex: {
            type: Number,
            default: 0
        },
    },
    computed: {
        getStyle() {
            if (this.list.length) {
                return `color:${this.list[0].style.color};background:${this.list[0].style.background};height:${this.getHeight};paddingBottom:${this.dots ? "14rpx" : "8rpx"}`
            } else {
                return ''
            }

        },
        getList() {
            if (this.list.length == 1) {
                return this.list[0]?.items || []
            }
            return []
        },
        getHeight() {
            if (this.dots && this.height) {
                return (this.height.replace('rpx', '') * 1 + 30) + 'rpx'
            }
            return this.height
        },
    },
    watch: {
        list: {
            immediate: true,
            deep: true,
            handler() {
                this.key = Math.random();
                this.value = this.startIndex
            }
        }
    },
    data() {
        return {
            key: '',
            value: 0,
            setting: {
                autoplay: false,
                arrow: 'never',
                loop: true
            },
            canLoad: {
                0: true
            }
        }
    },
    methods: {
        getImgUrl(val) {
            let imgurl = val?.imgurl
            if (imgurl) {
                return this.$utils.mediaUrl(imgurl)
            } else {
                return this.$utils.staticMediaUrl('decorate/menu_radius.png')
            }
        },
        clickItem(index) {
            let item = this.list[this.value]?.items[index]
            // console.log(item,'oooooooo',this.list,this.value,index)
            this.$emit('clickItem', item)
        },
        change(val) {
            let {
                detail: {
                    current
                }
            } = val;
            this.value = current
            if (!this.canLoad[current]) {
                this.canLoad = {
                    ...this.canLoad,
                    [current]: true
                }
            }
            this.$emit('change', current)
        },
        click(val) {
            this.$emit('click', val)
        }
    }
}
</script>

<style lang="scss" scoped>
swiper {
    height: 100%;
}

.menu-swiper {
    overflow: hidden;
    position: relative;

    .swiper-dots {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 16rpx;
        height: 8rpx;
        left: 0;
        width: 100%;

        .dots {
            width: 18rpx;
            height: 8rpx;
            border-radius: 8rpx;
            background: #FFF3F5;
            margin: 0 5rpx;

            &.active {
                background: #FF3C29;
            }
        }
    }

    .menu-box {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding: px2rpx(4) 0;

        .menu-item {
            overflow: hidden;
            width: 33.33%;
            padding: px2rpx(8) 0;
            flex-shrink: 0;
            background-color: transparent;
            // box-sizing: border-box;
            // display: flex;
            // flex-direction: column;
            color: inherit;
            &:after {
                border: 0;
            }
            &.col4 {
                width: 25%;
            }

            &.col5 {
                width: 20%;
            }

            p {
                color: inherit;
                text-align: center;
                line-height: px2rpx(17);
                font-size: px2rpx(12);
            }

            .img-box {
                width: px2rpx(44);
                height: px2rpx(44);
                overflow: hidden;
                margin: 0 auto px2rpx(6);
            }

            .menu-item-img {
                width: px2rpx(44);
                height: px2rpx(44);
            }
        }
    }

    .radius {
        .img-box {
            border-radius: rpx(20);
        }
    }

    .circle {
        .img-box {
            border-radius: 50%;
        }
    }
}
</style>
