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
    <page-box ref='pageBox' showDiymenu>
        <div class="cart-index flex-column">
            <block v-if="list.length > 0">
                <view class="edit" @click="edit">{{ !editStatus ? '编辑' : '完成'}}</view>
                <view class="container flex-column">

                    <!--                        <div class="goods-single-box" v-for="(item, index) in list" :key="item.id">-->
                    <div class="goods-single-box">
                        <block v-for="(item,itemIndex) in list" :key="itemIndex">
                            <view class="goods-content-box" v-if="item.goods && item.goods.length">
                                <goods-card :list.sync="item.goods"
                                            :editStatus="editStatus"
                                            :parentIndex="itemIndex"
                                            @getList="getList"
                                            @editRadioChange="editRadioChange"
                                            @on-choose="clickBuyBtn">
                                </goods-card>
                            </view>
                        </block>
                    </div>
                </view>
            </block>
            <!-- 失效商品 -->
            <view v-if="loseList.length >0" class="lose-main">
                <view class="lose-container">
                    <view class="lose-header">
                        <view class="lose-header-left">失效商品({{loseList.length}})</view>
                        <view class="lose-header-right" @click="clearLoseGoods">清空失效商品</view>
                    </view>
                    <view class="lose-content">
                        <goods-card :list="loseList"  @getList="getList"></goods-card>
                    </view>
                </view>
            </view>
            <block v-else-if="!requestFlag && list.length === 0 && loseList.length == 0">
                <!-- 缺省页 -->
                <view class="default-page flex-column">
                    <view class="bg">
                        <image :src="$utils.staticMediaUrl('default/cart.png')"></image>
                    </view>
                    <view class="default-text">购物车竟然是空的</view>
                    <div class="ib">
                        <btn styles="padding:0 60rpx;margin-top:32rpx" classNames="theme-primary-border theme-primary-color" :ghost="true" size="middle" @btn-click="toIndex">去逛逛</btn>
                    </div>
                </view>
                <!-- 猜你喜欢 -->
                <goods-like></goods-like>
            </block>
        </div>
        <template slot="foot">
            <!-- 底部结算 -->
            <cart-footer v-if="list.length > 0"
                         slot="foot"
                         :editStatus="editStatus"
                         :express_enable="express_enable"
                         :list="list"
                         :footerObj="footerObj"
                         @getList="getList"
                         @create="preCreate"
                         @allSelectedRadioChange="allSelectedRadioChange">
            </cart-footer>
        </template>
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @custom-event="customEventHandler"
        ></goods-picker>
        <!-- 删除失效商品 -->
        <rr-modal v-model="showModal" title="提示" ok-text="确定" cancel-text="取消" @handlerOK="modalOk" @handlerCancel="modalCancel">
            <template slot="content">
                <view class="pay-modal-content">确认清空当前失效商品？</view>
            </template>
        </rr-modal>
        <!-- 配送方式选择 -->
        <cart-delivery title="选择结算商品" v-if="mixModal" @on-close="handleCancel">
            <delivery-goods v-if="mixDelivery.express.total" type="express" :info="mixDelivery.express" @create="preCreate"></delivery-goods>
            <delivery-goods v-if="mixDelivery.intracity.total" type="intracity" :info="mixDelivery.intracity" @create="preCreate"></delivery-goods>

        </cart-delivery>

    </page-box>

</template>

<script>
import goodsCard from './components/GoodsCard'
import cartFooter from './components/CartFooter'
import goodsLike from './components/goods/GoodsLike'
import PageMixin from '@/common/PageMixin.js'
import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"
import goodsPicker from "@/components/goods/GoodsPicker";
import CartAdder from '@/components/goods/addCartTools.js'
import CartDelivery from './components/CartDelivery'
import DeliveryGoods from './components/DeliveryGoods.vue'

