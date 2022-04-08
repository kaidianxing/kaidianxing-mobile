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
        <!-- 下单商品 -->
        <create-goods :goodsData="orderData.goods_info"
                      :activity-type="orderData.activity_type" :order-data="orderData" :dispatch_type="dispatch_type" @getData="getData" @toInvoice="toInvoice"></create-goods>
        <create-message  :invoiceData="invoiceData" @toRemarkBuyer="toRemarkBuyer" @toInvoice="toInvoice"></create-message>
    </div>
</template>

<script>

    import createGoods from './CreateGoods'
    import createMessage from './CreateMessage'
    export default {
        name: "CreateInfo",
        components: {
            createGoods,
            createMessage
        },
        props: ['orderData', 'invoiceData','dispatch_type'],
        data() {
            return {
                goodsData: [],
            }
        },
        computed: {
            
        },
        created() {
        },
        mounted() {
        },
        methods: {
            toRemarkBuyer() {
                this.$Router.auto({
                    path: '/kdxOrder/remarkBuyer'
                })
            },
            toInvoice(data) {
                console.log(data, 'data>>>>>>>>>>');

                // 如果是微信直接获取发票
                // #ifdef MP-WEIXIN
                uni.getSetting({
                    success: (res) => {
                        if (res.authSetting['scope.invoiceTitle'] == false) {
                            uni.openSetting()
                        } else {
                            uni.chooseInvoiceTitle({
                                success: (res) => {
                                    let params = {
                                        invoice_is_company: res.type == 1 ? '1' : '2',
                                        invoice_title: res.title,
                                        invoice_number: res.taxNumber
                                    };
                                    this.handlerInvoice(params, data);
                                }
                            });
                        }
                    }
                });
                return;
                // #endif
                let query = {
                    invoice_type: data.type
                };

                this.$Router.auto({
                    path: '/kdxOrder/invoice',
                    query: query
                })
            },
            handlerInvoice(params, data) {
                let result = params;
                this.$store.commit('orderCreate/setOrderCreateInfo', result);
            },
            getData() {
                this.$emit('getData')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>