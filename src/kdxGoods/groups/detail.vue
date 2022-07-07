<template>
    <page-box>
        <view class="group-detail">
            <view class="bg"></view>
            <view class="container">
                <view class="goods-info">
                    <Goods
                        :item="goods"
                        :activity-info="groupsInfo"
                    />
                    <view class="goods-rules">拼团规则：支持开团邀请好友参团，人数不足自动退款</view>
                </view>
                <view class="content">
                    <block v-if="state == '0' || state == '2'">
                        <view :class="{
                                pending: state == '0',
                                success: state == '1',
                                fail: state == '2',
                            }">
                            <view class="title">
                                <view class="title-line">
                                    <view class="line"></view>
                                    <view class="circle"></view>
                                </view>
                                <span class="title-text" v-if="state=='0'">拼团剩余时间</span>
                                <span class="title-text" v-if="state=='2'">拼团失败</span>
                                <view class="title-line reserve">
                                    <view class="line"></view>
                                    <view class="circle"></view>
                                </view>
                            </view>

                            <view
                                class="surplus-time"
                                v-if="groupsInfo.end_time"
                            >
                                <cut-down
                                    :end_time="groupsInfo.end_time"
                                    :color="
                                        state == '0' ? '#ff3c29' : '#969696'
                                    "
                                    :bg_color="
                                        state == '0' ? '#ff3c29' : '#969696'
                                    "
                                    @on-end="finishGroup"
                                ></cut-down>
                            </view>
                            <!-- 待成团提示 -->
                            <view
                                class="pending-tip"
                                v-if="state == '0' && getSurplus"
                            >还差
                                <span class="surplus-user">
                                    {{ getSurplus }} </span>人即可拼团成功
                            </view>

                            <!-- 失败提示 -->
                            <view
                                class="fail-tip"
                                v-if="state == '2'"
                            >团长有效期内拼团人数不足</view>
                        </view>
                    </block>
                    <!-- 成功 -->
                    <block v-if="state == '1'">
                        <view class="success">
                            <img
                                :src="
                                    $utils.staticMediaUrl(
                                        'activity/group/group_success.png'
                                    )
                                "
                                class="success-img"
                            />
                        </view>
                    </block>

                    <view class="user-list">
                        <view
                            v-for="(user, index) in filterUsers"
                            :key="index"
                            class="user-item"
                        >
                            <img
                                class="user-avatar"
                                :src="
                                    $utils.mediaUrl(user.avatar) ||
                                        $utils.staticMediaUrl(
                                            'decorate/avatar_mobile.png'
                                        )
                                "
                            />
                            <view
                                class="user-tag"
                                v-if="groupsInfo.leader_id == user.member_id"
                            >团长</view>
                        </view>
                        <!-- 显示省略号 -->
                        <view
                            class="ellipsis-icon"
                            v-if="showSurplusIcon"
                        >
                            <i class="iconfont-m- icon-m-shenglve"></i>
                        </view>

                        <view
                            class="invite-btn"
                            v-if="state != '1' && !loadedError"
                            @click="handleShare"
                        >
                            <subscribe-group v-if="addSubscribe && shareTemplateId.length>0" :templates="shareTemplateId" :subStyle="`top:0;left:0;border-radius:100%;`" @success="success('add')" @error="error('add')"></subscribe-group>
                            <i class="iconfont-m- icon-m-add" />
                        </view>

                        <view class="invite-btn" v-if="users.length>5&& state=='1'">
                            <span class="surplus-num">+{{surplusUserNum}}</span>
                        </view>
                    </view>

                    <view
                        v-if="!loadedError"
                        class="btn-look"
                        @click="toAllUsers"
                    >查看全部团员</view>
                    <view>
                        <view style="position: relative">
                            <view
                                class="btn btn-primary"
                                :class="{
                                    'disabled': goods.activity_stock=='0'
                                }"
                                v-if="state == '0' && !groupsInfo.is_join && !groupsInfo.is_leader"
                                @click="joinGroups"
                            >参与拼团</view>
                            <subscribe v-if="joinSubscribe && joinTemplateId.length>0" :templates="joinTemplateId" :subStyle="`top:0;left:0;width:100%;`" @success="success('join')" @error="error('share')"></subscribe>
                        </view>
                        <view style="position: relative">
                            <view
                                class="btn btn-primary"
                                v-if="state == '0' && groupsInfo.is_leader == '1'"
                                @click="handleShare"
                            >邀请好友参团</view>
                            <subscribe v-if="shareSubscribe && shareTemplateId.length>0" :templates="shareTemplateId" :subStyle="`top:0;left:0;width:100%;`" @success="success('share')" @error="error('share')"></subscribe>
                        </view>
                        <view
                            class="btn btn-primary"
                            v-if=" groupsInfo.is_leader == '1' && state == '2' && groupsInfo.status =='0'"
                            @click="toGoods"
                        >重新开团</view>
                        <view
                            class="btn btn-plain"
                            v-if="state == '1' || state == '2' || loadedError"
                            @click="toIndex"
                        >首页逛逛</view>
                        <view
                            class="btn btn-plain"
                            v-if="(state == '0' || state == '1') && groupsInfo.order_id"
                            @click="toOrder"
                        >查看订单详情</view>
                    </view>
                </view>
            </view>
        </view>
        <share-modal
            v-if="showShare"
            v-model="showShare"
            :goods="goods"
            type="group"
            @material="materialHandler"
            @share="shareHandler"
        ></share-modal>
        <poster-modal
            v-if="showPoster"
            @mounted="posterShow"
            poster-type="group"
            ref="poster"
        ></poster-modal>
        <!-- 多规格选择 -->
        <goods-picker
            ref="goodsPicker"
            @choose="specPickerChoose"
            @changeNum="optionChangeNum"
            @clickBtn="clickBtn"
        ></goods-picker>
    </page-box>