export default {
    mixins: [PageMixin,PageLoadingMixin],
    components: {
        goodsCard,
        cartFooter,
        goodsLike,
        goodsPicker,
        CartDelivery,
        DeliveryGoods
    },
    props: {},
    data() {
        return {
            editStatus: false, // 控制编辑/完成
            footerObj: {},
            list: [],
            requestFlag: false,
            dispatch_express: '0', // 快递
            express_enable: 0, // 快递是否开启
            processList: [], // 处理数据结构
            cartAdder:null,//添加购物车类对象
            showModal: false, // 清空
            loseList: [], // 失效商品列表

            mixDelivery: { // 配送方式混合支付信息
                express: {total: 0,total_price:0,list:[]},
            },
            mixModal: false

        }
    },
    computed: {
        backgroundImage() {
            return {
                'background-image':`url(${this.$utils.staticMediaUrl('decorate/logo_default.png')})`
            }
        }
    },
    watch: {
        // #ifdef H5
        '$Route.path': {
            handler(path){
                // 路由切换 清空购物车快速购买信息
                if(path !== '/pagesCart/index') {
                    this.$store.commit('quickPurchase/setCartChooseInfo',null)
                }
            },
        }
        // #endif
    },
    // #ifndef H5
    onUnload() {
        this.$store.commit('quickPurchase/setCartChooseInfo',null)
    },
    // #endif
    onShow(){
        // 刷新购物车数量
        this.$decorator.getModule('diymenu').getCartNum(true)
        this.requestFlag = true;
        this.getList()
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

    },
    methods: {
        async pullDownRefresh() {//下拉刷新，mixin.js中调用
            // uni.showLoading({
            //     title: '正在刷新',
            // })
            this.requestFlag = true;
            this.getList()
        },
        //编辑or完成
        edit() {
            this.editStatus = !this.editStatus;
            // 清空之前编辑的选中状态
            this.list.forEach(item => {
                item.editStatus = false
            });
        },
        // 编辑选中/取消选中
        editRadioChange(index, merchantId, type) {
            this.list[merchantId].goods[index].editStatus = !this.list[merchantId].goods[index].editStatus
        },
        // 编辑全选开关
        allSelectedRadioChange(status) {
            this.list.forEach(item => {
                item.goods.forEach(cItem=> {
                    cItem.editStatus = status
                })
            })
        },
        getList() {
            // uni.showLoading({title: '加载数据'});
            this.$api.goodApi.cartList().then((res) => {
                this.requestFlag = false;
                this.$loading.hideLoading();
                // uni.hideLoading();
                if (res.error == 0) {
                    this.list = this.handleList(res, res.list);
                    this.loseList = res.lose_list || []
                    console.log('list', res.list, this.list)
                    this.footerObj = {
                        selected_num: res.selected_num, //选中商品数量
                        selected_goods: res.selected_goods, //选中商品
                        all_selected: res.all_selected, //是否全选
                        total_price: res.total_price, //总价
                    };
                    this.$decorator.getModule('diymenu').getCartNum()
                    this.$closePageLoading()
                } else {
                    this.$toast(res.message)
                    setTimeout(() => {
                        this.$closePageLoading()
                    }, 1500)
                }
            }).catch(() => {
                uni.hideLoading()
                this.$closePageLoading()
            })
        },
        handleList(data, list) {
            // 单店铺的商品信息放到了goods里面
            if (list?.length && !list[0].goods) {
                list = [
                    {
                        goods: list
                    }
                ]
            }
            list.forEach(item => {
                item.goods.forEach(goods => {
                    goods.editStatus = false // 控制编辑选中
                })
            });
            this.processList = [...list]
            return list
        },
        toIndex() {
            this.$Router.auto({
                //#ifndef H5
                path: '/pages/index/index',
                //#endif
                //#ifdef H5
                path: '/'
                //#endif
            })
        },
        // 订单预提交  @params list为购物车弹窗提交
        preCreate(goods_id, type,list){
            let is_origin;
            this.validteDelivery(goods_id, type,is_origin)

        },
        // 校验所选快递是否支持
        validteDelivery(goods_id,type,is_origin){
            let params = { goods_id }
            if(type) {
                params = {...params, type, is_pop: '1'}
            }
            this.$api.orderApi.preOrderCreate(params, {errToast: false}).then(res=> {
                if(res.error == 0){
                    if(res.is_success == 1){
                        this.saveDelivery(res.dispatch_type,type,is_origin)
                    } else {
                        this.handleMixInfo(res)
                    }
                } else {
                    this.mixModal = false
                    setTimeout(() => {
                        this.$toast('商品信息变更')
                    }, 500);
                    this.getList()
                }
            })
        },
        // 处理结算方式
        handleMixInfo(res){
            let {count_info = {}, goods_data = {}} = res
            this.resetMixInfo()
            Object.keys(count_info).forEach(key=> {
                this.mixDelivery[key] = {
                    ...this.mixDelivery[key],
                    list: goods_data[key] || [],
                    total: count_info[key]?.total || 0,
                    total_price: count_info[key]?.total_price||0
                }
            })
            this.mixModal = true
        },
        resetMixInfo(){
            this.mixDelivery = { // 配送方式混合支付信息
                express: {total: 0,total_price:0,list:[]},
            }
        },
        // 保存支持快递方式
        saveDelivery(dispatch_type = [], type,is_origin){

            if(dispatch_type.length == 0) {
                this.$toast('没有可用的配送方式')
                return
            }

            let dispatchStatus = {
                dispatch_express: '0',
                express_enable: '0',
                dispatch_intracity: '0',
                intracity_enable: '0',
                dispatch_verify: '0',
                verify_enable: '0',
            }

            let opt = {
                'express': ['dispatch_express', 'express_enable'],
                'verify': ['dispatch_verify','verify_enable'],
                'intracity': ['dispatch_intracity', 'intracity_enable'],
            }
            // 选择推荐配送方式的某一项
            if(type) {
                opt[type].forEach(key=> {
                    dispatchStatus[key] = '1'
                })
            } else {
                // 使用支持的方式
                dispatch_type.forEach(key=> {
                    opt[key].forEach(item => {
                        dispatchStatus[item] = '1'
                    })
                })
            }
            // 保存可以使用的配送方式
            this.$store.commit('orderCreate/setDispatchStatus', dispatchStatus)
            this.create(is_origin)
        },
        create(is_origin) {
            if(this.mixModal) {
                this.mixModal = false
            }
            let goodsInfo = []
            // 存储store
            this.$store.commit('orderCreate/setGoodsInfo', goodsInfo)

            this.$store.commit('form/resetForm')
            // 确认订单页面

            let query = {
                is_cart: 1
            }
            // 原价购买
            if(is_origin) {
                query.is_origin = is_origin
            }
            this.$Router.auto({
                path: '/kdxOrder/create',
                query
            })
        },
        chooseShop(data) {
            // 判断购买权限
            if (this.getDisabled(data)) {
                return
            }
            let args = {
                select_all: 0
            };
            args.id = data.map(item => item.id);
            this.$api.goodApi.selectCart(args).then(res => {
                if (res.error != 0) {
                    uni.showToast({
                        title: res.message,
                        icon: 'none'
                    });
                    return;
                }
                this.getList()
            })
        },
        async clickBuyBtn({goods_id,id}){
            await this.$store.dispatch('quickPurchase/checkLoginStatus')
            // 获取商品详情
            this.$store.commit('quickPurchase/setCartChooseInfo',{is_reelect:'1',id})

            this.cartAdder.getGoodDetail(goods_id,'cart/clickBuyBtn').then((res) => {
                if (res.error === 0) {
                    // 打开goodsPicker
                    this.cartAdder.callback({
                        type: 'toggle',
                        data: {
                            type: 'add'
                        },
                    })
                }
            })
        },
        async customEventHandler(e) {//快速购买处理
            await this.cartAdder.pickerCallback(e)
            if (e.type === 'clickBtn') {
                this.$refs?.goodsPicker.toggle(); // 购物车添加成功关闭弹窗
                this.getList()
            }

        },
        // 清除失效商品
        clearLoseGoods(){
            this.showModal = true;
        },
        // 确认清除失效商品
        modalOk(){
            let id =  this.loseList.map(item => item.id)
            this.$api.goodApi.removeLose({id}).then(res=> {
                if(res.error === 0) {
                    this.getList()
                    this.showModal = false;
                }
            })
        },
        // 操作取消
        modalCancel(){
            this.showModal = false;
        },
        getDisabled(data){
            // 1.商品规格变更 2.库存为0 3.权限变更
            return data?.some(item => item.is_reelect == '1' || item.stock == '0' || item.buy_perm == '0' || item.is_lose_efficacy == '1')
        },
        handleCancel(){
            this.mixModal = false
        },
    },
}
</script>

