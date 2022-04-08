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
    <page-box>
        <view class="member-address-list flex-column">
            <view v-if="list.length > 0"  class="container flex1">
                <view class="address-card" v-for="(item, index) in list" :key="index" @click="selectAddress(item.id)">
                    <view class="name">
                        <text>{{item.name}}</text>
                        <text>{{item.mobile.replace(item.mobile.substring(3,7), "****")}}</text>
                        <text v-if="item.is_default == 1" class="default theme-sub-bgcolor theme-spec-bgcolor theme-primary-color">默认</text>
                    </view>
                    <view class="info two-line-hide uni-text-color-grey">{{item.province + item.city + item.area + item.address}}</view>
                    <view class="edit-icon" @click.stop="editAddress(item.id)">
                        <i class="iconfont-m- icon-m-tianjiadizhi-bianji"></i>
                    </view>
                </view>
                <!--加载更多  -->
                <page-loading v-if="list.length != count" :loadingType="loadingType"></page-loading>
            </view>
            <!-- defaultPage -->
            <view v-if="count <= 0" class="default-page flex-column">
                <view class="bg">
                    <image :src="$utils.staticMediaUrl('default/address.png')"></image>
                </view>
                <view class='default-text'>你还没有收货地址哦，添加一个吧</view>
            </view>
        </view>
        <template slot="foot">
            <view class="addressBorder">
                <view class="button flex">
                    <view v-if="is_weixin && wechat_address == 1" class="rr-btn favorite-btn" @click='importAddress'>
                        <i class="iconfont-m- icon-m-qudao-weixin"></i>微信导入地址
                    </view>
                    <view class="rr-btn add-btn theme-primary-bgcolor" :class="is_weixin && wechat_address == 1?'radius':''" @click='add'>新建收货地址</view>
                </view>
            </view>

        </template>
    </page-box>
</template>

