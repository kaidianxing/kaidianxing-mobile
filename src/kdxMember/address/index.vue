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
        <view class="member-address-add">
            <view class="container">
                <view class="rr-cell">
                    <view class="flex">
                        <view class="label">
                            <text>收货人</text>
                        </view>
                        <view class="flex1">
                            <input v-model="addressData.name" class="rr-input" type="text" placeholder="请输入姓名"
                                   placeholder-class="input-placeholder"/>
                        </view>
                    </view>
                </view>
                <view class="rr-cell">
                    <view class="flex bor-top">
                        <view class="label">
                            <text>联系电话</text>
                        </view>
                        <view class="flex1">
                            <input v-model="addressData.mobile" class="rr-input" type="text" placeholder="请输入联系电话"
                                   placeholder-class="input-placeholder"/>
                        </view>
                    </view>
                </view>
                <view class="rr-cell" @click="openPicker">
                    <view class="flex bor-top">
                        <view class="label">
                            <text>所在地区</text>
                        </view>
                        <view class="flex1 line-hide">
                            <view v-if="!chooseAddress" class="uni-text-color-grey">请选择所在地区</view>
                            <view v-else>{{chooseAddress}}</view>
                        </view>
                        <view class="more uni-text-color">
                            <img v-if="is_weixin || is_weixin =='wxapp'" :src="$utils.staticMediaUrl('member/location.png')" class="reward-icon" @click.stop="getLocation"/>
                            <i v-else class="iconfont-m- icon-m-right"></i>
                        </view>
                    </view>
                </view>
                <view class="rr-cell">
                    <view class="flex bor-top">
                        <view class="label">
                            <text>详细地址</text>
                        </view>
                        <view class="flex1">
                            <input v-model="addressData.address" class="rr-input" type="text" placeholder="请输入详细地址"
                                   placeholder-class="input-placeholder"/>
                        </view>
                    </view>
                </view>
            </view>
            <view class="container" v-if="showIntell">
                <view class="rr-cell">
                    <view class="flex bor-bottom">
                        <view class="label" >
                            <text>智能填写</text>
                        </view>
                    </view>
                </view>
                <view class="textBox">
                    <!-- #ifndef MP-WEIXIN -->
                    <textarea
                        placeholder="试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息"
                        placeholder-class="text-placeholder"
                        v-model="intellCont">
                </textarea>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN -->
                    <textarea
                        v-if="showText"
                        placeholder="试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息"
                        placeholder-class="text-placeholder"
                        v-model="intellCont"
                        @blur="onBlurText"
                        :focus="picFocusText"
                    >
                </textarea>
                    <view v-else class="showText" @click="showTextarea" :class="addressText== '试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息' ? 'color': ''">{{addressText}}</view>
                    <!-- #endif -->


            </view>
            <view class="intellBtn">
                <!-- #ifdef MP-WEIXIN -->
                <view class="clear" :class="intellCont == ''? 'theme-primary-color' : ''" @click="clearIntel">{{paste}}</view>
                <!-- #endif -->

                    <!-- #ifdef H5 -->
                    <view class="clear" @click="clearIntel">清除</view>
                    <!-- #endif -->

                <view class="parseAddress" :class="intellCont !='' ?'bck theme-primary-bgcolor': ''" @click="parseAddress">提交</view>
            </view>
        </view>
        <view class="container">
            <view class="rr-cell flex">
                <view class="flex radio-box" @click='changeType'>
                    <i class="icon-m-yes iconfont-m- theme-primary-color" v-if="addressData.is_default == 1"></i>
                    <i class="icon-m-no iconfont-m-" v-else></i>
                </view>
                <view class="uni-text-color" style="font-size: 24rpx;">默认地址</view>
            </view>
            </view>
            <view class="rr-btn submit-btn theme-primary-bgcolor" @click="submit">{{btnContent}}</view>
            <view v-if="id" class="no-invoice uni-text-color-grey flex" @click="showAddress=true">删除地址</view>
            <address-picker ref='areaPicker' :curTab='curTab' :addressList='addressList'
                            @change='onValuesChange'></address-picker>


            <rr-modal v-model="showAddress" title="确认删除该地址吗？" @handlerOK="deleteAddress" @handlerCancel="cancelAddress"></rr-modal>

        </view>
    </page-box>