<style lang="scss">
.cart-index {
    height: 100%;
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding-bottom: px2rpx(66);
    .container {
        box-sizing: border-box;
    }
    .edit {
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: right;
        font-size: 28rpx;
        color: $uni-text-color;
        padding-right: 48rpx;
    }
    .shop-item-box {
        margin-bottom: px2rpx(8);
        &:last-child {
            margin-bottom: 0;
        }
        .shop-item {
            padding: px2rpx(10) px2rpx(8);
            margin: 0 px2rpx(12);
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 12rpx 12rpx 0 0;
            font-size: px2rpx(14);
            .shop-logo {
                margin-right: px2rpx(8);
                width: px2rpx(24);
                height: px2rpx(24);
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            .shop-img {
                width: px2rpx(24);
                height: px2rpx(24);
                border-radius: 50%;
            }
            .self-label {
                margin-right: px2rpx(4);
                padding: px2rpx(1) px2rpx(3);
                line-height: px2rpx(12);
                background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                color: #fff;
                font-size: px2rpx(9);
                font-weight: 600;
                border-radius: px2rpx(2);
            }
            .shop-name {
                line-height: 20px;
            }
        }
        .radio-box {
            padding-right: 18rpx;
            align-items: center;
            .iconfont-m- {
                font-size: px2rpx(24);
                line-height: px2rpx(24);
                color: $uni-border-color;
            }
            .icon-m-yes {
                font-size: px2rpx(24);
                line-height: px2rpx(24);
                text-align: center;
                border-radius: 50%;
                color: $uni-color-primary;
            }
            .disalbed-icon {
                height: px2rpx(18);
                width: px2rpx(18);
                border-radius: 50%;
                margin: px2rpx(3);
                background:#f5f5f5;
                border: px2rpx(1) solid #E6E7EB;
            }
        }
    }
    .goods-content-box {
        padding: 0rpx 24rpx;
        .goods-content {
            border-bottom: 1px solid #E6E7EB;

        }
        &:last-child {
            .goods-content {
                border-bottom-left-radius: px2rpx(6);
                border-bottom-right-radius: px2rpx(6);
                border-bottom: none;
            }
        }
    }

    .lose-main {
        padding: px2rpx(8) px2rpx(12) 0;

        .lose-container {
            overflow: hidden;
            border-radius: px2rpx(6);
            background:#fff;
        }

        .lose-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: px2rpx(40);
            padding: 0 px2rpx(12);

            &-left {
                font-size: px2rpx(14);
                line-height: px2rpx(20);
                color: #212121;
            }

            &-right {
                border: px2rpx(1) solid #E6E7EB;
                border-radius: px2rpx(40);
                width: px2rpx(102);
                height: px2rpx(27);
                line-height: px2rpx(27);
                font-size: px2rpx(12);
                text-align: center;
                color: #212121;
            }
        }
    }
    .goods-single-box {
        border-radius: px2rpx(6);
    }
    .full-reduce-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: px2rpx(10) px2rpx(12) px2rpx(3) px2rpx(12);
        background-color: #ffffff;
        margin: 0 px2rpx(12);
        border-top-left-radius: px2rpx(6);
        border-top-right-radius: px2rpx(6);
        .activity-content {
            flex: 1;
            width: 0;
            display: flex;
            align-items: center;
        }
        .label-tag {
            font-size: px2rpx(10);
            line-height: px2rpx(12);
            color: $uni-color-primary;
            border: px2rpx(1) solid #FF3C29;
            border-radius: px2rpx(2);
            padding: 0 px2rpx(2);
            display: inline-block;
        }
        .activity-rule {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: $color-w1;
            font-weight: bold;
            padding-left: px2rpx(4);
        }
        .activity-btn {
            display: flex;
            align-items: center;
            font-size: px2rpx(12);
            color: $uni-color-primary;
            flex-shrink: 0;
            padding-left: px2rpx(6);
            height: px2rpx(16);
            line-height: px2rpx(16);
            >i {
                display: inline-block;
                font-size: px2rpx(16);
            }
            >span {
                margin-bottom: px2rpx(1);
            }
        }
    }
}
</style>