<script>
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        name: "list",
        components: {},
        props: {},
        data() {
            return {
                type: '', // 判断是否从下单进来的
                page: 1,
                is_weixin: false,
                loading: false,
                count: 0,
                show_style: true, // 商品展现形式
                list: [],
                wechat_address: 0,
                isChoose: false
            }
        },
        computed: {
            loadingType() {
                let loadingType = 0;
                if (this.loading) {
                    loadingType = 1
                } else if (this.list.length == this.count && this.count > 0 && this.loading == false && this.list.length > 20) {
                    loadingType = 2
                }
                return loadingType
            }
        },
        created() {
            // #ifdef MP-WEIXIN
            this.is_weixin = this.$utils.is_weixin()
            // #endif
        },
        onShow() {
            if(!this.isChoose) {
                this.reset()
            }
        },
        beforeMount() {
            this.wechat_address = this.$store.state.setting?.systemSetting?.wechat_address || 0
        },
        mounted() {
            this.type = this.$Route.query?.type ?? '';
        },
        methods: {
            getList() {
                let obj = {
                    page: this.page
                };
                this.loading = true;
                this.$api.memberApi.getAddressList(obj).then(res => {
                    if (res.error == 0) {
                        if (res.list.list.length > 0 && obj?.page > 1) {
                            this.list = this.list.concat(res.list.list);
                            this.page = this.page + 1;
                        }
                        if(obj?.page == 1 && res.list.list.length > 0){
                            this.list = res.list.list
                        }
                        this.loading = false;
                        this.count = res.list.total;
                    } else {
                        // -10004 应用没有权限
                        if (res.error !== -10004) {
                            this.$toast(res.message)
                        }
                    }
                    this.graceLazyload.load(0, this);
                })
            },
            selectAddress(id) {
                //store中存储
                this.$store.commit('orderCreate/setOrderCreateInfo', {address_id: id, changeAddress: true});
                // this.$Router.back(0)
                if (this.type == 'order') {
                    this.$Router.back(1)
                } else {
                    this.$Router.auto({
                        path: '/kdxMember/address/index',
                        query: {
                            id: id,
                            type: this.type || ''
                        }
                    })
                }
            },
            editAddress(id) {
                this.$Router.auto({
                    path: '/kdxMember/address/index',
                    query: {
                        id: id,
                        type: this.type || ''
                    }
                })
            },
            add() {
                this.$Router.auto({
                    path: '/kdxMember/address/index',
                    query: {
                        type: this.type || ''
                    }
                })
            },
            // 微信导入地址
            importAddress() {
                this.changeActionType(true)
                uni.getSetting({
                    success: (res) => {
                        if (res.authSetting['scope.address']) {
                            this.wxAddress()
                        } else {
                            uni.authorize({
                                scope: 'scope.address',
                                success: (res) => {
                                    this.wxAddress()
                                },
                                fail: res => {
                                    this.changeActionType(false)
                                    uni.showModal({
                                        title: '是否打开设置页',
                                        content: '要在设置中获取地址信息',
                                        success: (res) => {
                                            if (res.confirm) {
                                                this.open()
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    },
                    fail: ()=> {
                        this.changeActionType(false)
                    }
                });
            },
            open() {
                uni.openSetting({
                    success: res => {
                        console.log('openSetting');
                        if (res.authSetting['scope.address']) {
                            this.wxAddress()
                        }
                    },
                    fail: res => {
                        console.log(res);
                    }
                })
            },
            wxAddress() {
                uni.chooseAddress({
                    success: (res) => {
                        let params = {
                            name: res.userName,
                            mobile: res.telNumber,
                            province: res.provinceName,
                            city: res.cityName,
                            area: res.countyName,
                            address: res.detailInfo
                        };
                        this.addAddress(params);
                    },
                    fail: ()=> {
                        this.changeActionType(false)
                    }
                })
            },
            addAddress(data) {
                this.$api.memberApi.addAddress(data).then(res => {
                    if (res.error == 0) {
                        this.reset()
                        this.$toast('添加成功');
                    } else {
                        this.$toast(res.message)
                    }
                }).finally(()=> {
                    this.changeActionType(false)
                });
            },
            reset() {
                this.list = [];
                this.page = 1;
                this.getList();
            },
            changeActionType(status){
                this.isChoose = status;
            }
        },
        onPullDownRefresh() {
             console.log('onPullDownRefresh')
            this.reset();
            setTimeout(() => {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        onReachBottom() {
            console.log('onReachBottom')
            this.getList()
        },
        //页面滚动时启动懒加载
        //此处如果图片在滚动区域内则监听滚动区域事件并传递 滚动区域的 scrollTop 值给 load函数
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
    }
</script>

<style lang="scss" scoped>
    .member-address-list {
        min-height: 100%;
        padding: 16rpx 24rpx 100rpx;
        background-color: $uni-bg-color-grey;
        box-sizing: border-box;
        .container {
            overflow: auto;
            .address-card {
                position: relative;
                padding: 24rpx 120rpx 24rpx 24rpx;
                background-color: #fff;
                margin-bottom: 16rpx;
                border-radius: 12rpx;
                .edit-icon {
                    position: absolute;
                    right: 24rpx;
                    top: 43%;
                    i {
                        color: $uni-text-color-grey;
                        font-size: 40rpx;
                    }
                }
                .info {
                    font-size: 24rpx;
                    line-height: 34rpx;
                }
                .name {
                    line-height: 40rpx;
                    margin-bottom: 8rpx;
                    text:nth-child(2) {
                        margin: 0 16rpx;
                    }
                    text {
                        color: $uni-text-color;
                    }
                }
                .default {
                    padding: 1px 16rpx;
                    height: 36rpx;
                    line-height: 36rpx;
                    background-color: #FFF3F5;
                    border-radius: 19rpx;
                    text-align: center;
                    font-size: 24rpx;
                }
            }
        }
    }
    .addressBorder {
        border-top: 1px solid #E6E7EB;
        padding: 14rpx 24rpx;
        background: #fff;
    }
    .favorite-btn {
        width: 50%;
        color: $uni-text-color;
        background-color: #fff;
        border-radius: 40rpx 0 0 40rpx;
        border: 1px solid #E6E7EB;
        i {
            color: #1BB723;
            font-size: 36rpx;
        }
    }
    .add-btn {
        height: 80rpx;
        line-height: 80rpx;
        background: linear-gradient(to right, $uni-color-primary, #FF6F29);
        border-radius: 40rpx;
        text-align: center;
        color: #fff;
        font-weight: normal;
    }
    .radius {
        width: 50%;
        border-radius: 0 40rpx 40rpx 0;
    }
</style>