</template>

<script>
import Goods from "./components/GoodsGroup";
import CutDown from "../components/detail/group/CutDown";
import goodsPicker from "@/components/goods/GoodsPicker";
import ShareModal from "../components/detail/ShareModal";
import PosterModal from "../components/poster/PosterModal";
import CartAdder from "@/components/goods/addCartTools.js";
import { eventHandler } from "../detail/index/eventHandlers.js";
import {
    addCart,
    createOrder,
    tipBeforeOper,
} from "../detail/index/indexTools.js";
import { mapState, mapMutations } from "vuex";
// #ifdef MP-TOUTIAO
import EventBus from "@/common/eventBus.js";
// #endif
import Subscribe from '@/components/wechat/Subscribe'
import SubscribeGroup from '../components/detail/SubscribeGroup'


let timer;
export default {
    components: {
        Goods,
        CutDown,
        ShareModal,
        goodsPicker,
        PosterModal,
        Subscribe,
        SubscribeGroup,
    },
    data() {
        return {

            team_id: "",
            state: "", // -2手动停止 -1 停止 失败 0 进行中 1成功
            users: [],
            goods: {},
            groupsInfo: {},

            // 适配快速购买
            optionId: "",
            optionChoseNum: "1", //多规格选择数量
            optionChoose: "", // 选择规格
            goodsInfo: null, // 拼团购买用
            optionInfo: null, // 拼团购买用
            goodsData: {},
            goodDetail: {},
            activityInfo: {},
            canBuy: false,
            // 分享
            showShare: false,
            showMaterial: false,
            showPoster: false,
            posterData: {}, // 海报数据
            loadedError: false,
            isWxScan: false, // 判断是否是小程序分享
            shareTemplateId: [], //公众号订阅团长邀请模板
            joinTemplateId: [], //公众号订阅团长邀请模板
            shareSubscribe: true, //公众号订阅团长邀请按钮
            joinSubscribe: true, //公众号订阅参与邀请按钮
            addSubscribe: true, //公众号订阅参与 + 号邀请按钮
            materialType: "share",
        };
    },
    computed: {
        ...mapState('setting', {
            shareBase: state => state.systemSetting?.share
        }),
        ...mapState('login', ['isLogin']),
        ...mapState('groups', {
            id: state=> state.groupsTeamId
        }),
        // 剩余参团人数
        getSurplus() {
            let { count = 0, success_num = 0 } = this.groupsInfo;
            return +success_num - +count;
        },
        // 参团人数显示效果
        filterUsers() {
            if (this.state == "1" && this.users.length == 5) {
                return this.users.slice(0, 5);
            } else {
                return this.users.slice(0, 4);
            }
        },
        // 隐藏更多人数按钮
        showSurplusIcon() {
            return (
                this.users.length > 5 && this.state != "1"
            );
        },
        // 剩余可见数量
        surplusUserNum() {
            return this.users.length - 4
        }
    },
    watch: {
        // #ifdef MP-WEIXIN
        id: {
            handler(newId){
                // 小程序分享扫码进入
                if(newId){
                    this.team_id = newId;
                    this.getInfo();
                }
            },
            immediate: true
        },
        // #endif
        isLogin: {
            handler(val){
                if(this.team_id && val){
                    this.getInfo()
                }
            },
            immediate: true
        }
    },
    created() {
        // #ifdef H5
        if(this.$utils.is_weixin()) {
            let noticeIds = this.$store.state.setting?.noticeTemId;
            let share_code = ['groups_success', 'groups_defeated', 'groups_join'];
            let join_code = ['groups_success', 'groups_defeated']
            if(noticeIds && share_code.length) {
                share_code.map((item)=> {
                    if(noticeIds[item]) {
                        this.shareTemplateId?.push(noticeIds[item])
                    }
                })
            }
            if(noticeIds && join_code.length) {
                join_code.map((item)=> {
                    if(noticeIds[item]) {
                        this.joinTemplateId?.push(noticeIds[item])
                    }
                })
            }
        }
        // #endif
    },
    mounted() {
        let team_id = this.$Route.query.team_id
        // 防止小程序分享进来没有team_id
        if(team_id){
            this.team_id = this.$Route.query.team_id;
        }

        if(this.team_id){
            this.getInfo();
        }
        this.initBuyPicker();
    },
    onShow() {
        uni.hideLoading()
        if (this.team_id) {
            this.getInfo();
        }
    },
    methods: {
        ...mapMutations('order', ['setGroupsUser']),
		$_pullRefresh() {
			if (this.team_id) {
			    this.getInfo();
			}
		},
        // 初始化快速购买
        initBuyPicker() {
            // #ifdef MP-TOUTIAO
            EventBus.$off("mounted-child");
            EventBus.$on("mounted-child", (child) => {
                this.$refs.goodsPicker = child;
            });
            this.$once("hook:beforeDestory", () => {
                EventBus.$off("mounted-child");
            });
            // #endif
            this.cartAdder = new CartAdder();
        },
        getInfo() {
            this.$api.orderApi
                .groupsOrder({ team_id: this.team_id })
                .then((res) => {
                    if (res.error == 0) {
                        this.loadedError = false;
                        let { crew_list, goods, team_detail, activity } = res;
                        this.users = crew_list;
                        this.state = team_detail.success;
                        this.goods = goods;
                        // todo
                        this.team_id = team_detail.id
                        // 活动停止调整显示时间
                        if ((activity.status == '-1' || activity.status == '-2') && this.state != '0') {
                            team_detail.end_time = '0000-00-00 00:00:00'
                        }
                        this.groupsInfo = { ...team_detail, ...activity } || {};
                        this.posterData = {
                            title: res.goods.title,
                            thumb: res.goods.thumb,
                            groups_price: res?.team_detail?.is_ladder == '0' && res.goods.has_option == '0' ? res.goods?.activity_price : res.goods?.price_range?.min_price,
                            original_price: res.goods.original_price,
                            invite_url: res.team_detail.invite_url,
                            team_id: this.team_id
                        };
                        this.$store.commit('groups/setGroupsPoster', this.posterData);
                        // #ifdef H5
                        this.setShareInfo(res);
                        // #endif
                    } else if (res.error === -10004) {
                        // 拼团没有权限
                        this.loadedError = true;
                        this.$toast(res.message, 1000)
                    }
                });
        },
        async joinGroups() {
            // 库存不足
            if (this.goods.activity_stock == 0) {
                return;
            }
            // #ifdef MP-WEIXIN
            let type_code = ['groups_success', 'groups_defeated'];
            this.$utils.sendWxappMsg(type_code)
            // #endif
            try {
                if (this.goodsInfo && this.optionInfo) {
                    this.customEvent();
                } else {
                    this.getGoodsInfo();
                }
            } catch (error) {
                console.log(error);
            }
        },
        getGoodsInfo() {
            let id = this.goods.id;
            this.$api.goodApi.goodDetail({ id, team_id: this.team_id, activity_type: 'groups' }).then((res) => {
                if (res.error === 0) {

                    // 手动停止活动 后台不返回活动字段
                    if (!res.activity.groups) {
                        this.$toast('团无效')
                        this.getInfo()
                        return
                    }
                    this.goodsInfo = res;
                    this.goodDetail = res.data.goods;
                    this.buy_num = res.data.buy_num;
                    this.canBuy = res.perm.buy == "1";
                    this.activityInfo = res?.activity ?? null;

                    this.$decorator.getPage(11).setGoodDetail(res);

                    this.handleOption();
                }
            });
        },
        handleOption() {
            // 单规格普拼走默认规格
            let hasOption = this.goodDetail.has_option == "1";

            if (!hasOption) {
                let singleOpt = {
                    options: [],
                    spec: [],
                };
                this.optionsInfo = singleOpt;
                this.$decorator.getPage(11).setActiveOptInfo({
                    ...singleOpt,
                    activeName: "groups",
                });

                this.customEvent();
            } else {
                this.getOptionsInfo(this.goods.id);
            }
        },
        // 获取规格，存储拼团规格活动数据
        getOptionsInfo(goods_id) {
            this.$decorator
                .getPage(11)
                .getActiveGoodsOption({ goods_id, activeName: "groups", team_id: this.team_id })
                .then((res) => {
                    if (res.error === 0) {
                        this.optionInfo = res;
                        this.customEvent();
                    }
                });
        },
        // 执行购买流程
        customEvent() {
            let optionsInfo = {
                activeName: "groups",
                is_join: "1",
                team_id: this.team_id,
            };
            let { is_ladder, ladder, end_time, activity_id } = this.groupsInfo
            if (is_ladder == '1') {
                optionsInfo.ladder = ladder
            }
            // 补充活动id
            if (activity_id) {
                optionsInfo.activity_id = activity_id
            }

            let formatTime = new Date(Date.parse(end_time.replace(/-/g, "/"))).getTime()
            // 活动过期且团订单处在有效期
            if ((formatTime - Date.now() > 0) && this.groupsInfo.status == '-1') {
                optionsInfo.activity_id = this.groupsInfo.activity_id
            }

            let {
                activity,
                data: { goods, sub_shop_info, buy_num },
            } = this.goodsInfo;
            eventHandler.call(
                this,
                {
                    data: {
                        btn: "buy",
                        ...optionsInfo,
                    },
                    target: "detail_navbar/clickItem",
                },
                {
                    goodsData: goods,
                    goods_id: this.goods.id,
                    option_id: this.optionId,
                    total: this.optionChoseNum,
                    goodDetail: goods,
                    detailInfo: this.goodsInfo,
                    activityInfo: activity,
                    sub_shop_id: sub_shop_info?.id,
                    buy_num: buy_num,
                }
            );
        },
        // 购买商品
        async clickBtn(type, restOpt) {
            let {
                activity,
                data: { goods, sub_shop_info, buy_num },
            } = this.goodsInfo;
            let data = {
                goodsData: goods,
                goods_id: this.goods.id,
                option_id: this.optionId,
                total: this.optionChoseNum,
                goodDetail: goods,
                detailInfo: this.goodsInfo,
                activityInfo: activity,
                sub_shop_id: sub_shop_info?.id,
                buy_num: this.buy_num,
                canBuy: this.goodsInfo.perm.buy == "1",
                ...restOpt,
            };
            try {
                await tipBeforeOper(data, this.$refs?.goodsPicker?.show);
                if (type == "buy") {
                    await createOrder.call(this, data);
                    this.$refs?.goodsPicker.toggle();
                }
            } catch (e) {
                if (e.errorId == "openPicker") {
                    uni.showToast({
                        title: e.errorInfo,
                        icon: "none",
                    });
                }
            }
        },
        // 规格切换
        specPickerChoose(specs, options, is_origin) {
            this.optionId = options?.id;
            this.optionChoose = specs;
        },
        // 购买数量变化
        optionChangeNum(num) {
            this.optionChoseNum = num;
        },
        // 分享
        shareHandler() {
            this.showShare = false;
            this.posterShow();
        },
        materialHandler(type) {
            this.materialType = type
            this.showShare = false;
            this.showMaterial = true;
        },
        handleComplete() {
            this.showMaterial = false;
        },
        posterShow() {
            if (!this.showPoster) {
                this.showPoster = true;
                return;
            }
            this.$refs.poster && this.$refs.poster.toggle(show => {
                console.log("toggle", show);
            });
        },
        //
        async handleShare() {
            // 不是团长，不能邀请
            if (this.groupsInfo.is_leader != '1') return;
            if (!(await this.$store.dispatch('login/checkLogin'))) {
                return this.$store.commit('login/setModal', true)
            } else {
                // #ifdef MP-WEIXIN
                let type_code = ['groups_success', 'groups_defeated', 'groups_join'];
                this.$utils.sendWxappMsg(type_code)
                // #endif
                this.showShare = true
            }
        },
        finishGroup() {
            // 后端执行过期任务需要时间，所以轮询状态
            clearInterval(timer)
            let state = this.state
            if (state === '0') {
                this.getInfo();
                timer = setInterval(() => {
                    if (state === this.state) {
                        this.getInfo();
                    } else {
                        clearInterval(timer)
                    }
                }, 1000)
                this.$once('hook:beforeDestroy', () => {
                    clearInterval(timer)
                })
            }
        },
        toAllUsers() {
            this.setGroupsUser({ list: this.users, id: this.groupsInfo.leader_id })
            this.$Router.push({
                path: "/kdxGoods/groups/user"
            });
        },
        toIndex() {
            this.$Router.auto({
                //#ifndef H5
                path: "/pages/index/index",
                //#endif
                //#ifdef H5
                path: "/",
                //#endif
            });
        },
        toGoods() {
            this.$Router.auto({
                path: "/kdxGoods/detail/index",
                query: { goods_id: this.goods.id }
            });
        },
        toOrder() {
            this.$Router.auto({
                path: "/kdxOrder/detail",
                query: { order_id: this.groupsInfo.order_id },
            });
        },
        setShareInfo(res) {
            if (!this.$utils.is_weixin()) {
                return
            }

             let shareInfo = {
                description: `点我立即拼单${res.goods.title}` || this.shareBase.description,
                link: res.team_detail.invite_url,
                logo: this.$utils.mediaUrl(res.goods.thumb),
                sdkUrl: this.$app_isW7?location_href.split('#')[0] + '#' + location_href.split('#')[1]:window.location.href,
                title: res.goods.title || '拼团详情'
            };
            this.$utils.getShareInfo(shareInfo);
        },
        // 公众号订阅消息事件
        success(type) {
            if(type=='share') {
                this.shareSubscribe = false;
                this.handleShare()
            }else if(type == 'join'){
                this.joinSubscribe = false;
                this.joinGroups()
            }else {
                this.addSubscribe = false;
                this.handleShare()
            }
        },
        error(type) {
            if(type=='share') {
                this.shareSubscribe = false;
                this.handleShare()
            }else if(type == 'join'){
                this.joinSubscribe = false;
                this.joinGroups()
            }else {
                this.addSubscribe = false;
                this.handleShare()
            }
        }
    },
    // #ifndef H5
    // todo 提取公共minxins
    onShareAppMessage() {
        let url = '/kdxGoods/groups/detail?team_id=' + this.team_id + '&inviter_id=' + this.$store.state.login.userInfo.id;
        return {
            title: this.goods.title,
            desc: `您的好友邀请您一起拼单购买${this.goods.title}`,
            imageUrl: this.$utils.mediaUrl(this.posterData.thumb),
            path: url,
            success: function () { },
            fail: function () { }
        }
    },
    // #endif
};
</script>

