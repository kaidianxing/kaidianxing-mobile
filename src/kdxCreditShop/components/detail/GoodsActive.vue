<template>
    <div>
        <div
            v-for="(val,index) in info.items"
            :key="index"
        >
            <!--做满减/折活动时，单店和多商户分别在两期开发，所以进行了区分，到时候开发多商户时直接去掉判断就好-->
                <!-- 满减/折扣 -->
                <div class="active-list active-list-new full-reduce" v-if="val.type === 'fullReduce'"
                     @click="handlerFullReduce(val)">
                    <div class="label">
                        {{ val.name }}
                    </div>
                    <div class="content full-reduce-content line-hide">
                        <div class="activity-rules line-hide" v-if="val.data && val.data.rules">
                        <span v-for="(fullReduce, index) in val.data.rules" :key="index">
                            <span v-if="index>0">；</span>
                            <!--preferential_type= 1阶梯，0：循环-->
                           {{val.data.preferential_type == 1 ? '满': '每满'}}
                            <span class="number-color">{{ fullReduce.startUnit }}{{fullReduce.condition}}<span v-if="val.data.type==3||val.data.type==4">件</span></span>
                            {{fullReduce.middle}}
                            <span class="price">{{fullReduce.endUnit}}{{fullReduce.value}}</span>
                            {{fullReduce.end}}
                        </span>
                        </div>
                        <div class="activity-time line-hide" v-if="val.data">
                            {{ val.data.start_time }} ~ {{val.data.end_time}}
                        </div>
                    </div>
                    <i class="iconfont-m- icon-m-right"></i>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-liwu1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <!-- 满金额包邮 -->
                <div
                        v-if="val.classify== 'full_free_dispatch'"
                        class="active-list active-list-new"
                >
                    <div class="label">包邮</div>
                    <div class="content">
                        全场满
                        <i class="number-color">￥{{val.value}}</i>包邮
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-gouwuche1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <!-- 单品满件数 -->
                <div
                        v-if="val.classify== 'single_full_unit_num'"
                        class="active-list active-list-new"
                >
                    <div class="label">包邮</div>
                    <div class="content">
                        单商品满
                        <i class="number-color">{{val.value}}件</i>包邮
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-gouwuche1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <!-- 单品满金额 -->
                <div
                        v-if="val.classify== 'single_full_quota_price'"
                        class="active-list active-list-new"
                >
                    <div class="label">包邮</div>
                    <div class="content">
                        单商品满
                        <i class="number-color">￥{{val.value}}</i>包邮
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-gouwuche1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <!-- 全国包邮 -->
                <div
                        v-if="val.classify== 'all_dispatch'"
                        class="active-list active-list-new"
                >
                    <div class="label">包邮</div>
                    <div class="content">该商品支持全国包邮</div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-gouwuche1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>

                <!-- 满减 -->
                <div
                        v-if="val.type == 'full'"
                        class="active-list active-list-new"
                >
                    <div class="label">满减</div>
                    <div class="content">
                        全场满
                        <i class="number-color">￥{{val.enough}}</i>立减
                        <i class="number-color">￥{{val.deduct}}</i>
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-liwu1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>

                <div
                        v-if="val.type=='score' &&val.deduction_type!='0'"
                        class="active-list active-list-new"
                >
                    <div class="label">{{credit_text}}</div>
                    <div class="content">
                        <span v-if="val.deduction_type=='1'">支持{{credit_text}}抵扣</span>
                        <span v-if="val.deduction_type=='2'">
                        支持{{credit_text}}抵扣
                        <i class="number-color">{{val.deduction_price}}</i>元
                    </span>
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-jifen1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div
                        v-if="val.type =='balance'"
                        class="active-list active-list-new"
                >
                    <div class="label">{{balance_text}}</div>
                    <div class="content">
                        <span v-if="val.deduction_type=='1'">支持{{balance_text}}抵扣</span>
                        <span v-if="val.deduction_type=='2'">
                        支持{{balance_text}}抵扣
                        <i class="number-color">{{val.deduction_price}}</i>元
                    </span>
                    </div>
                    <!--底部图标-->
                    <div class="active-icon">
                        <i class="iconfont-def icon-def-jinqian1-1"></i>
                    </div>
                    <!--头部大圆-->
                    <div class="header-large-circle"></div>
                    <!--头部小圆-->
                    <div class="header-small-circle"></div>
                    <!--头部小圆-->
                    <ul class="broken">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            info: {
                type: Object,
                default: () => { }
            }
        },
        data() {
            return {
                balance_text: '余额',
                credit_text: '积分',
            }
        },
        beforeMount() {
            if (this.sessionStorage) {
                this.balance_text = this.$store.state.setting.systemSetting.balance_text
                this.credit_text = this.$store.state.setting.systemSetting.credit_text
            }
        },
        methods: {
            handlerFullReduce(item) {
                console.log('fujll-item', item)
                this.$Router.push({
                    path: '/kdxGoods/activity/fullReduce',
                    query: {
                        id: item.data?.id
                    }
                })
            }
        },
    }
</script>


<style lang="scss" scoped>
    .item {
        &:last-child {
            .active-list {
                margin-bottom: 48rpx;
            }
        }
    }
    .active-list {
        margin-bottom: 32rpx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .active-list-new {
        position: relative;
        margin-bottom: px2rpx(8);
        height: px2rpx(64);
        background-color: $uni-primary-background;
        border-radius: px2rpx(6);
        overflow: hidden;
    }

    .label-tag {
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
    .label {
        font-size: px2rpx(16);
        line-height: px2rpx(22);
        font-weight: bold;
        color: $uni-color-primary;
        text-align: center;
        width: px2rpx(76);
        padding: 0 px2rpx(21);
        flex-shrink: 0;
    }
    .content {
        padding-left: px2rpx(12);
        font-size: px2rpx(12);
    }
    .full-reduce {
        .icon-m-right {
            font-size: px2rpx(14);
            padding: 0 px2rpx(12);
            color: $uni-color-primary
        }
    }
    .full-reduce-content {
        flex: 1 ;
        .activity-rules {
            font-size: px2rpx(12);
            line-height: px2rpx(16);
            color: $color-w1;
            .price {
                color: $uni-color-primary;
            }
        }
        .activity-time {
            font-size: px2rpx(10);
            line-height: px2rpx(14);
            color: $uni-text-color-grey;
            padding-top: 2px;
        }
    }
    .active-icon {
        position: absolute;
        left: px2rpx(-4) ;
        bottom: px2rpx(-4);
        color: $uni-color-primary;
        opacity: 0.1;
        > i {
            font-size: px2rpx(30);
        }
    }
    .header-large-circle {
        position: absolute;
        top: px2rpx(8);
        left: px2rpx(60);
        width: px2rpx(8);
        height: px2rpx(8);
        border-radius: 100%;
        background-color: $uni-color-primary;
        opacity: 0.1;
    }
    .header-small-circle {
        position: absolute;
        top: px2rpx(16);
        left: px2rpx(55);
        width: px2rpx(4);
        height: px2rpx(4);
        background-color: $uni-color-primary;
        opacity: 0.1;
    }
    .broken {
        position: absolute;
        left: px2rpx(76);
        top: 0;
        width: px2rpx(1);
        li {
            background-color: #ffffff;
            height: px2rpx(2);
            width: px2rpx(1);
            margin-top: px2rpx(2);
        }
    }
    .number-color {
        color: $uni-color-primary;
    }
</style>
