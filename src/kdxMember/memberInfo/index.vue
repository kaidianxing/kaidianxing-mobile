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
        <div class='member-info'>
            <p class="label">基本资料</p>
            <simple-picker :canIUse="canIUse" :info='memberInfo.basicInfo' @click='clickItem'></simple-picker>
            <p class="label">绑定手机</p>
            <simple-picker :info='memberInfo.bindMobile' @click='clickItem'></simple-picker>
            <p class="label">其他资料</p>
            <simple-picker :info='getOthers' @click='clickItem' @change='changeBirthday'>
            </simple-picker>
            <city-picker ref='areaPicker' :curTab='curTab' :addressList='addressList' @change='onValuesChange'></city-picker>
        </div>
    </page-box>
</template>

<script>
    import SimplePicker from '../components/SimplePicker'
    import CityPicker from '@/components/picker/OverseasPicker/Index.vue'
    import {
        mapState,
        mapActions,
        mapGetters,
        mapMutations
    } from 'vuex'
    import PageMixin from '@/common/PageMixin.js'
    export default {
        mixins: [PageMixin],
        components: {
            SimplePicker,
            CityPicker,
        },
        data() {
            return {
                curTab: 0,
                addressData: {},
                showCity: [],
                chooseAddress: '',
                addressList: [],
                canIUse: false,
            }
        },
        // #ifdef MP-WEIXIN
        created(){
            // 当前基础库版本
            const sdkVersion  = uni.getSystemInfoSync().SDKVersion
            // 支持最低基础库版本
            const apiMinVersion = '2.21.2';
            this.canIUse = this.$utils.compareVersion(sdkVersion, apiMinVersion)> -1
            console.error(this.canIUse,'898989+++',sdkVersion,apiMinVersion);
        },
        // #endif

        computed: {
            ...mapState('member', {
                memberInfo: state => state.memberInfo,
            }),
            ...mapGetters('form', ['form']),
            getOthers() {
                let tmp = [...this.memberInfo.otherInfo.map(item => ({ ...item
                }))];
                tmp[0].mode = 'date';
                return tmp
            },
            isIphoneX() {
                // 获取iphonex底部安全区域
                return this.$store.state.areaBottom + 'px'
            }
        },
        methods: {
            ...mapActions('member', ['changeUserInfo', 'getBasicInfo']),
            ...mapMutations('login', ['setModal']),
            // 地址三级联动picker改变
            onValuesChange(values) {
                let val = values.map(item => {
                    item.code = item.code_id;
                    return item;
                });
                this.showCity = val;
                this.chooseAddress = val.map(item => item.name).join(' ');
                this.memberInfo.otherInfo[1].content = this.chooseAddress;
                this.$refs.areaPicker.togglePicker();
                this.changeUserInfo()
            },
            changeBirthday(val) {
                this.memberInfo.otherInfo[0].content = val.detail.value;
                this.changeUserInfo()
            },
            clickItem(val) {
                let that = this;
               if(val.event){
                   this[val.event].call(this)
               } else if (val.path) {
                    this.$Router.auto({
                        path: val.path,
                        query: val.query || {}
                    })
                } else if (val.id == 'changeAvart') {
                    if(!this.canIUse) {
                        uni.chooseImage({
                            count: 1, //默认9
                            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                            sourceType: ['album'], //从相册选择
                            success(res) {
                                that.$api.orderApi.uploadFile(res.tempFilePaths[0]).then(res => {
                                    if (res.error == 0) {
                                        that.memberInfo.basicInfo[0].img =that.$utils.mediaUrl(res.path);
                                    }
                                    that.changeUserInfo()
                                });
                            }
                        });
                    }
                   // #ifdef MP-WEIXIN
                    if(this.canIUse) {
                        that.memberInfo.basicInfo[0].img = that.$utils.mediaUrl(val.img);
                        that.changeUserInfo()
                    }
                   // #endif
                } else if (val.id == 'changeCity') {
                    // 打开地址picker
                    this.$refs.areaPicker.togglePicker();
                }
            },
            clickMobile(){
                if(!this.memberInfo.mobile) {
                    // #ifdef MP-WEIXIN
                    this.$store.commit('login/setPhoneSub', {name: 'updateMobile',fun:()=> {
                        this.$store.dispatch('member/getBasicInfo')
                    }})
                    this.setModal(true)
                    // #endif

                    // #ifndef MP-WEIXIN
                    this.$Router.auto('/kdxMember/bindTel/mobile')
                    // #endif
                } else {
                    this.$Router.auto('/kdxMember/bindTel/change')
                }

            },
            clickPass(){
                if(!this.memberInfo?.user?.mobile) {
                    return this.$toast('请先绑定手机号')
                }

                this.$Router.auto({
                    path: '/kdxMember/password/index',
                    query: {
                        type: this.memberInfo?.user?.has_password || '0'
                    }
                })
            },
            changeForm(data) {
                this.$store.commit('form/setFormContent', data);
            }
        },
        onShow() {
            console.log('on-show')
            // 当不是自定义表单的选择图片返回时触发数据刷新
            if (!this.$store.state.form.isChooseImage) {
                this.$store.commit('form/resetForm');
                this.getBasicInfo()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .member-info {
        .label {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            padding: px2rpx(16) 0 px2rpx(8) px2rpx(24);
            color: #969696;
        }
        .rr-btn {
            /*margin: 52rpx 0;*/
            background-color: $uni-color-primary;
        }
        .member-info-diy-form {
            padding: px2rpx(8) px2rpx(12);
            margin-bottom: px2rpx(52);
            /*margin: 0 px2rpx(12);*/
            .member-info-diy-form-items {
                /* #ifdef  H5 */
                border-radius: 12rpx;
                /* #endif */
                overflow: hidden;
                background-color: #ffffff;
                /* #ifdef  MP-WEIXIN */
               /deep/ .diyform-item {
                    border-radius: 12rpx;
                }
                /* #endif */
                /deep/ .form-item {
                    &:first-child {
                        /*border-top: 1rpx solid #E6E7EB;*/
                    }
                }
            }
            .save-btn {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                /*padding: 0 px2rpx(12);*/
                background-color: #FFFFFF;
                padding: px2rpx(6) px2rpx(12);
                border-top: 1px solid rgb(238, 238, 238);
                z-index: 1;
            }
        }
    }
</style>
