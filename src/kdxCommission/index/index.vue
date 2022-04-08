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
    <div class='index-page'>
        <Skeleten v-if='!pageList.length && false'></Skeleten>
        <page-decorater
            showDiymenu
            @custom-event='eventHandler'
            :pageSettings="pageSettings"
            :customIsTop='isTop'
            :customIsBottom='isBottom'
            :customIsFixed='isFixed'
            :customPageList='pageList'
            :customPageInfo='pageInfo'
            :customPageBottom='pageBottom'
            :pageTop='pageTop'
            v-if="showCommissionPage"
        >
        </page-decorater>
        <!-- 0商品详情海报，1商品列表海报 -->
        <poster-modal ref='poster' posterType="commission"></poster-modal>
    </div>
</template>
<script>
import PageDecorater from '@/components/decorate/PageBox'
import posterModal from '@/components/poster/PosterModal'
import {
    mapState,
    mapMutations,
    mapActions
} from 'vuex'
import {
    handler
} from './eventHandler.js'
import Skeleten from './Skeleten'
import {
    deepCopy
} from '@/common/util.js'
import preloadDecorate from '@/router/beforeEach/preLoadDecorate.js'
import PageMixin from '@/common/PageMixin.js'
import PageLoadingMixin from "@/common/LoadingBox/PageLoadingMixin"

