<template>
    <pick-mask class="map-picker" @mask-close="closePicker(true)" v-if="pickerShow" @click.stop>
        <div class="inner flex-column">
            <div class="picker-close" @click="closePicker">
                <img class="close-img" :src="$utils.staticMediaUrl('verify/close.png')" alt="">
            </div>
            <div class="title">{{`${mapData.title}(${mapList.length || 0})`}}</div>
            <scroll-view scroll-y class="verify-content">
                <block v-if="mapList&&mapList.length">
                    <div class="verify-item van-hairline--bottom" v-for="item in mapList" :key="item.id" @click="openMap(item)">
                        <div class="flex radio-box" v-if="is_choose">
                            <i class="icon-m-yes iconfont-m- theme-primary-color" v-if="isChoose(item.id)"></i>
                            <i class="icon-m-no iconfont-m-" v-else></i>
                        </div>
                        <div class="verify-address">
                            <div :class="{
                                'theme-primary-color': isChoose(item.id)
                            }">{{item.title}}</div>
                            <div class="uni-text-color-grey fs-12">{{item.address}}</div>
                        </div>
                        <div class="distance" @click.stop="openMap(item, 'distance')">
                            <i class="iconfont-m- icon-m-weizhi2"></i>
                            <div class="distance-num fs-12" v-if="item.distance">{{item|priceUnit}}</div>
                        </div>
                        <div class="line" :class="{mLeft: !item.distance}"></div>
                        <div class="phone" @click.stop="makePhoneCall(item.mobile)">
                            <i class="iconfont-m- icon-m-dianhua1"></i>
                        </div>
                    </div>
                </block>
                <block v-if="type=='createOrder'&&mapList&&mapList.length===0">
                    <div class="tip-box">
                        <div class="tip uni-text-color-grey">商品没有共同的自提点</div>
                        <div class="tip uni-text-color-grey">请核对或拆分下单</div>
                    </div>
                </block>
            </scroll-view>
        </div>
    </pick-mask>
</template>

<script>
    import PickMask from '@/components/picker/PickMask'
    import {mapState} from "vuex";
    // #ifdef MP-TOUTIAO
    import EventBus from '@/common/decorator/eventBus.js'
    // #endif
    export default {
        name: "MapPicker",
        components: {
            PickMask
        },
        props: {
            type: {
                type: String,
                default: ''
            },
            is_choose: {
                type: Boolean,
                default: false

            }
        },
        data() {
            return {
                pickerShow: false,
                mapList: [],
                mapData: {
                    title: '自提点'
                },
            }
        },
        computed: {
            ...mapState('orderCreate', ['address_id']),
        },
        created() {
        },
        mounted() {
            // #ifdef MP-TOUTIAO
            EventBus.$emit('mounted-mapPicker', this)
            // #endif
        },
        methods: {
            isChoose(id){
                return this.address_id == id
            },
            showMapPicker(data) {
                this.mapData = data;
                this.getMapList(data);
            },
            closePicker() {
                this.pickerShow = false;
            },
            openMap(data, type) {
                if (this.is_choose && type !== 'distance') {
                    this.chooseVerify(data.id);
                    return;
                }
                this.$utils.openMapLocation(data).then(res => {
                    console.log(res);
                })
            },
            makePhoneCall(data) {
                if (data) {
                    uni.makePhoneCall({
                        phoneNumber: data,
                    })
                }
            },
            getMapList(data) {
                let obj = {
                    id: data.goods_id,
                    lng: data.longitude,
                    lat: data.latitude
                };

                this.$api.goodsApi.getVerifyPoint(obj).then(res => {
                    if (res.error === 0) {
                        this.mapList = res.data;
                        this.pickerShow = true;
                        // 存储最近自提点
                        if (obj?.lng && obj?.lat) {
                            this.setVerifyPoint()
                        }
                    } else if(res.error === 510117) {
                        this.$toast(res.message);
                        setTimeout(() => {
                            this.$Router.back(1)
                        }, 1000)
                    }
                })
            },
            setVerifyPoint() {
                this.$decorator.getPage(this.$Route).setPageInfo({
                    detail_sale: {
                        verifyData: {
                            verify_point_title: this.mapList?.[0]?.title,
                            verify_point_distance: this.mapList?.[0]?.distance
                        },
                    },
                });
            },
            chooseVerify(id) {
                this.closePicker();
                if (this.address_id == id){
                    return
                }
                this.$store.commit('orderCreate/setOrderCreateInfo', {address_id: id});
                this.$emit('getData')
                this.$emit('getData')
            },
        },
        filters: {
            priceUnit(data) {
                let distance = data?.distance || 0
                let result = Number(distance);
                if (result < 100) {
                    result = '<100m'
                    return
                }
                result = Number(distance / 1000);
                if (result>100) {
                    result = '>100km'
                } else {
                    result = result + 'km'
                }
                return result
            }
        }
    }
</script>

<style lang="scss" scoped>
    .map-picker {
        .inner {
            height: px2rpx(530);
            background: #fff;
            border-radius: px2rpx(10) px2rpx(10) 0 0;
            .picker-close {
                position: absolute;
                top: px2rpx(12);
                right: px2rpx(12);
                width: px2rpx(24);
                height: px2rpx(24);
                .close-img {
                    width: px2rpx(24);
                    height: px2rpx(24);
                }
            }
            .title {
                margin-top: px2rpx(16);
                line-height: px2rpx(22);
                font-size: px2rpx(16);
                font-weight: 600;
                text-align: center;
                color: $uni-text-color;
            }
            .verify-content {
                position: relative;
                height: px2rpx(492);
                overflow-y: scroll;
                .verify-item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding-left: px2rpx(12);
                    height: px2rpx(77);
                    font-size: px2rpx(12);
                    &.van-hairline--bottom:after {
                        left: -46%;
                        border-bottom-color: $uni-border-color;
                        border-style: solid;
                    }
                    .radio-box {
                        flex-shrink: 0;
                        margin-right: px2rpx(12);
                        cursor: pointer;
                        display: flex;
                        >.iconfont-m- {
                            font-size: px2rpx(24);
                            line-height: px2rpx(24);
                            &.icon-m-no {
                                color: #E6E7EB;
                            }
                            &.icon-m-yes {
                                color: #FF3C29;
                            }
                        }
                    }
                    .verify-address {
                        flex: 1;
                        line-height: px2rpx(20);
                        color: $uni-text-color;
                        font-size: px2rpx(14);
                        .uni-text-color-grey {
                            margin-top: px2rpx(8);
                            line-height: px2rpx(17);
                            font-size: px2rpx(12);
                        }
                    }
                    .distance {
                        flex-shrink: 0;
                        max-width: px2rpx(44);
                        text-align: center;
                        .iconfont-m- {
                            font-size: px2rpx(24);
                        }
                        .distance-num {
                            margin-top: px2rpx(4);
                        }
                    }
                    .line {
                        margin-left: px2rpx(8);
                        height: px2rpx(20);
                        border: 1px solid $uni-border-color;
                        opacity: .3;
                        &.mLeft {
                            margin-left: px2rpx(12);
                        }
                    }
                    .phone {
                        padding: 0 px2rpx(12);
                        .iconfont-m- {
                            font-size: px2rpx(24);
                            color: #09c15f;
                        }
                    }
                }
                .tip-box {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    text-align: center;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
</style>