<style lang="scss" scoped>
/deep/ .grace-page-body {
    background-color: #fff;
}

.group-detail {
    position: relative;

    .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rpx(116);
        background: linear-gradient(180deg, #ff3c29 0%, #ff6f29 96.87%);
    }

    .container {
        position: relative;
        margin: 0 px2rpx(12);
        padding-top: px2rpx(16);

        .goods-info {
            overflow: hidden;
            border-radius: px2rpx(6);
            box-shadow: 0px px2rpx(4) px2rpx(4) px2rpx(-2)
                rgba(255, 60, 41, 0.1);
            background: #fff;

            .goods-rules {
                padding-left: px2rpx(12);
                height: px2rpx(32);
                font-size: px2rpx(12);
                line-height: px2rpx(32);
                color: #969696;
                background: #fcfcfc;
            }
        }

        .content {
            padding: px2rpx(12) 0;

            .title {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: px2rpx(8);

                .title-line {
                    display: flex;
                    align-items: center;

                    &.reserve {
                        .line {
                            order: 1;
                        }
                    }

                    .line {
                        height: px2rpx(1);
                        width: px2rpx(60);
                    }

                    .circle {
                        border-radius: 50%;
                        width: px2rpx(4);
                        height: px2rpx(4);
                    }
                }

                .title-text {
                    margin: 0 px2rpx(8);
                    color: #212121;
                    font-weight: bold;
                }
            }

            .surplus-time {
                margin-top: px2rpx(8);
                display: flex;
                justify-content: center;
            }

            .pending {
                padding-top: px2rpx(12);

                .title-line {
                    &.reserve {
                        .line {
                            background: linear-gradient(
                                90deg,
                                #ff3c29 -0.74%,
                                rgba(255, 60, 41, 0) 99.26%
                            );
                        }
                    }

                    .line {
                        background: linear-gradient(
                            270deg,
                            #ff3c29 -0.74%,
                            rgba(255, 60, 41, 0) 99.26%
                        );
                    }

                    .circle {
                        border: px2rpx(1) solid #ff3c29;
                    }
                }

                .pending-tip {
                    margin: px2rpx(24) 0;
                    font-size: px2rpx(16);
                    line-height: px2rpx(22);
                    text-align: center;
                    color: #000;

                    .surplus-user {
                        margin: 0 px2rpx(2);
                        font-size: px2rpx(20);
                        font-weight: bold;
                        line-height: px2rpx(28);
                        color: #ff3c29;
                    }
                }
            }

            .fail {
                padding-top: px2rpx(12);
                .title-line {
                    &.reserve {
                        .line {
                            background: linear-gradient(
                                90deg,
                                #989898 -0.74%,
                                rgba(154, 154, 154, 0) 99.26%
                            );
                        }
                    }

                    .line {
                        background: linear-gradient(
                            270deg,
                            #989898 -0.74%,
                            rgba(154, 154, 154, 0) 99.26%
                        );
                    }

                    .circle {
                        border: px2rpx(1) solid #969696;
                    }
                }

                .fail-tip {
                    margin: px2rpx(24) 0;
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    text-align: center;
                    color: #565656;
                }
            }

            .success {
                margin-bottom: px2rpx(8);
                text-align: center;
                .success-img {
                    display: inline-block;
                    width: px2rpx(269);
                    height: px2rpx(126);
                }
            }

            .user-list {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: px2rpx(-10);

                .user-item,
                .invite-btn,
                .ellipsis-icon {
                    position: relative;
                    margin-right: px2rpx(-10);
                    border-radius: 50%;
                    width: px2rpx(54);
                    height: px2rpx(54);
                }

                .user-item {
                    border: px2rpx(1) solid #ffffff;

                    .user-avatar {
                        border-radius: 50%;
                        width: px2rpx(52);
                        height: px2rpx(52);
                    }

                    .user-tag {
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        border-radius: px2rpx(12);
                        width: px2rpx(36);
                        height: px2rpx(16);
                        font-size: px2rpx(12);
                        text-align: center;
                        line-height: px2rpx(16);
                        color: #fff;
                        background: linear-gradient(
                            114.57deg,
                            #ff8a00 19.05%,
                            #ff4c14 87.67%
                        );
                    }
                }

                .invite-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 1px dashed #e6e7eb;
                    width: px2rpx(54);
                    height: px2rpx(54);
                    background: #f5f5f5;
                    .icon-m-add {
                        font-size: px2rpx(24);
                        color: #969696;
                    }

                    .surplus-num {
                        font-size: px2rpx(16);
                        line-height: px2rpx(22);
                        color: #969696;
                    }
                }

                .ellipsis-icon {
                    .icon-m-shenglve {
                        font-size: px2rpx(54);
                        color: #c4c4c4;
                    }
                }
            }

            .btn-look {
                margin: px2rpx(16) auto px2rpx(24);
                border: px2rpx(1) solid #e6e7eb;
                border-radius: px2rpx(17);
                width: px2rpx(100);
                height: px2rpx(27);
                font-size: px2rpx(12);
                line-height: px2rpx(27);
                text-align: center;
                border: px2rpx(1) solid #e6e7eb;
                border-radius: px2rpx(17);
                color: #212121;
            }

            .btn {
                margin-top: px2rpx(12);
                border-radius: px2rpx(41);
                width: px2rpx(351);
                height: px2rpx(40);
                font-size: px2rpx(16);
                line-height: px2rpx(40);
                text-align: center;
                border: px2rpx(1) solid #ff3c29;
                color: #ff3c29;
                background: #fff;

                &:first-child {
                    margin-top: px2rpx(24);
                    color: #fff;
                    background: linear-gradient(
                        114.57deg,
                        #ff8a00 19.05%,
                        #ff4c14 87.67%
                    );
                    box-shadow: 0 4px 8px -2px rgba(255, 60, 41, 0.2);
                    border: 0;
                }
                &.disabled {
                    border: 0;
                    background: #ccc;
                    box-shadow: none;
                }
            }
        }
    }
}
</style>
