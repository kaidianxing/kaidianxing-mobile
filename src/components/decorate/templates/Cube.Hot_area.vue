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
    <div>
        <!-- 魔方 -->
        <div
                class="cube"
                :style='{
            padding: `${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
        }'
                v-if='componentData&&componentData.id=="cube"'
        >
            <div
                    class="cube-template"
                    v-if="getImgList.length==0"
                    :style="getStyle"
            >
                <img
                        :src="$utils.staticMediaUrl('decorate/cube_default.png')"
                        class="cube-template-img"
                        v-if='startLoadImg'
                />
            </div>
            <div
                    class="container"
                    v-else
            >
                <div
                        class="normal-box"
                        v-if="getCubeTemp == 'normal'"
                        :style="{
                    'margin': `0 ${px2rpx(0 - componentData.style.margininside/2)}`,
                    borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                    height: px2rpx(getNormalHeight)
                }"
                >
                    <img
                            v-for="(cube,index) in componentData.data"
                            :key="index"
                            :src="startLoadImg?$utils.mediaUrl(cube.imgurl):''"
                            :style="{
                    borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                    'margin': `0 ${px2rpx(componentData.style.margininside/2)}`,
                    width: px2rpx(getNormalWidth)
                }"
                            mode='widthFix'
                            class="fit-img"
                            @click="clickItem(index)"
                    />
                </div>
                <div
                        class="rect-box"
                        :class="[componentData.params.cubestyle]"
                        :style="{
                    'margin': `${px2rpx(0 - componentData.style.margininside/2)}`,
                    height: getRectHeight
                }"
                        v-else-if="getCubeTemp == 'rect'"
                >

                    <div
                            @click="clickItem(0)"
                            class="rect-img-box"
                            :style="{
                            borderRadius:getRectStyle.borderRadius,
                            margin: getRectStyle.margin
                        }"
                    >
                        <img
                                v-if="getImgUrl(0)&&startLoadImg"
                                class="cube-img"
                                :src="getImgUrl(0)"
                        />
                        <div
                                v-else
                                class="cube-img"
                        ></div>
                    </div>

                    <div class="second_box">
                        <div
                                @click="clickItem(1)"
                                class="rect-img-box"
                                :style="{
                            borderRadius:getRectStyle.borderRadius,
                            margin: getRectStyle.margin
                        }"
                        >
                            <img
                                    v-if="getImgUrl(1)&&startLoadImg"
                                    class="cube-img"
                                    :src="getImgUrl(1)"
                            />
                            <div
                                    v-else
                                    class="cube-img"
                            ></div>
                        </div>
                        <div
                                v-if="componentData.params.cubestyle!='left1_right3'&&startLoadImg"
                                @click="clickItem(2)"
                                class="rect-img-box"
                                :style="{
                            borderRadius:getRectStyle.borderRadius,
                            margin: getRectStyle.margin
                        }"
                        >
                            <img
                                    v-if="getImgUrl(2)&&startLoadImg"
                                    class="cube-img"
                                    :src="getImgUrl(2)"
                            />
                            <div
                                    v-else
                                    class="cube-img"
                            ></div>
                        </div>
                        <div
                                class="third-box"
                                v-else
                        >
                            <div
                                    @click="clickItem(2)"
                                    class="rect-img-box"
                                    :style="{
                            borderRadius:getRectStyle.borderRadius,
                            margin: getRectStyle.margin
                        }"
                            >
                                <img
                                        v-if="getImgUrl(2)&&startLoadImg"
                                        class="cube-img"
                                        :src="getImgUrl(2)"
                                />
                                <div
                                        v-else
                                        class="cube-img"
                                ></div>
                            </div>

                            <div
                                    @click="clickItem(3)"
                                    class="rect-img-box"
                                    :style="{
                            borderRadius:getRectStyle.borderRadius,
                            margin: getRectStyle.margin
                        }"
                            >
                                <img
                                        v-if="getImgUrl(3)&&startLoadImg"
                                        class="cube-img"
                                        :src="getImgUrl(3)"
                                />
                                <div
                                        v-else
                                        class="cube-img"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                        class="custom-box"
                        :style="{
                    'margin': `${px2rpx(0 - componentData.style.margininside/2)}`,
                    height: getRectHeight
                }"
                        v-else-if="getCubeTemp == 'custom'"
                >

                    <div
                            class="custom-img-box"
                            :style="{
                        padding: `${px2rpx(componentData.style.margininside/2)}`,
                        left: getCustomStyle(cube).left,
                        top: getCustomStyle(cube).top,
                        width: getCustomStyle(cube).width,
                        height: getCustomStyle(cube).height
                    }"
                            v-for="(cube,index) in getImgList"
                            :key="index"
                    >
                        <img
                                :style="{
                        borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                    }"
                                :src="$utils.mediaUrl(cube.imgurl)"
                                class="custom-img"
                                mode="aspectFill"
                                @click="clickItem(index)"
                                v-if='startLoadImg'
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 热区 -->
        <div class="hot_area" :style='{padding: `${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`} ' v-if='componentData&&componentData.id=="hot_area"'>
            <div class="container">
                <img :src="$utils.mediaUrl(componentData.params.imgurl) || $utils.staticMediaUrl('decorate/goods_col1.png')" :style="{borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}" class="hot_area_img" mode="widthFix"/>
                <button :open-type="item.linkurl =='wx_service'?'contact':''" class="hot_item" v-for="(item,index) in componentData.data" :style="{left:getPoint(item).left, top:   getPoint(item).top,width: getPoint(item).width,height:getPoint(item).height,zIndex:getPoint(item).zIndex,}" :key="index" @click="clickHotItem(item)"></button>
            </div>
        </div>
    </div>
</template>

<script>
const cube_num = {
    'cell_two': 2,
    'cell_three': 3,
}

const box_style = {
    'cell_two': 'normal',
    'cell_three': 'normal',
    'top1_bottom2': 'rect',
    'left1_right3': 'rect',
    'left1_right2': 'rect',
    'custom': 'custom'
}

import mixin from './mixin.js'
export default {
    mixins: [mixin],
    computed: {
        getNormalWidth() {
            let num = cube_num[this.componentData.params.cubestyle]
            let { margininside, marginleft } = this.componentData.style

            return (750 - marginleft * 2 - (margininside * (num - 1))) / num
        },
        getNormalHeight() {
            let { imgheight, imgwidth } = this.componentData.params
            return imgheight * this.getNormalWidth / imgwidth
        },
        getRectHeight() {
            let { marginleft } = this.componentData.style
            return this.px2rpx((750 - marginleft * 2))
        },
        getCubeTemp() {
            return box_style[this.componentData.params.cubestyle]
        },
        getImgList() {
            return this.componentData.data.filter(item => item.imgurl)
        },
        getStyle() {
            let keys = ['cell_two', 'cell_three'];
            let { marginleft } = this.componentData.style;
            let width = 750 - marginleft * 2;

            let num = keys.indexOf(this.componentData.params.cubestyle) > -1 ? 2 : 1;
            return {
                height: this.px2rpx(width / num),
                width: this.px2rpx(width)
            }
        },
        getRectStyle() {
            return {
                borderRadius: `${this.px2rpx(this.componentData.style.topradius)} ${this.px2rpx(this.componentData.style.topradius)} ${this.px2rpx(this.componentData.style.bottomradius)} ${this.px2rpx(this.componentData.style.bottomradius)}`,
                margin: `${this.px2rpx(this.componentData.style.margininside / 2)}`
            }
        }
    },
    methods: {
        clickItem(index) {
            this.$emit('custom-event', {
                target: 'cube/clickItem',
                data: this.componentData.data[index]
            })
        },
        getCustomStyle(item) {
            if (!item || !item.startP) return
            let [sx, sy] = item.startP.split(',')
            let [ex, ey] = item.endP.split(',')
            let ratio = 100 / this.componentData.params.cubenum
            return {
                left: (sx - 1) * ratio + '%',
                top: (sy - 1) * ratio + '%',
                width: (ex - sx + 1) * ratio + '%',
                height: (ey - sy + 1) * ratio + '%'
            }
        },
        getImgUrl(index) {
            if (this.componentData.data[index]) {
                return this.$utils.mediaUrl(this.componentData.data[index]?.imgurl)
            } else {
                return ''
            }
        },
        getPoint(item) {
            return {
                left: item.x + '%',
                top: item.y + '%',
                width: item.w + '%',
                height: item.h + '%',
                zIndex: !this.$isPC ? 9999 : -1
            }
        },
        clickHotItem(item) {
            this.$emit('custom-event', {
                target: 'hot_area/clickItem',
                data: item
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.cube {
    .cube-template-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .container {
        overflow: hidden;
    }

    .normal-box {
        border-radius: px2rpx(6);
        overflow: hidden;
        display: flex;
    }

    .fit-img {
        flex-grow:1;
        flex-shrink: 0;
        object-fit: cover;
    }
    &-img {
        flex: 1;
        display: block;
        object-fit: cover;
    }

    .custom-box {
        position: relative;

        .custom-img-box {
            position: absolute;
        }

        .custom-img {
            border-radius: px2rpx(6);
            object-fit: cover;
            height: 100%;
            width: 100%;
        }
    }

    .rect-box {
        display: flex;

        .rect-img-box {
            flex: 1;
            border-radius: px2rpx(6);
            overflow: hidden;

            .cube-img {
                width: 100%;
                height: 100%;
                flex: 1;
                display: block;
                object-fit: cover;
            }
        }

        .second_box {
            flex: 1;
            display: flex;
            overflow: hidden;
        }

        &.top1_bottom2 {
            flex-direction: column;
        }

        &.left1_right2,
        &.left1_right3 {
            .second_box {
                flex-direction: column;
            }
        }

        .third-box {
            display: flex;
            flex: 1;
            overflow: hidden;
        }
    }
}
.hot_area .container {
    position: relative;
}
.hot_area .hot_item {
    position: absolute;
    left: 0;
    right: 0;
    background-color: transparent;
    &:after{
        border: 0;
    }
}
.hot_area_img {
    display: block;
    width: 100%;
    border-radius: px2rpx(6);
}
</style>