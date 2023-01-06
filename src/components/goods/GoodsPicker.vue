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
        <pick-mask v-if="showmodal&&currentGoodId">
            <view class="block-cover flex" >
                <view class="flex1" @click="toggle"></view>
                <view class="picker-content flex-column" :style="{'padding-bottom':paddingBottom}">
                    <div class="picker-close" @click="toggle">
                        <i class="icon-m-fucengguanbi iconfont-m-"></i>
                    </div>
                    <view class="picker-goods flex">
                        <img class="picker-goods-img" :src="$utils.mediaUrl(optionPrice.thumb)" @click="clickImage($utils.mediaUrl(optionPrice.thumb))" alt="">
                        <view class="flex1">
                            <view class="picker-price flex ">
                                <block>
                                    <view class="price theme-primary-price" v-if="optionPrice.member_price != 'null'">
                                        <text :style="{'font-size': setPriceFontSize('member_price', 'unit')}">￥</text>
                                        <text class="fs-18" :style="{'font-size':setPriceFontSize('member_price')}">{{optionPrice.member_price}}</text>
                                    </view>
                                    <view class="price theme-primary-price" v-else>
                                        <text :style="{'font-size':setPriceFontSize('price', 'unit')}">￥</text>
                                        <text class="fs-18 ml-0" :style="{'font-size':setPriceFontSize('price')}">{{optionPrice.price||0}}</text>
                                    </view>
                                </block>
                                <!--  -->
                                <!-- 会员等级标签 -->
                                <view class="del-price" v-if="showMemberLevel">
                                    <span class="level">
                                        <i class="icon-m-huangguan iconfont-m-"></i>
                                        <span class="level-name" >{{userInfo.level_name}}</span>
                                    </span>
                                </view>
                            </view>
                            <view class="money"  v-if="optionPrice.delPrice>0">￥{{optionPrice.delPrice||0}}</view>
                            <view class="picker-stock" v-if="goodsData && goodsData.ext_field && goodsData.ext_field.show_stock == 1">库存{{optionPrice.stock||0}}件</view>
                            <div v-if="goodsData && goodsData.has_option && goodsData.has_option === '1'">
                                <view class="picker-choose-text" v-if="chooseOption.length > 0">
                                    <text>已选择：</text>
                                    <text>{{getChoosedTitle}}</text>
                                </view>
                                <view class="picker-choose-text" v-else>请选择 {{getChooseTitle}}</view>
                            </div>
                        </view>
                    </view>
                    <scroll-view scroll-y class="picker-options">
                        <view class="opt-item van-hairline--bottom" v-for="(item, index) in specs" :key="index">
                            <view>
                                <view class="spec-title" :class="{'first':index==0}">{{item.title}}</view>
                                <view class="items flex">
                                    <view class="specs-item" v-for="(specs, idx) in item.items" :key="idx" @click="chooseItem(index,specs)" :class="[getItemClass(specs.id,index)]">
                                        {{specs.title}}
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="picker-number opt-item" :class="{'padTop-16':goodsData.has_option==1}">
                            <view class="flex-between align-center">
                                <view class="title">数量</view>
                                <view class="flex align-center">
                                    <view class="uni-color-primary" v-if="isActiveBuy">
                                        <span v-if="currentActInfo.rules.limit_type!='0'&&currentActInfo.rules.limit_num>0">限购{{commonActBuyNum}}件</span>
                                    </view>
                                    <view class="add-num">
                                        <text class="iconfont-m- icon-m-jianhao action-icon left" @click="clickAdd(-1)" :class="{
                                            disabled: (changeNum.total<=1)
                                        }"></text>
                                        <input class="goods-total" type="number" v-model="changeNum.total" @blur="handlerChangeNumber"/>
                                        <text class="iconfont-m- icon-m-jiahao  action-icon right" :class="{
                                            disabled: (optionPrice.stock==changeNum.total)
                                        }"  @click="clickAdd(1)"></text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                    <view class="btn-box">
                        <view class="add-cart flex" v-if="show">
                            <block>
                                <view class="btn btn-sure disabled" v-if="type == 'add' && goodsData.stock =='0'">已售罄</view>
                                <btn style="flex:1" type="do" size="middle" classNames="theme-primary-bgcolor" v-if="type == 'add' && goodsData.stock > 0" @btn-click="addCart('cart')">确定</btn>

                                <btn style="flex:1" type="do" size="middle" v-if="type == 'buy'" @btn-click="addCart('buy')" classNames="theme-primary-bgcolor" :classNames="commonActBuyDisabled ?'': 'theme-primary-bgcolor'" :disabled="commonActBuyDisabled">{{from === 'creditShop'?'立即兑换':'确定'}}</btn>
                                <!-- 实体商品才能加购 -->
                                <button-group style="flex:1" v-if="type == 'spec'" :simple="goodsData.type === '0'">
                                    <btn classNames="theme-sub-bgcolor theme-primary-color" :class="{
                                        group: from !== 'creditShop' && goodsData.type === '0'
                                    }" type="do" size="middle" v-if="from !== 'creditShop' && goodsData.type === '0'"  @btn-click="addCart('cart')">加入购物车</btn>
                                    <btn :class="{
                                        group: from !== 'creditShop' && goodsData.type === '0'
                                    }" classNames="theme-primary-bgcolor" style="flex: 1" type="do" size="middle" @btn-click="addCart('buy')">{{from === 'creditShop'?'立即兑换':'立即购买'}}</btn>
                                </button-group>
                            </block>
                        </view>
                        <view class="btn btn-buy theme-primary-bgcolor" v-else @click.stop="addCart('buy')">购买</view>
                    </view>
                </view>
            </view>
        </pick-mask>
    </theme-content>
