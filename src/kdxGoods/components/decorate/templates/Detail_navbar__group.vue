<template>
    <div class="navbar_group">
        <div
            v-if="hasSingle"
            class="btn btn-simple"
            :class="{
                'disabled':isSelled
            }"
            @click="normalClick"
        >
            <div class="group_price"><span class="group_unit">￥</span>
                <span>{{getPrice}}</span>
            </div>
            <div class="group_text">单独购买</div>
        </div>
        <div
            class="btn btn-submit"
            :class="{
                'disabled': btnDisabled
            }"
            @click="specialClick"
        >
            <div class="group_price"><span class="group_unit">￥</span>{{getGroupPrice}}</div>
            <div class="group_text">我要开团</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'detail_navbar__group',
    props: {
        activityData: {
            type: Object,
            default: () => { }
        }
    },
    computed: {
        getPrice() {
            let { min_price, price, has_option } = this.goodsData

            if (has_option == '1') {
                return `${this.formatMoney(min_price)}`
            } else {
                return this.formatMoney(price)
            }
        },
        goodsData() {
            return this.activityData?.params?.goods || {};
        },
        groupData() {
            return this.activityData?.params?.groups || {}
        },
        hasSingle(){
            return this.groupData?.rules?.single_buy =='1'
        },
        getGroupPrice() {
            if (this.goodsData?.has_option != '1' && this.groupData.inner_type=='0') {
                return this.formatMoney(this.groupData?.goods_info[0]?.price)
            } else {
                let { min_price } = this.groupData?.price_range
                let price = `${this.formatMoney(min_price)}`
                return this.$utils.formartOptPrice(price)
            }
        },
        btnDisabled() {
            let { activity_stock} = this.groupData
             let { stock } = this.goodsData
            let minStock = Math.min(stock,activity_stock)
            return minStock <= 0
        },
        // 库存为0
        isSelled() {
            return !this.activityData.params.canbuy;
        },
        // 剩余购买数量
        getGroupLimit() {
            return this.groupData.rules?.limit_num - this.groupData?.buy_count
        },
        limitBuy() {
            let limit_type = this.groupData?.rules?.limit_type;
            if (limit_type != '0') {
                return this.getGroupLimit <= 0
            }
            return false
        }
    },
    methods: {
        normalClick() {
            this.$emit('normal-click', {
                btn: 'buy',
            })
        },
        specialClick() {

            // 库存不足
            if (this.btnDisabled) {
                return this.$toast('库存不足')
            }
            // 已经开团
            if(this.groupData.has_open==1){
                this.$toast('您已有正在进行的拼团')
                return
            }
            // 购买上限
            if (this.limitBuy) {
                this.$toast('购买超过限制')
                return;
            }

            this.$emit('special-click', {
                btn: 'buy',
                activeName: 'groups'
            })
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                return parseFloat(money)
            } else {
                return 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar_group {
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: px2rpx(20);

    .btn {
        flex: 1;
        padding: px2rpx(1) 0;
        text-align: center;


        .group_price {
            font-size: px2rpx(14);
            font-weight: bold;
            line-height: px2rpx(20);
            color: #fff;
        }
        .group_unit {
            font-size: px2rpx(10);
            line-height: px2rpx(14);
        }
        .group_text {
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #fff;
        }

        &.btn-submit {
            background: linear-gradient(
                114.57deg,
                #ff8a00 19.05%,
                #ff4c14 87.67%
            );
        }

        &.btn-simple {
            background: #f9ab10;
        }
        &.disabled {
            background: #cccccc;
        }
    }
}
</style>