</template>

<script>

    import addressPicker from '@/components/picker/OverseasPicker/Index.vue'
    import AddressParse from 'address-parse';
    import PageMixin from '@/common/PageMixin.js';
    import * as $utils from '@/common/util.js'

    export default {
        mixins: [PageMixin],
        name: "add",
        components: {
            addressPicker
        },
        props: {},
        data() {
            return {
                id: '',
                showAddress: false, // 删除地址弹窗
                showPicker: false,
                addressList: [],
                curTab: 0,
                chooseAddress: '', // 选中地址文案
                showCity: [], // 选中地址数据
                intellCont: '', // 智能识别内容
                paste: '粘贴',
                addressData: {
                    name: '',
                    mobile: '',
                    province: '',
                    city: '',
                    area: '',
                    is_default: 0,
                    address: '',
                    address_code: ''
                },
                picFocusText: false, //是否聚焦
                showText: false,  // 文本域隐藏
                addressText: '试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息',
                /*添加国外选项处理是否显示智能识别 -wyn*/
                showIntell: true,
                btnContent: '保存', //根据进入的路径判断显示 下单页进入 显示：保存地址并使用，收货地址进入 显示：保存
            }
        },
        watch: {
            /*添加国外选项处理 -wyn*/
            chooseAddress: {
                handler(value) {
                    if(value.indexOf('国外') > -1 ) {
                        this.showIntell = false
                    }else {
                        this.showIntell = true
                    }
                },
                immediate: true
            }
        },
        computed: {
            is_weixin() {
                return $utils.is_weixin()
            },
        },
        onShow() {
            if(this.$Route.query?.type === 'order') {
                this.btnContent = '保存地址并使用'
            }else {
                this.btnContent = '保存'
            }
        },
        created() {},
        mounted() {
            if (this.$Route.query.id) {
                this.id = this.$Route.query.id;
                uni.setNavigationBarTitle({
                    title: '编辑收货地址'
                });
                this.getData()
            } else {
                uni.setNavigationBarTitle({
                    title: '新建收货地址'
                });
            }
        },
        methods: {
            // 地址三级联动picker改变
            onValuesChange(values) {
                let val = values.map(item => {
                    item.code = item.code_id;
                    return item;
                });
                this.showCity = val;
                this.chooseAddress = val.map(item => item.name).join('');
                this.$refs.areaPicker.togglePicker();
            },
            openPicker() {
                // 打开地址picker
                this.$refs.areaPicker.togglePicker();
                /*添加国外选项处理tab选中 -wyn*/
                if(!this.showIntell) {
                    this.curTab = 1
                }
            },
            getData() {
                this.$api.memberApi.getAddress({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.addressData = res.data;
                        this.showCity = [
                            {name: res.data.province},
                            {name: res.data.city},
                            {
                                code: res.data.address_code,
                                name: res.data.area
                            }
                        ];
                        /*this.chooseAddress = this.showCity.map(item => item.name).join(' ')
                        this.addressList = this.showCity*/
                        /*添加国外选项处理 -wyn*/
                        this.chooseAddress = this.showCity.map(item => item.name).join(' ');
                        this.chooseAddress = this.chooseAddress.indexOf('国外')>-1 ? '国外' : this.chooseAddress;
                        this.addressList = this.chooseAddress.indexOf('国外')>-1 ? [] : this.showCity;
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            submit() {
                let obj = {
                    ...this.addressData
                };
                if (!obj.name) {
                    this.$toast('请添加收货人姓名');
                    return
                }
                if (!this.addressData.mobile) {
                    this.$toast('请填写联系电话');
                    return
                }
                if (!this.showCity.length) {
                    this.$toast('请选择地址');
                    return
                }
                // 适配国外
                if (this.showCity?.[0]?.code_id == "990000") {
                    obj.province = '国外';
                    obj.city = '';
                    obj.area = '';
                    obj.address_code = '990101'
                } else {
                    obj.province = this.showCity[0].name;
                    obj.city = this.showCity[1].name;
                    if (this.showCity[2]) {
                        obj.area = this.showCity[2].name;
                        obj.address_code = this.showCity[2].code
                    } else {
                        obj.area = 0;
                    }
                }
                if (!obj.address) {
                    uni.showToast({
                        title: '请添加详细地址',
                        icon: 'none'
                    });
                    return
                }
                this.save(obj)
            },
            save(data) {
                console.log(data,'data.........');
                this.$api.memberApi[data.id ? 'editAddress' : 'addAddress'](data).then(res => {
                    if (res.error == 0) {
                        this.$toast('保存成功');
                        /*优化UI2.0*/
                        this.id = res.id;
                        setTimeout(() => {
                            this.toList('save')
                        }, 1000)
                    } else {
                        this.$toast(res.message)
                    }
                });
            },
            cancelAddress() {
                this.showAddress = false
            },
            deleteAddress() {
                this.showAddress = false;
                this.$api.memberApi.deleteAddress({id: this.id}).then(res => {
                    if (res.error == 0) {
                        this.$toast('删除成功')
                        setTimeout(() => {
                            this.toList('del')
                        }, 1000)
                    } else {
                        this.$toast(res.message)
                    }
                })
            },
            changeType() {
                if (this.addressData.is_default) {
                    this.addressData.is_default = 0
                } else {
                    this.addressData.is_default = 1
                }
            },
            toList(type) {
                // this.$Router.back(0)

                // type 为了区别保存和删除
                if(this.$Route.query?.type === 'order' && type === 'save') {
                    //store中存储
                    this.$store.commit('orderCreate/setOrderCreateInfo', {address_id: this.id, changeAddress: true});
                    this.$Router.back(2)
                }else {
                    this.$Router.back(1)
                }
            },
            clearIntel() {
                //#ifdef MP-WEIXIN
                if (this.paste == '粘贴') {
                    uni.getClipboardData({
                        success: res => {
                            this.intellCont = res.data;
                            this.addressText = res.data;
                            this.paste = '清除';
                        }
                    });
                } else {
                    this.intellCont = '';
                    this.addressText = '试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息';
                    this.paste = '粘贴';
                }
                //#endif

                //#ifdef H5
                this.intellCont = '';
                //#endif
            },
            parseAddress() {
                /*判断解析的地址内容不为空*/
                if (this.intellCont != '') {
                    const result = AddressParse.parse(this.intellCont, true);
                    let areaCode = result[0].code,
                        pCode = areaCode.slice(0, 2) + '0000',
                        cCode = areaCode.slice(0, 4) + '00';
                    console.log('区编码', areaCode);
                    console.log('省编码：', pCode);
                    console.log('市编码：', cCode);
                    this.addressData = {
                        name: result[0].name || this.addressData.name,
                        mobile: result[0].mobile || this.addressData.mobile,
                        province: result[0].province || this.addressData.province,
                        city: result[0].city,
                        area: result[0].area,
                        address: result[0].details == ' ' ? this.addressData.address : result[0].details,
                        address_code: areaCode,
                        id: this.addressData?.id
                    };
                    this.showCity = [
                        {
                            code: pCode,
                            name: result[0].province
                        },
                        {
                            code: cCode,
                            name: result[0].city
                        },
                        {
                            code: areaCode,
                            name: result[0].area
                        }
                    ];
                    this.chooseAddress = this.showCity.map(item => item.name).join(' ');
                    this.addressList = this.showCity;
                } else {
                    this.$toast('请填写您的收货信息');
                }
            },
            // 文本域失焦事件
            onBlurText() {
                this.showText = false;
                this.picFocusText = false;
                if(this.intellCont == '') {
                    this.addressText = '试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息'
                }else{
                    this.addressText = this.intellCont;
                }
            },
            showTextarea() {
                this.showText = true;
                this.picFocusText = true;
                if(this.addressText == '试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息') {
                    this.intellCont = ''
                }else {
                    this.intellCont = this.addressText;
                }
            },
            getLocation(){
                uni.chooseLocation({
                    success:(res)=> {
                        this.intellCont = res.address;
                        this.parseAddress()
                        this.intellCont = ''
                    },
                    fail:()=>{
                        // 如果用uni.chooseLocation没有获取到地理位置，则需要获取当前的授权信息，判断是否有地理授权信息
                        uni.getSetting({
                            success: (res) => {
                                console.log(res,'getSetting>>>>>>');
                                var status = res.authSetting;
                                if(!status['scope.userLocation']){
                                    // 如果授权信息中没有地理位置的授权，则需要弹窗提示用户需要授权地理信息
                                    uni.showModal({
                                        title:"是否授权当前位置",
                                        content:"需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                                        success:(tip)=>{
                                            if(tip.confirm){
                                                // 如果用户同意授权地理信息，则打开授权设置页面，判断用户的操作
                                                uni.openSetting({
                                                    success:(data)=>{
                                                        // 如果用户授权了地理信息在，则提示授权成功
                                                        if(data.authSetting['scope.userLocation']===true){
                                                            uni.showToast({
                                                                title:"授权成功",
                                                                icon:"success",
                                                                duration:1000
                                                            })
                                                            // 授权成功后，然后再次chooseLocation获取信息
                                                            uni.chooseLocation({
                                                                success: (res) => {
                                                                    console.log("详细地址",res);
                                                                    // this.getRegionFn(res);
                                                                }
                                                            })
                                                        }else{
                                                            uni.showToast({
                                                                title:"授权失败",
                                                                icon:"none",
                                                                duration:1000
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            },
                            fail: (res) => {
                                uni.showToast({
                                    title:"调用授权窗口失败",
                                    icon:"none",
                                    duration:1000
                                })
                            }
                        })
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    .member-address-add {
        height: 100%;
        padding: 16rpx 24rpx;
        background-color: $uni-bg-color-grey;
        box-sizing: border-box;
        .container {
            background-color: #fff;
            border-radius: 12rpx;
            margin-bottom: 16rpx;
            overflow: hidden;
            .rr-cell {
                height: 96rpx;
                line-height: 96rpx;
                font-size: 28rpx;
                .label {
                    text {
                        font-size: 28rpx;
                        color: $uni-text-color;
                    }
                }
                .more {
                    color: $uni-text-color-grey;
                    display: flex;
                    align-items: center;
                    img {
                        width: 48rpx;
                        height: 48rpx;
                    }
                }
                .radio text {
                    margin-left: 22rpx;
                }
                .rr-input {
                    font-size: 28rpx;
                }
            }
            .textBox{
                padding: 16rpx 24rpx;
                width: 100%;
                height: 160rpx;
                textarea {
                    padding: 24rpx;
                    width: 100%;
                    height: 100%;
                    background: #F5F5F5;
                    border-radius: 6px;
                    box-sizing: border-box;
                    font-size: 24rpx;
                    line-height: 34rpx;
                    color: $uni-text-color;
                }
                .showText {
                    padding: 24rpx;
                    width: 100%;
                    height: 100%;
                    background: #F5F5F5;
                    border-radius: 6px;
                    box-sizing: border-box;
                    font-size: 24rpx;
                    line-height: 30rpx;
                    color: $uni-text-color;
                    &.color {
                        color: #969696;
                    }
                }
                /deep/ .text-placeholder {
                    font-size: 24rpx;
                    color: $uni-text-color-grey;
                }
            }
            .intellBtn {
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                padding: 0 24rpx 0;
                width: 100%;
                box-sizing: border-box;
                height: 42rpx;
                line-height: 42rpx;
                margin-bottom: 24rpx;
                .clear {
                    color: #969696;
                    font-size: 24rpx;
                    align-self: center;
                    &.color {
                        color: #FF3C29;
                    }
                }
                .parseAddress {
                    flex: none;
                    order: 1;
                    align-self: center;
                    color: #fff;
                    width: 80rpx;
                    height: 42rpx;
                    line-height: 42rpx;
                    font-size: 24rpx;
                    text-align: center;
                    background: #ccc;
                    border-radius: 50rpx;
                    margin-left: 24rpx;
                    &.bck{
                        background: #FF3C29;
                    }
                }
            }
        }
        .radio-box {
            padding-right: 24rpx;
            align-items: center;
            .iconfont-m- {
                font-size: px2rpx(24);
                color: $uni-border-color;
            }
            .icon-m-yes {
                font-size: px2rpx(24);
                line-height: px2rpx(24);
                text-align: center;
                border-radius: 50%;
                color: $uni-color-primary;
            }
        }
        .submit-btn {
            margin-top: 32rpx;
            background: linear-gradient(to right, $uni-color-primary, #FF6F29);
        }
        .no-invoice {
            justify-content: center;
            font-size: 24rpx;
            line-height: 68rpx;
        }
    }
</style>