</template>

<script>
    import PickMask from '@/components/picker/PickMask'

    // #ifdef MP-TOUTIAO
    import EventBus from '@/common/eventBus.js'
    // #endif
    import { mapState } from 'vuex'
    import {px2rpx} from "@/assets/jsTools/environment";
    import { getActivityName } from "@/common/helper/goods"
    import { SINGLE_BUY_ACTIVE } from '@/common/variable/activity'


    const emptyFn = ()=> { }

    export default {
        name: 'goodsPicker',
        props: {
            minBuy: {
                type: [Number, String],
                default: 1
            },
            maxBuy: {
                type: [Number, String],
                default: 0
            },
            detailInfo: null,
            optionsInfo: null,
            from: {
                type: String,
                default: ''
            }
        },
        components: {
            PickMask,
        },
        filters: {
            formatMoney(money) {
                if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                    if (!Number.isInteger(+money)) {
                        return parseFloat(money)?.toFixed(2)
                    }
                    return parseFloat(money)
                } else {
                    return 0
                }
            }
        },
        data() {
            return {
                userInfo: {},
                showmodal: false,
                show: true,
                type: 'cart',
                optionPrice: {},
                chooseOption: [], // 选中文案
                choose: [], // 选中规格
                disabled: [], // 禁选
                chooseData: [],
                changeNum: {
                    total: 1,
                    goods_id: '',
                    option_id: '',
                    mode: 1,
                },
                callback: null,
                currentGoodId: '',
                activePicker: {
                    optionPrice: {},
                    chooseOption: [],
                    choose: [],
                    disabled: [],
                    chooseData: []
                },
                normalPicker: {
                    optionPrice: {},
                    chooseOption: [],
                    choose: [],
                    disabled: [],
                    chooseData: [],
                },
            }
        },
        watch: {
            '$store.state.login.isLogin': {
                immediate: true,
                handler() {
                    if (this.$store.state.login.isLogin) {
                        this.$api.memberApi.getUserInfo().then(res => {
                            this.userInfo = res.data
                        })
                    }
                }
            }
        },
        mounted() {
            // #ifdef MP-TOUTIAO
            EventBus.$emit('mounted-child', this)
            // #endif
        },
        computed: {
            // ...mapState('quickPurchase', {
            //     goodsInfo: state => state?.detailInfo,
            //     optionsData: state => state?.optionsInfo
            // }),

            // ...mapState('creditQuickPurchase', {
            //     goodsInfo: state => state?.detailInfo,
            //     optionsData: state => state?.optionsInfo
            // }),

            ...mapState('setting', {
                credit_text: state => state.systemSetting.credit_text,
            }),
            goodsInfo() {
                if (this.from === 'creditShop') {
                    return this.$store.state.creditQuickPurchase.detailInfo
                }
                return this.$store.state.quickPurchase.detailInfo
            },
            optionsData() {
                if (this.from === 'creditShop') {
                    return this.$store.state.creditQuickPurchase.optionsInfo
                }
                return this.$store.state.quickPurchase.optionsInfo
            },
            buy_num() {
                return this.goodsInfo?.data?.buy_num
            },
            goodsData() {
                let res = {}
                res = this.goodsInfo?.data?.goods
                if (res && this.currentGoodId != res?.id) {
                    this.currentGoodId = res.id;
                    // 兼容小程序快速购买不显示商品信息
                    this.optionPrice = {
                        thumb: res.thumb,
                        price: res.price,
                        stock: res.stock,
                        member_price: this.activityData?.member_price?.price ?? 'null',
                        delPrice: res.original_price,
                    }
                }
                return res
            },
            getForm() {
                if (this.goodsData?.form_data?.content) {
                    let content = this.$store.state.form?.form?.content
                    return content;
                } else {
                    return false;
                }
            },
            activityData() {
                return this.goodsInfo?.activity || {}
            },
            options() {
                return this.optionsData?.options || {}
            },
            specs() {
                return this.optionsData?.spec || []
            },
            ...mapState(['areaBottom']),
            getChooseTitle() {
                if (this.specs.length) {
                    return this.specs.map(v => v.title).join('，')
                }
                return ''
            },
            getChoosedTitle() {
                if (this.chooseOption.length) {
                    return this.chooseOption.filter(item => !!item).join('，')
                }
            },
            paddingBottom() {
                return this.areaBottom + 'px'
            },
            /**
             * 购买类型
             * 普通：原价 
             * 活动：秒杀 
             */
            buyType() {
                return this.optionsData.activeName || ''
            },
            // 当前商品进行中的活动
            currentActName() {
                return getActivityName(this?.activityData)
            },
            // 活动商品正常下单
            isActiveBuy() {
                return SINGLE_BUY_ACTIVE.includes(this.buyType)
            },
            currentActInfo() {
                return this.activityData[this.currentActName] || {}
            },
            // 活动当前购买数量(公共)
            commonActBuyNum() {
                let canbuy = this.currentActInfo?.rules?.limit_num - this.currentActInfo?.buy_count
                let stock = this.goodsData?.stock
                return Math.min(canbuy, stock)
            },
            // 活动商品不可购买(公共)
            commonActBuyDisabled() {
                return this.isActiveBuy && this.commonActBuyNum <= 0;
            },
            showMemberLevel() {
                return this.userInfo.level_name && this.from!=='creditShop'
            },
        },
        methods: {
            getItemClass(id,i){
                if(this.disabled.includes(id)){
                    return 'disabled'
                }

                if(this.choose[i] == id){
                    return 'theme-primary-border theme-primary-color theme-sub-bgcolor theme-spec-bgcolor'
                }
                return ''
            },
            toggle(callback, type, cacheNum) {
                this.type = type;
                this.showmodal = !this.showmodal;
                if (this.showmodal) {
                    this.getPickOpt()
                    this.handleGoods(cacheNum)
                } else {
                    this.savePickOpt()
                }
                if (typeof callback == 'function') {
                    this.callback = callback
                }
            },
            // 秒杀存储秒杀数据
            savePickOpt() {
                let {optionPrice, chooseOption, choose, disabled, chooseData, changeNum} = this;
                let key = this.isActiveBuy ? 'activePicker' : 'normalPicker';

                this[key] = {
                    optionPrice, chooseOption, choose, disabled, chooseData, changeNum, disabled, id: this.currentGoodId
                }
            },
            // 获取活动数据
            getPickOpt() {
                let info = this.isActiveBuy ? this.activePicker : this.normalPicker;
                // 切换其他商品
                this.refreshOpt()
                if (info.id === this.goodsInfo?.data?.goods?.id) {
                    let {optionPrice, chooseOption, choose, disabled, chooseData, changeNum} = info;
                    this.optionPrice = optionPrice;
                    this.chooseOption = chooseOption;
                    this.choose = choose; // 选中规格
                    this.disabled = disabled; // 禁选
                    this.chooseData = chooseData;
                    this.changeNum = changeNum || {
                        total: 1,
                        goods_id: '',
                        option_id: '',
                        mode: 1,
                    },

                        this.$emit('custom-event', {
                            type: 'changeNum',
                            data: {
                                total: this.changeNum.total
                            }
                        })
                    this.$emit('changeNum', this.changeNum.total)
                }
            },
            handleGoods(cacheNum) {


                if (!(cacheNum && cacheNum === 'cacheNum')) {
                    this.$set(this.changeNum, 'total', 1)
                    this.$emit('custom-event', {
                        type: 'changeNum',
                        data: {
                            total: this.changeNum.total
                        }
                    })
                }
                // 处理活动库存
                this.handleActStock()
                // 第一次打开弹窗处理一遍禁用
                let info = this.isActiveBuy ? this.activePicker : this.normalPicker;
                if (info.id != this.goodsInfo?.data?.goods?.id) {
                    this.disabled = this.getDisabled(this.choose);
                }
                // 普通商品 // 假如有选中的，获取已选中规格的信息
                if (this.choose.length > 0) {
                    this.getOptions(this.choose)
                } else {
                    this.handlePrice()
                }

                if (this.from === 'creditShop') {
                    this.handleCreditShopLimit()
                    return
                }
            },
            // 处理活动库存
            handleActStock() {
                let actStockHandles = {
                    seckill: this.isActiveBuy ? this.commonActStockHandle : null,
                }

                let actStockHandle = actStockHandles[this.currentActName]
                if (actStockHandle) {
                    actStockHandle.call(this, this.currentActInfo.goods_info, this.options)
                }

                if (this.from === 'creditShop') {
                    this.handleCreditShopDisabled(this.options)
                }
            },
            // 积分商品禁选
            handleCreditShopDisabled(options) {
                for (let i in options) {
                    if (!options[i]?.activity?.credit_shop) {
                        options[i].activity.credit_shop = {
                            credit_shop_price: '0',
                            credit_shop_credit: '0',
                            credit_shop_stock: 0
                        };
                        options[i].stock = 0
                    } else {
                        options[i].stock = Math.min(options[i].activity.credit_shop.credit_shop_stock, options[i].stock)
                    }
                }
            },
            // 处理公共活动库存
            commonActStockHandle(actOptions, options) {
                // 原价购买直接返回
                for (let i in options) {
                    if (!(Object.keys(actOptions).includes(options[i].id))) {
                        options[i].stock = 0
                    } else {
                        // 活动设置库存，原库存 显示最小值
                        options[i].stock = Math.min(options[i].activity[this.currentActName]?.activity_stock, options[i].stock)
                    }
                }
            },
            // 公共活动限购
            handleCommonActLimit() {
                let {limit_type} = this.currentActInfo?.rules
                if (limit_type !== '0') {
                    this.$set(this.changeNum, 'total', Math.min(this.commonActBuyNum, this.changeNum.total))
                }
            },

            // 积分商城限购
            handleCreditShopLimit() {
                let {goods_limit_type: limit_type, goods_limit_num: limit_num } = this.goodsInfo.credit_shop;
                let maxNum = Math.min(limit_num, limit_num-this.goodsInfo.data.buy_num);

                if (limit_type !== '0') {
                    this.$set(this.changeNum, 'total', Math.min(maxNum, this.changeNum.total))
                }
            },
            /**
             * 选中规格
             * id 规格id
             * spec 子规格
             * */
            chooseItem(idx, data) {
                // 禁用防止点击
                if (this.disabled.includes(data.id)) return;
                // 取消start
                if (this.choose[idx] == data.id) {
                    this.$set(this.choose, idx, '');
                    this.$set(this.chooseOption, idx, '');
                    this.disabled = []

                } else {
                    this.$set(this.choose, idx, data.id);
                    this.$set(this.chooseOption, idx, data.title)
                }
                // 取消end
                let choose = this.choose.filter(item => item);
                let chooseOption = this.chooseOption.filter(item => item);
                if (chooseOption.length == 0) {
                    this.chooseOption = [];
                }
                // 剩余一个规格未选时判断可选项start
                if (choose.length > 0 && choose.length == this.specs.length - 1) {
                    this.disabled = [];
                    this.disabled = this.getDisabled(choose)
                } else if (choose.length == 0) {
                    this.choose = []
                    this.handleGoods()
                }
                //剩余一个规格未选时判断可选项end
                this.$set(this.chooseData, idx, data);
                // 选择完成
                if (this.choose.length == this.specs.length) {
                    for (let i = 0; i < this.choose.length; i++) {
                        if (!this.choose[i]) {
                            this.returnChoose('')
                            return
                        }
                        if (i === (this.choose.length - 1)) {
                            // 一个子规格单独校验
                            if (this.specs.length == 1) {
                                this.getDisabled([])
                            } else {
                                this.disabled = [];
                                let arr = this.getNumbers(this.choose, this.specs.length - 1, false),
                                    disabled = [];
                                arr.forEach((item, index) => {
                                    disabled = disabled.concat(this.getDisabled(item))
                                });
                                this.disabled = disabled;
                            }

                            this.getOptions(this.choose)
                        }
                    }
                } else {
                    this.returnChoose('')
                }
            },
            // 获取对象某个key的值
            getObjectKeys(obj, str) {
                let res = obj;
                for (let index = 0; index < str.split('.').length; index++) {
                    let key = str[index];
                    if (res[key]) {
                        res = res[key]
                    } else {
                        res = res.stock
                        break
                    }

                }
                return res;
            },
            // 获取相应规格数据
            async getOptions(choose) {
                let choose_copy = JSON.parse(JSON.stringify(choose));
                let data = choose_copy.sort(function (a, b) {
                    return a - b
                }).join();
                let keys = Object.keys(this.options);

                let stockKey = this.isActiveBuy ? `activity.${this.currentActName}.activity_stock` : 'stock';
                for (let i = 0; i < keys.length; i++) {
                    if (keys[i] == data) {
                        await this.handleOptionsPrice(keys[i]);
                        let stock = Math.min(this.getObjectKeys(this.options[keys[i]], stockKey), this.options[keys[i]].stock);
                        // 判断数量
                        if (Number(this.changeNum.total) > Number(stock)) {
                            this.changeNum.total = Number(stock)
                        }
                        if (Number(stock) != 0 && this.changeNum.total == 0) {
                            this.changeNum.total = 1
                        }
                        // 判断库存
                        if (stock == 0) {
                            this.$toast('库存不足');
                            this.returnChoose('');
                        } else {
                            this.optionPrice.optionName = this.chooseOption.join('，');
                            this.returnChoose(data, this.optionPrice)
                        }
                        break
                    }
                    this.returnChoose('');
                }
            },
            // 处理商品价格
            handlePrice() {
                let {stock, has_option, thumb, original_price, min_price, max_price, price} = this.goodsData
                let member_price;

                if (has_option == '0') {
                    member_price = this.activityData.member_price ? `${this.activityData.member_price.min_price}` : 'null'
                } else {
                    price = this.$utils.formartPrice(`${min_price}-${max_price}`)
                    member_price = this.activityData.member_price ? `${this.activityData.member_price.min_price}-${this.activityData.member_price.max_price}` : 'null'
                    member_price = this.$utils.formartPrice(member_price)
                }

                let optsInfo = {
                    thumb: thumb,
                    price,
                    stock,
                    member_price,
                    delPrice: original_price
                }

                let handlePriceFns = {
                    seckill: this.isActiveBuy ? this.handleSeckillPrice : null,
                    groups: this.isActiveBuy ? this.handleGroupsPrice : null,
                }

                let handlePriceFn = handlePriceFns[this.currentActName]
                if (handlePriceFn) {
                    let result = handlePriceFn.call(this) || {}
                    optsInfo = {...optsInfo, ...result}
                }

                if (this.from === 'creditShop') {
                    let result2 = this.handleCreditShopPrice();
                    optsInfo = {...optsInfo, ...result2}
                }
                this.optionPrice = optsInfo

            },

            // 处理积分商城价格
            handleCreditShopPrice() {
                let {min_price, min_price_credit, credit_shop_stock} = this.goodsInfo.credit_shop;
                return {
                    price: `${min_price_credit}${this.credit_text}+${min_price}元`, stock: credit_shop_stock
                }
            },

            // 处理秒杀价格
            handleSeckillPrice() {
                let price, stock;
                let goodsStock = this.goodsData?.stock;
                let {activity_stock = 0, activity_price, price_range} = this.currentActInfo

                if (this.goodsData.has_option == '0') {
                    price = activity_price
                } else {
                    price = `${price_range?.min_price}-${price_range?.max_price}`
                    price = this.$utils.formartPrice(price)
                }
                stock = Math.min(goodsStock, activity_stock)

                return {
                    price, stock
                }
            },
            // 拼团处理价格
            handleGroupsPrice() {
                let stock;
                let goodsStock = this.goodsData?.stock;
                let { activity_stock = 0, price, price_range } = this.currentActInfo
                if (this.goodsData.has_option == '0') {
                    if (this.hasLevelGroups && this.groupsLevel !== 0) {
                        price = this.currentActInfo?.every_ladder_min_price[this.groupsLevel]
                    } else if (!this.hasLevelGroups) {
                        // 表单情况下 单规格普通
                        price = this.currentActInfo?.activity_price
                    } else {
                        price = `${price_range?.min_price}-${price_range?.max_price}`
                        price = this.$utils.formartPrice(price)
                    }
                } else {

                    price = `${price_range?.min_price}-${price_range?.max_price}`
                    price = this.$utils.formartPrice(price)
                }
                stock = Math.min(goodsStock, activity_stock)
                return {
                    price, stock
                }
            },
            // 处理规格价
            handleOptionsPrice(data) {
                let {price, stock, id, thumb, original_price, activity} = this.options[data]

                let optsInfo = {
                    id,
                    price,
                    stock,
                    thumb: thumb || this.goodsData.thumb,
                    delPrice: original_price,
                    member_price: activity?.member_price?.min_price ?? 'null'
                }

                let handleOptsFns = {
                    seckill: this.isActiveBuy ? this.handleSeckillOptsPrice : null,
                    groups: this.isActiveBuy ? this.handleGroupsOptPrice : null,
                }

                let handleOptsFn = handleOptsFns[this.currentActName]
                if (handleOptsFn) {
                    let result = handleOptsFn.call(this, data, this.options[data]) || {}
                    optsInfo = {...optsInfo, ...result}
                }

                if (this.from === 'creditShop') {
                    let result2 = this.handleCreditShopOptPrice(data, this.options[data]);
                    optsInfo = {...optsInfo, ...result2}
                }

                this.optionPrice = optsInfo
            },

            handleCreditShopOptPrice(data, currentOptData) {
                let {id, credit_shop_price, credit_shop_credit, credit_shop_stock} = currentOptData.activity.credit_shop;

                return {
                    price: `${credit_shop_credit}${this.credit_text}+${credit_shop_price}元`,
                    stock: credit_shop_stock,
                    credit_option_id: id
                }
            },

            // 秒杀处理规格价
            handleSeckillOptsPrice(data, currentOptData) {
                let goodsStock = currentOptData?.stock;
                let {activity, stock} = currentOptData
                let price = activity?.seckill?.activity_price
                let activity_stock = this.currentActInfo?.activity_stock || 0
                stock = Math.min(goodsStock, activity_stock)
                return {
                    price,
                    stock
                }
            },
            // 拼团处理规格价
            handleGroupsOptPrice(data, currentOptData) {

                let goodsStock = currentOptData?.stock;

                let { activity, stock } = currentOptData
                let price = activity?.groups?.price

                // 阶梯拼
                if (this.currentActInfo.inner_type == '1') {
                    // 选中阶梯
                    if (this.groupsLevel != 0) {
                        price = activity.groups.ladder_price[this.groupsLevel]
                    } else {
                        // 未选中
                        let { price_range } = this.currentActInfo
                        price = `${price_range?.min_price}-${price_range?.max_price}`
                        price = this.$utils.formartPrice(price)
                    }
                }

                let activity_stock = this.currentActInfo?.activity_stock || 0
                stock = Math.min(goodsStock, activity_stock)
                return {
                    price,
                    stock
                }
            },
            clickLevel(index) {

                if (this.choose.length && this.specs.length == this.choose.length && this.goodsData.has_option == '1') {
                    this.handleOptionsPrice(this.choose.join(','))
                } else {
                    this.handlePrice()
                }
            },
            // 输入数量
            handlerChangeNumber(e) {
                // setTimeout(() => {
                let num = Number(parseInt(e.target.value));
                if (isNaN(num)) {
                    this.changeNum.total = 1;
                    return
                }
                this.clickAdd(num, 'noAdd')
                // },0)
            },
            // 修改数量
            clickAdd(data, type) {
                if (data == -1 && this.changeNum.total <= 1) {
                    this.$toast('不能减少了');
                    return
                }
                let num = Number(this.changeNum.total) + data;
                if (type === 'noAdd') {
                    num = Number(data);
                }
                let clickFns = {
                    seckill: this.isActiveBuy ? this.editCommonActLimit : this.editTotalLimit,
                }
                let clickFn = clickFns[this.currentActName] || this.editTotalLimit
                clickFn.call(this, num).then(res => {
                    this.changeNum.total = res
                    this.$emit('custom-event', {
                        type: 'changeNum',
                        data: {
                            total: res
                        }
                    })
                    this.$emit('changeNum', res)
                })

                if (this.from === 'creditShop') {
                    this.editCreditShopLimit(num)
                    return
                }

            },
            // 修改限制
            editTotalLimit(num) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (num > Number(this.optionPrice.stock)) {
                            num = this.optionPrice.stock;
                            this.$toast('库存不足');
                        }
                        resolve(num)
                    }, 0)
                })
            },
            

            // 积分商城限购
            editCreditShopLimit(num) {
                let {goods_limit_type: limit_type, goods_limit_num: limit_num, credit_shop_stock, type} = this.goodsInfo.credit_shop;
                let result = num;
                let goodsStock, activity_stock;
                if (limit_type !== '0' && Number(this.goodsInfo.data.buy_num) >= Number(limit_num)) {
                    this.$toast('已达到最多购买个数');
                    return
                }
                let maxNum = Math.min(limit_num, limit_num-this.goodsInfo.data.buy_num);

                if (+type === 0) {
                    // 适配快速购买单规格
                    if (this.goodsData.has_option == '0') {
                        goodsStock = this.goodsData.stock;
                        activity_stock = credit_shop_stock;
                    } else {
                        goodsStock = this.options[this.choose.join(',')]?.stock;
                        activity_stock = this.options[this.choose.join(',')]?.activity?.credit_shop.credit_shop_stock;
                    }
                } else {
                    // 优惠券限购
                    if (+this.goodsData.stock_type === 0) {
                        activity_stock = credit_shop_stock
                        goodsStock = credit_shop_stock++
                    } else {
                        goodsStock = this.goodsData.stock;
                        activity_stock = credit_shop_stock;
                    }
                }

                let stock = Math.min(goodsStock, activity_stock);
                // 限购
                if (limit_type !== '0') {
                    // 购买数量大于库存时
                    if (num <= limit_num && stock && num > stock) {
                        this.$toast('库存不足');
                        result = stock;
                    } else {
                        // 超出数量时
                        if (num > maxNum) {
                            this.$toast('限购' + maxNum + '件');
                        }
                        result = Math.min(maxNum, num)
                    }
                } else {
                    // 不限购
                    if (stock && num > stock) {
                        result = stock;
                        this.$toast('库存不足')
                    }
                }
                this.changeNum.total = result;
                this.$emit('custom-event', {
                    type: 'changeNum',
                    data: {
                        total: result
                    }
                });
                this.$emit('changeNum', result);
            },

            editCommonActLimit(num) {
                let result = num
                let {limit_type, limit_num} = this.currentActInfo?.rules;
                let goodsStock, activity_stock;

                // 适配快速购买单规格
                if (this.goodsData.has_option == '0') {
                    goodsStock = this.goodsData.stock;
                    activity_stock = this.currentActInfo.activity_stock;
                } else {
                    goodsStock = this.options[this.choose.join(',')]?.stock;
                    activity_stock = this.options[this.choose.join(',')]?.activity?.[this.currentActName].activity_stock;
                }

                let stock = Math.min(goodsStock, activity_stock)
                // 限购
                if (limit_type !== '0') {
                    // 购买数量大于库存时
                    if (num <= limit_num && stock && num > stock) {
                        this.$toast('库存不足')
                        result = stock;
                    } else {
                        // 超出数量时
                        if (num > this.commonActBuyNum) {
                            this.$toast('限购' + this.commonActBuyNum + '件');
                        }
                        result = Math.min(this.commonActBuyNum, num)
                    }
                } else {
                    // 不限购
                    if (stock && num > stock) {
                        result = stock;
                        this.$toast('库存不足')
                    }
                }
                return Promise.resolve(result)
            },

            // 获取禁用规格
            getDisabled(choose) {
                let obj = [],
                    keys = Object.keys(this.options),
                    disabled = [];
                // 只有一个子规格单独处理
                if (this.optionsData?.spec?.length == 1) {
                    disabled = keys.reduce((total, current, key) => {
                        if (this.options[current].stock == 0) {
                            total.push(current)
                        }
                        return total
                    }, [])
                } else {
                    choose.forEach((item, index) => {
                        keys.forEach((row, i) => {
                            if (row.split(',').includes(item) && this.options[row].stock == 0) {
                                obj.push(row)
                            }
                        });
                        keys = Object.assign(obj);
                        obj = []
                    });
                    keys.forEach((item, index) => {
                        choose.forEach((r, i) => {
                            item = item.split(',').filter(row => row != r).join(',')
                        });
                        disabled.push(item)
                    });
                }
                return disabled
            },
            //获取数组  所有规格的组合
            getNumbers(source, count, isPermutation = true) {
                //如果只取一位，返回数组中的所有项，例如 [ [1], [2], [3] ]
                let currentList = source.map((item) => [item]);
                if (count === 1) {
                    return currentList
                }
                let result = [];
                //取出第一项后，再取出后面count - 1 项的排列组合，并把第一项的所有可能（currentList）和 后面count-1项所有可能交叉组合
                for (let i = 0; i < currentList.length; i++) {
                    let current = currentList[i];
                    //如果是排列的方式，在取count-1时，源数组中排除当前项
                    let children = [];
                    if (isPermutation) {
                        children = this.getNumbers(source.filter(item => item !== current[0]), count - 1, isPermutation)
                    }
                    //如果是组合的方法，在取count-1时，源数组只使用当前项之后的
                    else {
                        children = this.getNumbers(source.slice(i + 1), count - 1, isPermutation)
                    }
                    for (let child of children) {
                        result.push([...current, ...child])
                    }
                }
                return result
            },
            returnChoose(data, options) {
                let is_origin = SINGLE_BUY_ACTIVE.includes(this.currentActName) && // 是否支持单购
                    this.currentActInfo &&
                    !this.isActiveBuy; // 单独购买

                this.$emit('custom-event', {
                    type: 'choose',
                    data: {
                        data,
                        options,
                        is_origin
                    }
                })
                this.$emit('choose', data, options, is_origin)
            },
            addCart(type) {
                setTimeout(() => {
                    /* 判断绑定手机号场景 */
                    if (type == 'cart' || type == 'buy') {
                        if (this.$utils.hasBindBySence(type)) {
                            this.toggle()
                            this.$store.commit('login/setModal', true)
                            return
                        }
                    }


                    let is_origin = SINGLE_BUY_ACTIVE.includes(this.currentActName) && // 是否支持单购
                        this.currentActInfo &&
                        !this.isActiveBuy; // 单独购买
                    let opt = {
                        is_origin
                    }

                    if (this.buyType == 'groups') {
                        opt = { ...opt, ...this.getGroupsParams() }
                    }

                    this.$emit('custom-event', {
                        type: 'clickBtn',
                        data: {
                            type,
                            ...opt
                        }
                    })
                    this.$emit('clickBtn', type, opt)
                }, 0)
            },
            getGroupsParams() {
                let is_join = this.optionsData.is_join == '1' ? '1' : '0'
                let extend_params = {
                    is_join,
                    is_ladder: '0'
                }
                // 参团加入team_id
                if (this.optionsData.team_id) {
                    extend_params.team_id = this.optionsData.team_id
                }
                if (this.optionsData.activity_id) {
                    extend_params.activity_id = this.optionsData.activity_id
                }
                if (this.hasLevelGroups) {
                    extend_params.ladder = this.groupsLevel,
                        extend_params.is_ladder = '1'
                }
                return { extend_params }
            },
            // 商品变更重置数据
            refreshOpt() {
                this.choose = []; // 选中规格
                this.disabled = []; // 禁选
                this.chooseData = [];
                this.chooseOption = []
            },
            changeForm(data) {
                this.$store.commit('form/setFormContent', data);
            },
            clickImage(path) {
                uni.previewImage({
                    urls: [path],
                    current: 0
                })
            },
            // 计算价格的字体大小
            setPriceFontSize(key, type = 'price') {
                if (type === 'price') {
                    if (this.optionPrice?.[key]?.length > 19) {
                        return px2rpx(26)
                    } else if (this.optionPrice?.[key]?.length > 15) {
                        return px2rpx(30)
                    } else {
                        return px2rpx(36)
                    }
                } else {
                    if (this.optionPrice?.[key]?.length > 19) {
                        return px2rpx(22)
                    } else {
                        return px2rpx(24)
                    }
                }
            }
        },
    };
