<template>
    <page-box>
        <div class="area-box" :style="{paddingBottom:areaBottom+'px'}">
            <div class="map-box">
                <map
                    id="map"
                    class="map"
                    :scale="15"
                    :latitude="lat"
                    :longitude="lng"
                    :markers="markers"
                    :circles="circles"
                    :polygons="polygons"
                >
                </map>
            </div>
            <div class="info">
                <div class="left">
                    <div class="left-l">
                        <img mode="widthFix" :src="logo" alt="" v-if='!is_merchant' />
                        <img mode="widthFix" style="height: 100%" :src="$utils.mediaUrl(merchant_info.logo)" alt="" v-else />
                    </div>
                    <div class="left-r">
                        <div class="name" v-if='!is_merchant' >{{ systemSetting.basic.name }}</div>
                        <div class="name" v-else >{{ merchant_info.name }}</div>
                        <div class="addr">{{ address }}</div>
                    </div>
                </div>
                <div class="right">
                    <span
                        class="iconfont-m- icon-m-dianhua"
                        @click="fnCall"
                    ></span>
                </div>
            </div>
        </div>
    </page-box>
</template>

<script>
import { mapState } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            shop_address: {},
            division_way: '', // 划分方式 0：圆 1: 多边形
            dispatch_area: [],
            circles: [],
            polygons: [],
            merchant_info: {}, // 同城子商户信息
        }
    },
    computed: {
        ...mapState(['areaBottom']),
        ...mapState('setting', {
            systemSetting: (state) => state.systemSetting, // 商城基础数据
            is_merchant: (state) => state.is_merchant, // 单、多商户判断
        }),
        logo() {
            return this.$utils.mediaUrl(this.systemSetting?.basic?.logo)
        },
        address() {
            return this.shop_address?.address?.province
                ? `${this.shop_address?.address?.province}${this.shop_address?.address?.city}${this.shop_address?.address?.area}${this.shop_address?.address?.detail}`
                : ''
        },
        lng() {
            if(this.is_merchant) {
                return this.shop_address?.address?.lng
            } else {
                return this.shop_address?.address?.address?.lng
            }
        },
        lat() {
            if(this.is_merchant) {
                return this.shop_address?.address?.lat
            } else {
                return this.shop_address?.address?.address?.lat
            }
        },
        markers() {
            return [
                {
                    id: 0,
                    latitude: this.lat,
                    longitude: this.lng,
                    title: this.address,
                },
            ]
        },
    },
    mounted() {
        this.getDispatchArea()

    },
    methods: {
        // 获取同城配送区域
        getDispatchArea() {
            let param = {}
            if(this.is_merchant) {
                param = {
                    sub_shop_id : this.$Route.query.sub_shop_id
                }
            }
            this.$api.orderApi.getDispatchArea(param).then((res) => {
              console.log(res)
                if (res.error == 0) {
                    this.shop_address = {
                        ...res.data.shop_address,
                    }
                    if(this.is_merchant) {
                        this.merchant_info = {
                            ...res.data.merchant_info
                        }
                    }
                    this.division_way = res.data.division_way
                    this.dispatch_area = [...res.data.dispatch_area]
                    if (this.division_way == 0) {
                        // 圆形
                        this.circles = this.dispatch_area.map((item) => {
                            return {
                                latitude: item.center_lat * 1,
                                longitude: item.center_lng * 1,
                                radius: item.radius * 1000,
                                strokeWidth: 2,
                                fillColor: '#4a67ff33', // 填充颜色
                                color: '#4a67ff', // 描边的颜色
                            }
                        })
                    } else {
                        this.circles = []
                    }
                    if (this.division_way === 1) {
                        // 多边形
                        this.polygons = this.dispatch_area.map((item) => {
                            let _points = item.location.map((point) => {
                                return {
                                    latitude: point.lat * 1,
                                    longitude: point.lng * 1,
                                }
                            })
                            return {
                                points: _points,
                                strokeWidth: 2,
                                fillColor: '#4a67ff33', // 填充颜色
                                strokeColor: '#4a67ff', // 描边的颜色
                                zIndex: 1,
                            }
                        })
                    } else {
                        this.polygons = []
                    }
                } else {

                    this.$toast(res.message)
                }
            })
        },
        /*
        * 拨打电话
        * 判断多商户还是单店铺 接口参数结构变化
        * */
        fnCall() {
            let phoneNumber = this.shop_address.address?.tel1 || this.shop_address?.tel1
            if (phoneNumber) {
                uni.makePhoneCall({
                    phoneNumber,
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.area-box {
height: 100vh;    display: flex;
    flex-direction: column;
    .map-box {
        flex: 1;
        height: calc(100% - 112rpx);
        .map {
            height: 100%;
            width: 100%;
        }
    }
    .info {
        background-color: #fff;
        flex-shrink: 0;
        height: 112rpx;
        padding-left: 24rpx;
        padding-right: 24rpx;
        display: flex;
        align-items: center;
        .left {
            box-sizing: border-box;
            width: calc(100% - 72rpx);
            display: flex;
            align-items: center;
            .left-l {
                flex-shrink: 0;
                width: 80rpx;
                height: 80rpx;
                border-radius: 12rpx;
                display: flex;
                align-items: center;
                border: 2rpx solid #e6e7eb;
                img {
                    width: 100%;
                }
            }
            .left-r {
                padding-left: 16rpx;
                box-sizing: border-box;
                width: calc(100% - 160rpx);
                .name {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    color: #212121;
                }
                .addr {
                    width: 100%;
                    box-sizing: border-box;
                    margin-top: 4rpx;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: #969696;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .right {
            .iconfont-m- {
                font-size: 72rpx;
                color: #19be6b;
            }
        }
    }
}
</style>