export default {
    mixins: [PageMixin, PageLoadingMixin],
    components: {
        PageDecorater,
        posterModal,
        Skeleten
    },
    data() {
        return {
            showCommissionPage: false, // 控制显示分销页面，解决闪屏问题
        }
    },
    methods: {
        async pullDownRefresh() { //下拉刷新，mixin.js中调用
            // uni.showLoading({
            // 	title: '正在刷新',
            // })
            this.$decorator.$emit('refreshMyVideo')
            await preloadDecorate(this.$Route.path, this.$Route.query, true);
            await this.$store.dispatch('commissionSet/getCommissionSetting')
            this.getData()
            setTimeout(() => {
                this.$closePageLoading()
            }, 1000)
        },
        eventHandler(e) {
            handler.call(this, e)
        },
        posterShow() {
            this.$refs.poster.toggle(show => {
                console.log('toggle', show)
            })
        },
        getData() {
            this.$decorator.getPage('commission').getCommissionData({}, {
                errorToast: false
            }).then(res => {
                this.in = true;
                this.$loading.hideLoading();
                if (res.error == 333201) {
                    // 暂未开启
                    this.$Router.replace({
                        path: '/kdxCommission/default',
                    })
                } else if (res.error == 331200) {
                    // 当前会员不是分销商，需要申请
                    this.$Router.replace({
                        path: '/kdxCommission/apply/index',
                    })
                } else {
                    // 是否展示通过页面
                    if (res?.show_success == 1) {
                        let successObj = {
                            show_success: res.show_success,
                            is_audit: res.is_audit,
                            banner: res.banner
                        };
                        this.sessionStorage.setItem('successObj', decodeURIComponent(JSON.stringify(successObj)));
                        setTimeout((res) => {
                            this.$Router.replace({
                                path: '/kdxCommission/apply/index'
                            });
                        }, 500)
                    } else {
                        // 正常显示分销首页内容
                        this.showCommissionPage = true
                        if (res.error == 0) {

                            // 关闭分销等级显示，关闭分销等级入口
                            let blockGroupData = [{
                                iconclass: 'iconfont-m- icon-m-yongjin',
                                iconcolor: '#FFDD44',
                                text: this.commissionSetting?.agent_commission ?? '分销佣金',
                                textcolor: '#212121',
                                linkurl: '/kdxCommission/statistics',
                                linkurl_name: '',
                                tipnum: res.total?.commission_total ?? '0.00',
                                tiptext: '元'
                            },
                                {
                                    iconclass: 'iconfont-m- icon-m-fenxiaodingdan',
                                    iconcolor: '#54A3FE',
                                    text: this.commissionSetting?.commission_order ?? '分销订单',
                                    textcolor: '#212121',
                                    linkurl: '/kdxCommission/order/list',
                                    linkurl_name: '',
                                    tipnum: res.total?.commission_order ?? '0',
                                    tiptext: '笔'
                                },
                                {
                                    iconclass: 'iconfont-m- icon-m-tixianmingxi',
                                    iconcolor: '#FF8243',
                                    text: this.commissionSetting?.withdraw_detail ?? '提现明细',
                                    textcolor: '#212121',
                                    linkurl: '/kdxCommission/withdraw/list',
                                    linkurl_name: '',
                                    tipnum: res.total?.withdraw_count ?? '0',
                                    tiptext: '笔'
                                },
                                {
                                    iconclass: 'iconfont-m- icon-m-xiaxian',
                                    iconcolor: '#A46AFF',
                                    text: this.commissionSetting?.my_down_line ?? '我的下线',
                                    textcolor: '#212121',
                                    linkurl: '/kdxCommission/downLine',
                                    linkurl_name: '',
                                    tipnum: res.total?.commission_child ?? '0',
                                    tiptext: '人'
                                },
                                {
                                    iconclass: 'iconfont-m- icon-m-dengjishuoming',
                                    iconcolor: '#00E28F',
                                    text: this.commissionSetting?.level_description ?? '等级说明',
                                    textcolor: '#212121',
                                    linkurl: '/kdxCommission/level',
                                    linkurl_name: '',
                                    tipnum: '',
                                    tiptext: ''
                                },
                                {
                                    iconclass: 'iconfont-m- icon-m-paiming',
                                    iconcolor: '#FF715F',
                                    text: this.commissionSetting?.commission_rank ?? '佣金排名',
                                    textcolor: '#212121',
                                    linkurl: '/kdxCommission/ranking',
                                    linkurl_name: '',
                                    tipnum: '',
                                    tiptext: ''
                                },

                            ]

                            if (this.commissionSetting?.show_commission_level == '0') {
                                blockGroupData = blockGroupData.filter(v => v.linkurl != '/kdxCommission/level')
                            }
                            this.$decorator.getPage(this.$Route).setPageInfo({
                                distributor: {
                                    params: {
                                        avatar: res.agent_info.avatar,
                                        nickname: res.agent_info.nickname,
                                        levelname: res.agent_info.level_name,
                                        withdraw: res.commission_price.commission_pay,
                                        pending: res.total.wait_settlement_commission,
                                        havemoney: res.commission_price.can_withdraw,
                                        recommender: res.agent_info.agent_name,
                                        canwithdrawtext: this.commissionSetting?.can_withdraw_commission ?? '可提现佣金',
                                        waitrecordtext: this.commissionSetting?.wait_account_commission ?? '待入账佣金',
                                        moneytext: this.commissionSetting?.commission ?? '佣金',
                                        withdrawtext: this.commissionSetting?.withdraw ?? '提现',
                                        show_commission_level: this.commissionSetting?.show_commission_level
                                    }
                                },
                                blockgroup: {
                                    data: blockGroupData
                                }
                            }, 'commission/index.vue/getData')

                            // 监听返回分销等级设置的问题
                            if (!this.$isPC) {
                                this.$watch('commissionSetting.show_commission_level', (e) => {
                                    if (e == '0') {
                                        let arr = [], hasLevel = false;
                                        blockGroupData.forEach(v => {
                                            if (v.linkurl == '/kdxCommission/level') {
                                                hasLevel = true
                                            } else {
                                                arr.push(v)
                                            }
                                        })

                                        if (hasLevel) {
                                            this.$decorator.getPage(this.$Route).setPageInfo({
                                                distributor: {
                                                    data: arr
                                                }
                                            })
                                        }
                                    }
                                }, {immediate: true})
                            }
                        }
                    }
                }
            })
        },
    },
    computed: {
        ...mapState('decorate/commissionPage', {
            pageList: state => state.pageList,
            pageInfo: state => deepCopy(state.pageInfo),
            isTop: state => state.isTop,
            isBottom: state => state.isBottom,
            isFixed: state => state.isFixed,
            pageTop: state => state.pageTopHeight,
            pageBottom: state => state.pageBottomHeight,
            pageSettings: state => state.pageSettings
        }),
        ...mapState('commissionSet', {
            commissionSetting: state => state.commissionSetting
        }),
    },
    watch: {
        commissionSetting: {
            immediate: true,
            handler() {
                uni.setNavigationBarTitle({
                    title: this.commissionSetting?.agent_center || this.pageSettings.title || '分销中心'
                });
            }
        },
    },
    beforeDestroy() {
        this.$decorator.$off('refreshMyVideo')
        this.$decorator.getPage('commission').clearAll(); //清空商品信息
    },
    mounted() {
        this.$store.dispatch('commissionSet/getCommissionSetting')
        this.getData()
        this.clearTime = setTimeout(() => {
            if (!this.in) {
                // this.$loading.hideLoading()
            }
        }, 3000)
    },
    destroyed() {
        clearTimeout(this.clearTime);
    }
}
</script>
<style lang="scss" scoped>
.index-page {
    background: #eee;
}
</style>
