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
        <view class="apply-index">
            <!-- 分销图 -->
            <view class="apply-image">
                 <image class="apply-image-img" mode="widthFix" v-if="show_success != 1" :src="$utils.mediaUrl(applyData.banner)"></image>
                 <image class="apply-image-img" mode="widthFix" v-else :src="$utils.mediaUrl(banner)"></image>
            </view>
            <view class="content">
                <!-- 分销条件 -->
                <apply-condition :is_audit="is_audit" :show_success="show_success" :applyData="applyData" :goodsList="goodsList" @custom-event='eventHandler'></apply-condition>
            </view>
        </view>
         <!-- 多规格选择 -->
        <goods-picker ref="goodsPicker" @custom-event="customEventHandler"></goods-picker>
    </page-box>
</template>

<script>

    import applyCondition from '../components/apply/ApplyCondition'
    import {mapState} from "vuex";
    import {sessionStorage} from "mp-storage";
    import goodsPicker from "@/components/goods/GoodsPicker";
    import CartAdder from '@/components/goods/addCartTools.js'
    import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin,PageLoadingMixin],
        name: "index",
        components: {
            applyCondition,
            goodsPicker
        },
        props: {},
        data() {
            return {
                applyData: {},
                goodsList: [],
                show_success: 0,
                is_audit: 0,
                banner: '',
                cartAdder:null,//添加购物车类对象
                goodsIds: ''
            }
        },
        computed: {
            ...mapState('commissionSet', {
                commissionSetting: state => state.commissionSetting,
            }),
        },
        beforeMount() {
            uni.setNavigationBarTitle({
                title: this.commissionSetting?.become_agent || '成为分销商'
            })
        },
        mounted() {
            this.cartAdder=new CartAdder((e)=>{//商品组加购专用//快速购买处理 
                if(e.type=='toggle'){ 
                    this.$refs?.goodsPicker.toggle(this.cartAdder.pickerCallback, e.data?.type);
                    if(!this.$refs.goodsPicker.showmodal&&e.data.errorInfo){
                        this.$toast(e.data.errorInfo)
                    }
                }
            });
            if (this.sessionStorage.getItem('successObj')) {
                let successObj = this.sessionStorage.getItem('successObj');
                successObj = JSON.parse(decodeURIComponent(this.sessionStorage.getItem('successObj')));
                let {show_success, is_audit, banner} = successObj;
                this.show_success = show_success;
                this.is_audit = is_audit;
                this.banner = banner;
                this.sessionStorage.removeItem('successObj');
                this.$loading.hideLoading();
            } else {
                this.getData();
            }
        },
        methods: {
            async eventHandler(e){
                // 判断登录
                await this.$store.dispatch('quickPurchase/checkLoginStatus')
                // 获取商品详情
                this.cartAdder.getGoodDetail(e.data.goods_id,'...commission/index.vue').then((res) => {
                    if (res.error === 0) {
                        if( res?.data?.goods?.type == '2' && !res?.plugin_account?.virtualAccount) {
                            this.$toast('商品暂时无法购买');
                            return
                        }else {
                            // 打开goodsPicker
                            this.cartAdder.callback({
                                type: 'toggle',
                                data: {
                                    type: 'spec'
                                },
                            })
                        }
                    }
                })
            },
             //规格选完回来
            customEventHandler(e) {//快速购买处理
                this.cartAdder.pickerCallback(e)
                if (e.type === 'clickBtn') {
                    this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
                    this.getList()
                }
            },
            getData() {
                this.$api.commissionApi.getApplyData({}).then(res => {
                    this.$loading.hideLoading();
                    if (res.error == 333201) {
                        // 暂未开启
                        this.$Router.replace({
                            path: '/kdxCommission/default',
                        })
                    } else if (res.error == 0) {
                        if (res.status == 1) {
                            this.$Router.replace({
                                path: '/kdxCommission/index/index',
                            });
                            return
                        }
                        this.applyData = {...res};
                        let form = {
                            id: res.form?.id,
                            content: res?.form?.content ? JSON.parse(res.form.content) : ''
                        };
                        this.$store.commit('form/setForm', form);
                        if (res.become_condition == 1) {
                            this.goodsIds= res.goods_info?.goods_ids;
                            this.getList()
                        }
                    }
                })
            },
            getList() {
                this.$api.goodApi.goodList({id:this.goodsIds}).then(res => {
                    this.goodsList = res.list
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .apply-index {
        .apply-image {
            width: 100%;
            height: auto;
            .apply-image-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .content {
            padding: 16rpx 24rpx;
        }
    }
</style>
