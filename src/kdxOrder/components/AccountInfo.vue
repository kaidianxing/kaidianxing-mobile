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
        <!-- 卡密商品支付完成 -->
        <div v-if="orderData.status == '30' && orderGoods && orderGoods[0].type == '2'">
            <div class="account-info" v-for="(item,index) in virtual" :key="index">
                <cell classPayIconName="icon-m-kamixinxi  theme-primary-bgcolor" classRightIconName="" cellBtnClass="theme-primary-bgcolor" :classNames="['myColor']" :tith="`卡密信息${index+1}`" buttonContent="一键复制" @item-button-click="clickCopy(item,index)" />
                <div class="account-cont" v-if="item.config.length>0">
                    <div class="item-title">账号信息</div>
                    <div class="content" v-for="(val, i) in item.config" :key="i">
                        <div class="contLi" :class="{'flex-column': item.is_wrap}">
                            <span class="liTit">{{val.key}}：</span>
                            <span class="liCont" @click="toAccountLink(val.type,item,i)">{{item.data[`value${i+1}`]}}</span>
                        </div>
                        <div class="textBtn flex-end theme-primary-color"  :class="{'is_active':val.ischeck}" @click="copyLink(item.data,index,i)">复制</div>
                    </div>
                    <div class="item-title" v-if="item.use_address == 1">{{item.use_address_title}}</div>
                    <div class="content" v-if="item.use_address == 1">
                        <div class="contLi">
                            <span class="liLink" @click="toAccountLink('-1',item.use_address_address,'-1')">{{item.use_address_address}}</span>
                        </div>
                        <div class="textBtn flex-end  theme-primary-color" :class="{'is_active':item.ischeck}" @click="copyLink(item.use_address_address,index,'-1')">复制</div>
                    </div>
                    <div class="item-title" v-if="item.use_description == 1">{{item.use_description_title}}</div>
                    <div class="content" v-if="item.use_description == 1">
                        <span class="liTit">{{item.use_description_remark}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 卡密商品待付款和付款完成 显示接收地址 -->
        <div class="account-info" v-if="(orderData.status == '30' || orderData.status == '0') && orderGoods[0].type == '2' && orderData.virtual_account_mailer_setting == '1'">
            <div class="email flex-between">
                <span>接收邮箱地址</span>
                <span>{{orderData.to_mailer || '-'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AccountInfo",
        props: {
            orderData: {
                type: Object,
                default: () => {}
            },
            orderGoods: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                virtual: []
            }
        },
        computed: {
            is_wrap() {
                return false
            }
        },
        watch: {
            orderData: {
                handler(e){
                    if(e&&e.virtual_account_data) {
                        this.isCheck()
                    }
                },
                immediate: true
            }
        },
        methods: {
            // 补充复制后颜色变浅
            isCheck() {
                this.virtual = this.orderData?.virtual_account_data || [];
                if(this.virtual.length>0) {
                    this.virtual.forEach((item) => {
                        this.$set(item,'ischeck', false)
                        let config = JSON.parse(item.config), data = JSON.parse(item.data)
                        if(config.length>0) {
                            config.forEach((secItem,index)=> {
                                this.$set(secItem,'ischeck', false)
                                if(data[`value${index+1}`].length> 28) {
                                    this.$set(item,'is_wrap',true)
                                }
                            })
                        }
                        item.config = config
                        item.data = data
                    })
                }

            },
            // 复制所有信息按钮
            clickCopy(item,index) {
                var data = ''
                item.config.forEach((dataItem,dataIndex) => {
                    data += dataItem.key + '：'+ item.data[`value${dataIndex+1}`] + '\n'
                })
                    if(item.use_address == '1') {
                        data += item.use_address_title + "：" + item.use_address_address + '\n'
                    }
                  if(item.use_description == '1') {
                      data +=  item.use_description_title + "：" + item.use_description_remark
                  }
                uni.setClipboardData({
                    data: data,
                    success: () => {
                        uni.showToast({
                            title: '复制成功',
                        })
                        setTimeout(()=>{
                            this.$emit('input', false)
                            this.showVideoModal = false
                        },300)
                    }
                })
            },
            /*
            * 单个复制按钮
            * index 属于第几个卡密
            * i 哪个字段复制
            * val 复制内容
            * */
            copyLink (val,index,i) {
                let value = '';
                if(i != '-1') {
                    value = val[`value${i+1}`]
                }else {
                    value = val
                }
                uni.setClipboardData({
                    data: value,
                    success: () => {
                        uni.showToast({
                            title: '复制成功',
                        })
                        setTimeout(()=>{
                            this.$emit('input', false)
                            this.showVideoModal = false
                        },300)
                    }
                })

                i == '-1' ? this.virtual[index].ischeck = true : this.virtual[index].config[i].ischeck = true
                setTimeout(()=>{
                    i == '-1' ? this.virtual[index].ischeck = false : this.virtual[index].config[i].ischeck = false
                },500)
            },
            // 点击跳转
            /*
            * type -1表示使用地址 1 表示账号信息超链接
            * */
            toAccountLink(type,url,i) {
                let path,realUrl = url.data[`value${i+1}`];
                // #ifdef H5
                if (realUrl.indexOf('http://') > -1 || realUrl.indexOf('https://') > -1) {
                    path = realUrl
                } else {
                    path = 'http://' + realUrl
                }
                if (type == '1' && i != '-1') {
                    window.location.href = path;
                } else if (type == '-1') {
                    window.location.href = path;
                }
                // #endif
            }
        }
    }
</script>

<style scoped lang="scss">
    .account-info {
        background: #fff;
        border-radius: px2rpx(6);
        margin-top: px2rpx(6);
       
        .account-item {
            padding-left: px2rpx(12);
            width: 100%;
            display: flex;
            position: relative;
            box-sizing: border-box;
            height: 48px;
            .container {
                display: flex;
                width: 100%;
                align-items: center;
                border-bottom: px2rpx(1) solid #eee;
                .main {
                    -webkit-box-flex: 1;
                    flex: 1;
                    .title {
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 24px;
                        display: flex;
                        align-items: center;
                        .custom-icon {
                            color: #fff;
                            font-size: 24px;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            line-height: 24px;
                            text-align: center;
                            margin: auto px2rpx(8) auto 0;
                            background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                        }
                    }
                }
                .btn {
                    /*height: 28px;*/
                    /*border-radius: 28px;*/
                    /*background: #FF3C29;*/
                    /*color: #fff;*/
                    /*font-size: 12px;*/
                    /*line-height: 28px;*/
                    /*text-align: center;*/
                    /*padding: 0 14px;*/
                    margin: auto px2rpx(12) auto 0;
                }
            }
        }
        .account-cont {
            padding: px2rpx(16) px2rpx(12);
            .item-title {
                font-weight: 900;
                font-size: 12px;
                line-height: 17px;
                color: #212121;
                margin-top: px2rpx(16);
                &:first-child {
                    margin-top: 0;
                }
            }
            .content {
                margin-top: px2rpx(8);
                display: flex;
                width: 100%;
                justify-content: space-between;
                .liTit {
                    color: #969696;
                    font-size: 12px;
                    line-height: 16px;
                }
                .contLi {
                    font-size: 12px;
                    line-height: 16px;
                    width: px2rpx(290);
                    word-wrap: break-word;
                    .liCont {
                        color: #212121;
                    }
                    .liLink {
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 17px;
                        color: #518DEF;
                    }
                }
                .textBtn {
                    margin-left: px2rpx(12);
                    font-size: 12px;
                    line-height: 16px;
                    color: #FF3C29;
                    align-items: flex-end;
                    &.is_active {
                        color: rgba(255,60,41,.5);
                    }
                }
            }
        }
        .email {
            padding: px2rpx(16) px2rpx(12);
            font-size: px2rpx(12);
            line-height: px2rpx(16);
            color: #212121;
        }
        /deep/ .myColor {
            .left-icon {
                color: #FF3C29;
            }
            .kdx-btn {
                background: #FF3C29;
            }
        }
    }
</style>