</script>

<style lang="scss">
    .block-cover {
        background: rgba(0, 0, 0, 0.6);
        height: 100%;
        width: 100%;
        line-height: 1;
        position: fixed;
        top: 0;
        left: 0;
        flex-direction: column;
        z-index: 999999;
        .picker-close {
            position: absolute;
            top: 18rpx;
            right: 18rpx;
            width: 48rpx;
            height: 48rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            .iconfont-m- {
                font-size: 36rpx;
            }
        }
        .picker-content {
            position: relative;
            background: #fff;
            height: 980rpx;
            padding: 32rpx 24rpx 0;
            box-sizing: border-box;
            border-radius: 20rpx 20rpx 0 0;
            .picker-goods {
                background-color: #fff;
                margin-bottom: 32rpx;
                .picker-goods-img {
                    width: 180rpx;
                    height: 180rpx;
                    margin-right: 24rpx;
                    border: 1px solid $uni-border-color;
                    box-sizing: border-box;
                    border-radius: 8rpx;
                }
                .picker-price {
                    font-size: 28rpx;
                    line-height: 40rpx;
                    align-items: center;

                    .fs-18 {
                        margin-left: px2rpx(-4);
                        font-size: 36rpx;
                        line-height: 50rpx;
                    }

                    .price {
                        color:#FF3C29;
                    }

                    .ml-0 {
                        margin-left: 0;
                    }
                    .del-price {
                        margin-left: 16rpx;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        .level {
                            line-height: px2rpx(8);
                            font-size: px2rpx(8);
                            //padding: px2rpx(4) px2rpx(4) px2rpx(4) 0;
                            border-radius: px2rpx(10);
                            background: #31312D;
                            color: #F2DCAC;
                            overflow: hidden;
                            margin-bottom: px2rpx(2);
                            vertical-align: middle;
                            display: flex;
                            align-items: center;
                            .icon-m-huangguan {
                                height: px2rpx(18);
                                line-height: px2rpx(18);
                                text-align: center;
                                padding-left: px2rpx(4);
                            }
                            .level-name {
                                font-size: px2rpx(10);
                                padding: px2rpx(1) px2rpx(8) px2rpx(1) 0;
                                line-height: px2rpx(14);
                            }
                        }

                    }
                    .final-price {
                        margin-left: px2rpx(5);
                        padding: 0 px2rpx(12);
                        line-height: px2rpx(20);
                        background-color: $uni-color-primary;
                        color: #fff;
                        font-size: px2rpx(14);
                        border-radius: px2rpx(15);
                    }

                }

                .money {
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: 500;
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    text-decoration-line: line-through;
                    color: $uni-text-color-grey;
                }
                .picker-stock {
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: $uni-text-color-grey;
                }
                .picker-choose-text {
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: $uni-text-color;
                    text {
                        margin-right: 10rpx;
                        &:first-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        .opt-item {
            &.van-hairline--bottom::after {
                border-bottom-color: $uni-border-color;
                border-style: solid;
            }
        }
        .picker-options {
            height: 624rpx;
            // overflow: auto;
            overflow-y: scroll;

            /deep/ .uni-scroll-view {
                &::-webkit-scrollbar {
                    height: 0;
                    width: 0;
                }
            }
            .spec-title {
                padding-top: 32rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                color: $uni-text-color;

                &.first {
                    padding-top: 0;
                }
            }
            .items {
                flex-wrap: wrap;
                padding: 16rpx 0 16rpx;
                .specs-item {
                    width: fit-content;
                    margin-right: 24rpx;
                    margin-bottom: 16rpx;
                    padding: 10rpx 24rpx;
                    font-size: 12px;
                    line-height: 17px;
                    color: $uni-text-color;
                    border: 1px solid $uni-border-color;
                    background-color: #fff;
                    box-sizing: border-box;
                    border-radius: 30rpx;
                    min-width: 96rpx;
                    text-align: center;
                }

                .specs-item.disabled {
                    border: 1px dashed $uni-border-color;
                    color: $uni-text-color-disable;
                }
            }
            // 表单样式
            /deep/ .goods-diy-form-items {
                margin-top: -48rpx;
                .form-item {
                    margin-left: 0;
                    .form-templates {
                        padding-left: 0;
                        padding-right: 0;
                    }
                }
            }
        }


        .picker-number {
            margin-bottom: 48rpx;
            overflow: hidden;
            &.padTop-16 {
                padding-top: 16px;
            }
            .title {
                font-size: 28rpx;
                line-height: 40rpx;
                color: $uni-text-color;
            }
            .uni-color-primary {
                font-size: 24rpx;
            }
            .add-num {
                display: flex;
                align-items: center;
                margin: px2rpx(5) px2rpx(8);
                .goods-total {
                    display: inline-block;
                    width: px2rpx(36);
                    height: px2rpx(18);
                    line-height: px2rpx(18);
                    background: $uni-bg-color-grey;
                    border-radius: px2rpx(2);
                    color: #212121;
                    font-size: px2rpx(12);
                    text-align: center;
                }

                .action-icon {
                    display: block;
                    box-sizing: content-box;
                    padding: px2rpx(6);
                    font-size: px2rpx(12);
                    font-weight: bold;
                    position: relative;
                    &.disabled {
                        color: #969696;
                    }

                    &.left {
                        /*padding: px2rpx(16) 8rpx px2rpx(16) 38rpx;*/
                        &:after{
                            content: '';
                            position: absolute;
                            width: px2rpx(32);
                            height: px2rpx(32);
                            left: -16rpx;
                            top: -8rpx;
                        }
                    }

                    &.right {
                        /*padding-left: 8rpx;*/
                        &:after {
                            content: '';
                            position: absolute;
                            width: px2rpx(32);
                            height: px2rpx(32);
                            right: -16rpx;
                            top: -8rpx;
                        }
                    }
                }
            }
        }
        .btn-box {
            padding: 16rpx 0 ;
            height: 112rpx;
            .btn {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                color: #fff;
                text-align: center;
                font-size: 28rpx;
                &:first-child {
                    border-top-left-radius:40rpx;
                    border-bottom-left-radius:40rpx;
                }
                &:last-child {
                    border-top-right-radius:40rpx;
                    border-bottom-right-radius:40rpx;
                }
            }
            .btn-buy,.btn-sure {
                background: linear-gradient(to right, $uni-color-primary, #FF6F29);
                // border-radius: 40rpx;
            }
            .disabled {
                background: #ccc !important;
            }
            .btn-cart {
                background: $uni-text-color;
                // border-radius: 40rpx 0 0 40rpx;
            }
        }
        .line {
            height: 1px;
            background-color: $uni-border-color;
        }
    }
</style>
