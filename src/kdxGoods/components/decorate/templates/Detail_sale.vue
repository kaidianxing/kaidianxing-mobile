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
    <div
        class="detail_sale"
        :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}"
        v-if='isShowSale'
    >
        <div style="overflow: hidden" :style="{'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`}">
       <div>
           <!--多人拼团-->
           <detail-sale-group
               v-if="componentData.params.activityName =='groups' && getGroupsTeam.length"
               :info="componentData.params.activityData"
               :team="getGroupsTeam"
               @click-all="clickGroups"
               @click-detail="clickGroupsItem"
               @special-click="clickBuyItem"></detail-sale-group>
       </div>
        <ul
            class="container"
            :style="{'border-radius':`${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,background:componentData.style.background,color:componentData.style.textcolor}"
        >
            <li class="item van-hairline--bottom" v-for="item in getList" :key="item.type">
                <div
                    class="label"
                    :style="{
                            color: componentData.style.titlecolor
                        }"
                >{{item.label}}</div>
                <div class="body" :class="{'body-coupon': item.type =='coupon'}">
                    <!-- 优惠券 -->
                    <ul v-if="item.type=='coupon'" class="coupons" @click="clickItem('coupon')">
                        <li
                            class="coupon"
                            v-for="(val,key) in item.items"
                            :key="key"
                            :style="{background:componentData.style.couponBackground,borderColor:componentData.style.couponBackground}"
                        >
                            {{val.content}}
                            <i
                                class="after"
                                :style="{borderColor:componentData.style.couponBackground}"
                            ></i>
                        </li>
                    </ul>
                    <!-- 服务 -->
                    <ul
                        v-else-if="item.type=='biaoqian'"
                        class="biaoqians"
                        @click="clickItem('biaoqian')"
                    >
                        <li v-for="(val,key) in severList" :key="key" class="biaoqian">
                            <p class="word" :class="getLabelStyle?'':'bg-color'" :style="{backgroundColor:getLabelStyle?componentData.style.background:componentData.style.servercolor, color: componentData.style.textcolor}">
                                <i
                                    :class="getLabelStyle"
                                    :style="{ color: componentData.style.servercolor}"
                                ></i>
                                <span
                                    :style="{ color: componentData.style.serverTextColor}"
                                >{{val.name}}</span>
                            </p>
                        </li>
                    </ul>
                    <!-- 发货 -->
                    <div class="common" v-else-if="item.type =='bupeisong'" >
                        <p class="words" :style="{ color: componentData.style.textcolor }">{{componentData.params.hidedispatch != 0 ? item.content.value : "待下单时查看"}}</p>
                        <p v-if="item.showIcon" style="color: #969696; font-size: 24rpx;" @click="clickItem('bupeisong')">查看发货区域</p>
                    </div>
                    <view class="samecity" v-else-if="item.type == 'samecity' " @click="clickItem('samecity')">
                        <view class="words line-hide" :style="{ color: componentData.style.textcolor }">{{item.content.value}}</view>
                    </view>
                    <!-- 活动 -->
                    <ul
                        v-else-if="item.type=='active'"
                        class="actives"
                        @click="clickItem('active')"
                    >
                        <li v-for="(val,key) in activeList" :key="key" class="active">
                            <p
                                v-if="val"
                                class="icon-word"
                                :style="{color:componentData.style.activeTagColor,borderColor:componentData.style.activeTagColor,color: componentData.style.activeTagColor}"
                            >
                                <span v-if="val.type=='score'">{{credit_text}}</span>
                                <span v-else-if="val.type=='balance'">{{balance_text}}</span>
                                <span v-else>{{val.name}}</span>

                            </p>
                            <!-- 满减 -->
                            <div v-if="val.type=='full'" class="demon">
                                全场满
                                <i :style="{color: componentData.style.numcolor}">￥{{val.enough}}</i>
                                立减
                                <i
                                    :style="{color: componentData.style.numcolor}"
                                    >￥{{val.deduct}}</i>
                            </div>
                            <!-- 包邮 -->
                            <div v-if="val.type=='freeExpress'" class="demon">
                                <p v-if="val.classify== 'full_free_dispatch'" class="demon-text">
                                    全场满
                                    <i
                                        :style="{color: componentData.style.numcolor}"
                                    >￥{{val.value}}</i>包邮
                                </p>
                                <p v-if="val.classify== 'single_full_unit_num'" class="demon-text">
                                    单商品满
                                    <i
                                        :style="{color: componentData.style.numcolor}"
                                    >{{val.value}}件</i>包邮
                                </p>
                                <p v-if="val.classify== 'single_full_quota_price'" class="demon-text">
                                    单商品满
                                    <i
                                        :style="{color: componentData.style.numcolor}"
                                    >￥{{val.value}}</i>包邮
                                </p>
                                <p v-if="val.classify== 'all_dispatch'">该商品支持全国包邮</p>
                            </div>
                            <!-- 积分 -->
                            <p v-if="val.type=='score' &&val.deduction_type!='0'" class="demon">
                                <span v-if="val.deduction_type=='1'">支持{{credit_text}}抵扣</span>
                                <span v-if="val.deduction_type=='2'">
                                    支持{{credit_text}}抵扣
                                    <i
                                        :style="{color: componentData.style.numcolor}"
                                    >{{val.deduction_price}}</i>元
                                </span>
                            </p>

                            <p v-if="val.type=='balance'" class="demon">
                                <span v-if="val.deduction_type=='1'">支持{{balance_text}}抵扣</span>
                                <span v-if="val.deduction_type=='2'">
                                    支持{{balance_text}}抵扣
                                    <i
                                        :style="{color: componentData.style.numcolor}"
                                    >{{val.deduction_price}}</i>元
                                </span>
                            </p>
                            <!-- 复购 -->
                            <!-- <p v-else-if='val.type=="again"' class='demon'>此商品重复购买可享受<i>{{val.discount}}</i>折优惠</p> -->
                            <!-- 全返 -->
                            <!-- <p v-else-if='val.type=="fullback"' class='demon'>此商品享受<i>￥{{val.discount}}</i>的全返</p> -->
                        </li>
                    </ul>
                    <!-- 会员 -->
                    <!-- <div class='vip common' v-else-if='item.type=="huiyuan"'>
                                <p class="icon-word">VIP</p>
                                <p class="words">
                                    可享受<i>￥{{item.content.discount}}</i>的价格
                                </p>
                    </div>-->
                    <!-- 其他 -->
                    <div
                        class="common"
                        v-else-if="item.type =='bupeisong'"
                        @click="clickItem('bupeisong')"
                    >
                        <p class="icon-word" v-if="item.content.iconword">{{item.content.iconword}}</p>
                        <p class="words">{{item.content.value}}</p>
                    </div>
                    <!-- <div class='common' v-else>
                                <p class="icon-word" v-if='item.content.iconword'>{{item.content.iconword}}</p>
                                <p class="words">
                                    {{item.content.value}}
                                </p>
                    </div>-->
                </div>
                <i class="iconfont-m- icon-m-right" :style="{
                    color: componentData.style.titlecolor
                }" v-if="(item.items && item.items.length) || item.chooseAdr"></i>
            </li>
        </ul>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import DetailSaleGroup from './Detail_sale__group'

    export default {
        mixins: [mixin],
        name: 'detail_sale',
        components:{
            DetailSaleGroup
        },
        data() {
            return {
                balance_text: '余额',
                credit_text: '积分',
                activeList: [],
                severList: []
            }
        },
        computed: {
            isShowSale() {
                return this.componentData && this.componentData.id=="detail_sale"
                    && ( this.getList.length ||
                        ((this.componentData.params.activityName =="groups" )&& this.getGroupsTeam.length))
                    && (this.componentData.params.isBargain || !this. componentData.params.buy_button_status)
                    && this.componentData.params.goods.type != 6
            },
            getLabelStyle() {
                if (this.componentData.params.label_style == '0') {
                    return ''
                } else if (this.componentData.params.label_style == 1) {
                    return 'icon-m-dian iconfont-m-'
                }
                return 'icon-m-yes1 iconfont-m-'
            },
            // 获取可参团列表
            getGroupsTeam(){
                if(this.$isPC){
                    return []
                }
                return this.componentData?.params?.activityData?.team || []
            },
            getList() {
                let row = {
                    yushou: false,
                    erci: false,
                    huiyuan: true,
                    youhui: false, //
                    jifen: false, //
                    bupeisong: true, //
                    biaoqian: true, //
                    coupon: true, //
                    zengpin: false, //
                    fullback: false, //
                    active: true,
                    samecity: true,
                    verify: true,
                }
                if (this.componentData ?.data) {
                    return this.componentData.data.filter(item => {
                        return row[item.type]
                    }).filter(item => (item.label && ((item.items && item.items.length) || item.content)))
                } else {
                    return []
                }
            },
        },
        watch: {
            getList: {
                handler(list) {
                    let activeList =[],severList = [];
                    list.forEach(item=>{
                        if(item.type == 'active') {
                            activeList = item.items
                        } else if(item.type =='biaoqian') {
                            severList = item.items
                        }
                    })

                    this.activeList = this.dealData(activeList)
                    this.severList = severList.slice(0,3)
                },
                immediate: true
            }
        },
        methods: {
            clickItem(type) {
                this.$emit('custom-event', {
                    target: 'detail_sale/clickItem',
                    data: {
                        type,
                        data: this.componentData
                    }
                })
            },
            clickBuyItem(data){
                this.$emit('custom-event', {
                    target: 'detail_navbar/clickItem',
                    data: data
                })
            },
            // 点击拼团订单列表
            clickGroupsItem(item){
                this.$emit('custom-event', {
                    target: 'detail_sale/clickGroupsItem',
                    data: {
                        data: this.componentData,
                        item
                    }
                })
            },
            // 查看拼团列表
            clickGroups() {
                this.$emit('custom-event', {
                    target: 'detail_sale/clickGroups',
                    data: {
                        info: this.componentData.params.activityData
                    }
                })
            },
            // 显示活动中第一条类型的数据
            dealData(lists) {
                if (!this.$isPC) {
                    let obj = {}

                    let items = lists.filter(list => {
                        if (!obj[list.type]) {
                            obj[list.type] = true
                            return list
                        }
                    })
                    return items
                } else {
                    return lists
                }
            },
            sliceList(list){
                if(list){
                    return list.slice(0,3)
                } else {
                    return []
                }
            },
            is_active(item) {
                let price_actives = ['seckill','preheat_activity'];
                return item && price_actives.some(key=> item[key]);
            },
        },
        filters: {
            priceUnit(data) {
                let distance = data || 0;
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
        },
        beforeMount() {
            if (!this.$isPC) {
                this.balance_text = this.$store.state.setting.systemSetting?.balance_text
                this.credit_text = this.$store.state.setting.systemSetting?.credit_text
            }
        },

    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .detail_sale {
        width: 100%;
        .container {
            width: 100%;
            box-sizing: border-box;
            padding-left:px2rpx(12);
            .item {
                display: flex;
                flex-wrap: nowrap;
                padding-right:px2rpx(12);
                &.van-hairline--bottom:after {
                    border-bottom-color: $uni-border-color;
                    border-style: solid;
                }
            }
            .item:last-child {
                &.van-hairline--bottom:after {
                    border-width: 0;
                }
            }
            .label {
                box-sizing: border-box;
                font-size: px2rpx(12);
                min-width: px2rpx(48);
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: px2rpx(40);
                color: $uni-text-color-grey;
            }
            .body {
                width: 0;
                flex: 1;
                font-size: px2rpx(12);
                line-height: rpx(46);
                display: flex;
                flex-direction: column;

                &.body-coupon {
                    height: px2rpx(40);
                    overflow: hidden;
                }
                .coupons {
                    display: flex;
                    flex-wrap: wrap;
                    .coupon {
                        height: px2rpx(18);
                        line-height: px2rpx(18);
                        margin: px2rpx(11) px2rpx(11) px2rpx(11) 0;
                        display: flex;
                        flex-direction: column;
                        font-size: px2rpx(10);
                        color: #fff;
                        text-align: center;
                        padding: 0 px2rpx(8);
                        background: red;
                        position: relative;
                        border-top-left-radius: px2rpx(2);
                        border-bottom-left-radius: px2rpx(2);
                        .after {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            width: 0;
                        }
                        .after {
                            border-left: rpx(2) dotted red;
                            right: rpx(-2);
                        }
                    }
                }
                .biaoqians {
                    display: flex;
                    flex-wrap: wrap;
                    .biaoqian {
                        height: px2rpx(40);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        font-size: px2rpx(12);
                        font-weight: 500;
                        margin-right: px2rpx(12);
                        .word {
                            display: flex;
                            flex-wrap: nowrap;
                            position: relative;
                            font-size: px2rpx(12);
                            .icon-m-yes1 {
                                margin-right: px2rpx(4);
                                font-size: px2rpx(14);
                            }

                            .icon-m-dian {
                                margin-right: px2rpx(4);
                                font-size: px2rpx(14);
                            }

                            &.bg-color {
                                height: px2rpx(19);
                                line-height: px2rpx(12);
                                padding: px2rpx(4) px2rpx(8);
                                border-radius: px2rpx(19);
                                overflow: hidden;
                                .bg {
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    bottom: 0;
                                    right: 0;
                                }
                            }
                        }
                    }
                }
                .actives {
                    padding: px2rpx(7) 0;
                    .active {
                        display: flex;
                        flex-wrap: nowrap;
                        i {
                            font-style: normal;
                        }
                        .demon,.demon-text {
                            line-height: px2rpx(12);
                            font-size: px2rpx(12);
                            margin: px2rpx(4) 0;
                            color: #212121;

                            i {
                                line-height: px2rpx(12);
                                font-size: px2rpx(12);
                            }
                        }

                    }
                }
                .common {
                    display: flex;
                    line-height: px2rpx(12);
                    font-size: px2rpx(12);
                    margin: auto 0;
                    i {
                        font-style: normal;
                    }
                    .words {
                        flex: 1;
                        margin: auto 0;
                        padding: px2rpx(3) 0;
                        font-weight: 500;
                        font-size: px2rpx(12);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                }
                .words {
                    flex: 1;
                    margin: auto 0;
                    font-weight: normal;
                    font-size: px2rpx(12);
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .samecity {
                    color:#212121;
                    align-items: center;
                    font-size: px2rpx(12);
                    height: px2rpx(44);
                    line-height: px2rpx(44);
                    padding-left: px2rpx(10);
                }

                .icon-word {
                    font-size: px2rpx(10);
                    height: px2rpx(16);
                    line-height: px2rpx(10);
                    display: flex;
                    flex-shrink: 0;
                    flex-direction: column;
                    justify-content: center;
                    border: px2rpx(0.5) solid $uni-color-primary;
                    color: $uni-color-primary;
                    border-radius: px2rpx(8);
                    padding: px2rpx(3) px2rpx(8);
                    margin: px2rpx(4) px2rpx(8) px2rpx(4) 0;
                }
            }
            .icon-m-right {
                position: relative;
                flex-shrink: 0;
                line-height: px2rpx(16);
                height: px2rpx(16);
                margin: auto 0 auto px2rpx(1);
                font-size: px2rpx(16);
                color: $uni-text-color-grey;
            }
        }
    }
</style>
