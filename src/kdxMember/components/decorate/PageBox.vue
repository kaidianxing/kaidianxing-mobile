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
    <theme-content :navbarBg="navbarBg">
        <loading-box>
            <div class="page-bg decorate-page" :style="{paddingTop:getPagePaddingTop,paddingBottom: areaBottom+'px'}">
                <login-modal @custom-event='eventHandler' v-if='showLoginModal'></login-modal>
                <!-- #ifdef MP-WEIXIN -->
                <phone-modal v-if='phoneVisible'></phone-modal>
                <!-- #endif -->
                <div class="grace-sbody" :style="{
            minHeight: windowHeight
        }">

                    <!-- 页面顶部固定 -->
                    <div class="my-istop" :class="maskStatus?'highIndex':''" :style="{top:headerHeight+'px'}" v-if='customIsTop.length'>
                        <div class="fixedtop" style="width:100%;z-index:9999;">
                            <decorater :componentData="item" :pageInfo="customPageInfo" :key="item._comIndex_" v-for="(item,index) in customIsTop" @custom-event="eventHandler"></decorater>
                        </div>
                    </div>
                    <!-- 页面主体 -->
                    <div class="grace-page-body" >
                        <div class="gBody" id='gBody' @click="clickBody" :style="{minHeight:`calc(100% - ${headerHeight}px)`}">
                            <!-- 防止手机横向滚动 -->
                            <div class="gBody-container" v-if='customPageList.length'>
                                <decorater v-for='(item,index) in customPageList' :pageInfo='customPageInfo' :componentData='item' :key="item._comIndex_" @custom-event='eventHandler'></decorater>
                            </div>
                            <slot></slot>
                            <div class='bottom-loading' v-if='loadTip'>
                                <copy-right v-if="isShowCopyRight===true"></copy-right>
                                <div v-else>{{loadTip}}</div>
                            </div>
                            <div class="isbottom" :style="{height:(isDecoratePage?customPageBottom:pageBottomHeight)+'rpx',background:pageSettings?pageSettings.background_color:setting.background}" v-if='showDiymenu'></div>
                        </div>
                    </div>

                    <!-- 页面底部 -->
                    <div class="grace-page-footer" :style="{'z-index':footerIndex, background:footerBg,paddingBottom: areaBottom+'px'}">
                        <!-- 置底装修组件 -->
                        <slot name="foot"></slot>
                        <decorater :componentData="item" :pageInfo="customPageInfo" :key="item._comIndex_" v-for="item in customIsBottom" @custom-event="eventHandler"></decorater>
                        <template v-if="getIsBottom.length">
                            <decorater
                                :componentData="item"
                                :pageInfo="getPageInfo"
                                :key="item._comIndex_"
                                v-for="(item, index) in getIsBottom"
                                @custom-event="eventHandler"
                            ></decorater>
                        </template>
                    </div>
                </div>
                <!-- 悬浮组件插槽 -->
                <slot name="fixed"></slot>
                <decorater :componentData="item" :pageInfo="customPageInfo" v-for="(item,index) in customIsFixed" :key="index" @custom-event="eventHandler"></decorater>
                <wxapp-code :visible="isCurrentPage && liverCode.visible" :liver-id="liverCode.liverId" :broad-id="liverCode.broadId" v-if='isCurrentPage && liverCode.visible'></wxapp-code>
                <wx-code :visible="isCurrentPage && showWxCode" v-if='isCurrentPage && showWxCode'></wx-code>
            </div>
            <toast></toast>
        </loading-box>
    </theme-content>
</template>
<script>
import Decorater from './index'
import LoginModal from '@/components/decorate/LoginModal.vue'
import PhoneModal from '@/components/decorate/PhoneModal.vue'
import WxCode from '@/components/decorate/components/WxCode'
import CopyRight from "@/components/decorate/components/CopyRight"
import WxappCode from '@/components/decorate/components/WxappCode'

import {
    mapState,
    mapMutations,
    mapGetters
} from 'vuex'
import {
    MALL_CLOSE_CODE,
    NEED_LOGIN_CODE,
    NEED_BIND_MOBILE_CODE,
    INVALID_CODE,
    MEMBER_DELETE_CODE,
    NO_TOAST
} from '@/common/variable/statusCode';

let navThrottleBar = null;

/**
 * 页面类型
 */
export const decoratePageType = {
    '/kdxMember/index/index': 12,
    '/kdxGoods/detail/index': 11,
    '/pages/index/index': 10,
    '/kdxCommission/index/index': 20,
}
import {
    deepCopy
} from '@/common/util.js'
import getSessionId from '@/common/request/getSessionId'
import {handler} from "@/kdxCommission/index/eventHandler";
export default {
    components: {
        Decorater,
        LoginModal,
        PhoneModal,
        WxappCode,
        WxCode,
        CopyRight,
    },
    computed: {
        ...mapGetters('login', ['isSkip', 'isLogin', 'isBind']),
        ...mapState('login', {
            loginVisible:state=> state.loginVisible,
            phoneVisible: state=>state.phoneVisible
        }),
        ...mapGetters({
            getRequestInfo: 'getRequestInfo',
            liverCode: 'liverCode',
            showWxCode: 'showWxCode'
        }),
        ...mapState(['areaBottom','windowHeight']),
        ...mapState('decorate', {
            maskStatus:state => state.maskStatus
        }),
        ...mapState('decorate/othersPage', {
            pageBottomHeight: state => state.pageBottomHeight,
            pageInfo: state => deepCopy(state.pageInfo), //非装修页面共享的数据
            isBottom: state => state.isBottom,
        }),
        getPagePaddingTop(){
            return this.pageTop+'rpx';
        },
        routePath() {
            if(this.loaded){
                return this.$Route ?.path ?? '';
            }
        },
        getIsBottom() {
            this.footerBg = '#fff';
            if (this.customIsBottom.length) { //装修页面单独传入组件，不需要这里渲染
                for (let item of this.customIsBottom) {
                    if (item.id == 'diymenu') {
                        this.footerBg = item.style.bgcolor
                    }
                }
                return []
            }
            let list = this.isBottom.filter(item => {
                if (item.id == 'diymenu') {
                    return this.showDiymenu
                }
                return true
            })
            if (list.length) {
                for (let item of list) {
                    if (item.id == 'diymenu') {
                        this.footerBg = item.style.bgcolor
                    }
                }
            }
            return list
        },
        isDecoratePage() { //是否装修页面
            if(this.loaded){
                return this.$decorator.getPageType(this.$Route.path)!=-1
            }
        },
        isCurrentPage() {
            if(this.loaded){
                return this.getRoute.path === this.getRequestInfo ?.routeInfo ?.path
            }
        },
        getPageInfo() {
            return this.customPageInfo || this.pageInfo
        },
        // 是否是首页与会员中心页面
        isShowCopyRight() {
            let pageType = this.$decorator.getPageType(this.getRoute.path)
            let hasCopyRight = [10,12].includes(pageType)
            return hasCopyRight
        },
        getRoute(){
            if(this.loaded){
                return this.$Route
            }
            return  {}
        },
        showLoginModal(){
            return (!this.noLogin && this.loginVisible)
        },
    },
    props: {
        footerIndex: {
            type: Number,
            default: 999999
        },

        pageTop: {
            type: Number,
            default: 0
        },
        showDiymenu: {
            type: Boolean,
            default: false
        },

        customPageBottom: {
            type: Number,
            default: 0
        },
        customIsBottom: {
            type: Array,
            default: () => []
        },
        customIsFixed: {
            type: Array,
            default: () => []
        },
        customPageList: {
            type: Array,
            default: () => []
        },
        customIsTop: {
            type: Array,
            default: () => []
        },
        customPageInfo: {
            type: Object,
            default: null
        },
        setting: {
            type: Object,
            default: () => ({
                background: '#f5f5f5'
            })
        },
        pageSettings: {
            type: Object,
            default: () => ({})
        },
        loadTip: { //触底时的提示
            type: String,
            default: ''
        },
        noLogin: {
            type: Boolean,
            default: false
        },
        manualBind: { // 手动触发绑定跳转
            type: Boolean,
            default: false
        },
        navbarBg: { // 主题色设置背景色
            type: Boolean,
            default: false,
        },
    },
    mounted(){
        // console.error('tttttt======.....>>>>', '')
        // this.$loading.hideLoading();
        // this.$loading.hideLoading();
        this.loaded = true
    },
    data() {
        return {
            footerBg: '#fff',
            headerHeight: 0,
            skiping: false,
            codeVisible: true,
            isRequeseSession: false,
            loaded: false,
        }
    },
    created(){
        if(!this.loaded){
            this.$loading.setOtherData();
            this.loaded = true;
        }
    },
    beforeMount() {
        this.closeLiverCode()
        this.changeWxCode({
            status: false
        })
        // #ifndef H5
        this.headerHeight = 0
        // #endif
    },

    methods: {
        ...mapMutations('login', [
            'startSkip',
            'setLogin',
            'setBind',
            'setModal'
        ]),
        ...mapMutations(['closeLiverCode', 'changeWxCode']),
        clickBody() {
            this.$emit('custom-event', {
                target: 'pageBox',
                data: null
            })
        },
        getPageBoxHeight(){
            return new Promise(((resolve, reject) => {
                const query = uni.createSelectorQuery().in(this);
                query.select('#gBody').boundingClientRect(data => {
                    resolve(data)
                }).exec();
            }))
        },
        eventHandler(e) {
            this.$emit('custom-event', e);
        },
        redirectBindTel() {
            if (this.manualBind) {
                return
            }
            //#ifdef H5 || MP-TOUTIAO
            // 抖音小程序走H5逻辑)
            if (!this.isSkip &&
                this.$Route.path !== '/kdxMember/bindTel/mobile'
            ) {
                this.startSkip(true)
                // 重置绑定手机号状态
                this.setModal(false)
                this.$Router.auto('/kdxMember/bindTel/mobile')
                setTimeout(() => {
                    this.startSkip(false)
                }, 500)
            }
            //#endif
        },
        redirectLogin() {
            // 当前页面不存在登录弹窗时
            this.setModal(!this.noLogin)
        },
        // 处理店铺打烊
        handleMallClose(error,message) {
            if (this.skiping) return
            this.skiping = true
            setTimeout(() => {
                this.$store.commit('setting/setCloseStatus', true)
                let routes = getCurrentPages()
                let route = routes[routes.length - 1].route;
                message && this.$toast(message)
                if (route !== 'kdxOthers/close/close') {
                    this.$Router.replaceAll({
                        path:'/kdxOthers/close/close',
                        query:{
                            from:'PageBox',
                            error:error
                        }
                    })
                }
                this.skiping = false
            }, 1000)
        },
        // 会员删除后
        handleMemberDelete() {
            this.localStorage.setItem('session-id', '')
            this.sessionStorage.setItem('promiser','')
            if(!this.isRequeseSession) return
            this.isRequeseSession = true
            getSessionId().then(res => {
                this.isRequeseSession = false
                if (res) {
                    this.setLogin(false)
                    this.setBind(false)
                }
            }).catch(()=> {
                this.isRequeseSession = false
            })
        },
        // 处理其他错误请求
        handleOtherError(error,message) {
            let errorToast = true
            if (typeof this.getRequestInfo.requestInfo ?.settings ?.errorToast == 'function') {
                errorToast = this.getRequestInfo.requestInfo ?.settings ?.errorToast()
            } else {
                errorToast = this.getRequestInfo.requestInfo ?.settings ?.errorToast
            }
            if (
                errorToast !== false && error !== -10004
            ) {
                message && this.$toast(message)
            }
        },
        // 没有浏览权限
        handleNoViewPerm(message) {
            if (!navThrottleBar) {
                message && this.$toast(message)
                navThrottleBar = setTimeout(() => {
                    navThrottleBar = null;
                    let len = getCurrentPages().length
                    if (len == 1) {
                        this.$Router.replace({
                            //#ifndef H5
                            path: '/pages/index/index',
                            //#endif
                            //#ifdef H5
                            path: '/'
                            //#endif
                        })
                    } else {
                        this.$Router.back(1)
                    }
                }, 1500)
            } else {
                return
            }
        },
    },
    watch: {
        getRequestInfo: {
            immediate: true,
            handler() {
                let {
                    error,
                    message
                } = this.getRequestInfo ?.result || {}
                if (process.env.NODE_ENV != 'development') {
                    if(error!=0){
                        console.log(error,message,this.getRequestInfo ?.result,'error.message')
                    }
                }
                if (error === NEED_LOGIN_CODE) {
                    this.setLogin(false)
                    this.redirectLogin()
                } else if (error === NEED_BIND_MOBILE_CODE) {
                    this.setBind(false)
                    this.setModal(true)
                } else if (MALL_CLOSE_CODE.includes(error)) {
                    this.handleMallClose(error,message)
                } else if (INVALID_CODE === error) {
                    this.setLogin(false)
                    this.setBind(false)
                } else if(MEMBER_DELETE_CODE.includes(error)) {
                    this.handleMemberDelete()
                } else if (error === 211216 || error === 211217 || error === 211218) {
                    message && this.$toast(message)
                } else if (error === 200704) {
                    this.handleNoViewPerm(message)
                } else if (NO_TOAST.includes(error)) {} else if (error === 531027 ) {} else if (error !== 0) {
                    this.handleOtherError(error,message)
                }
            }
        },
        // #ifndef MP-WEIXIN
        phoneVisible: {
            handler(status) {
                if (status) {
                    this.redirectBindTel()
                }
            }
        },
        // #endif
    },
    beforeDestroy() {
        this.startSkip(false)
    },
}
</script>
<style lang="scss" scoped>
.page-bg {
    height: 100%;
    min-height: 100vh;
}
.index-page {
    background: #eee;
}
.gBody {
    min-height: 100vh;

    &-container {
        overflow-x: hidden;
        padding-bottom: px2rpx(5);
    }
}
.fixedBox {
    height: 100vh;
}
page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.grace-sbody {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
}
.grace-page-header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
}
.grace-page-status-bar {
    width: 100%;
    height: 0;
}
.grace-page-header-nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 44px;
    align-items: center;
}
.grace-header-main {
    width: 300rpx;
    flex: auto;
    overflow: hidden;
}
.grace-page-body {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
}
.grace-page-footer {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99;
}
.gui-page-rb-area {
    width: 100rpx;
    position: fixed;
    right: 20rpx;
    bottom: 100rpx;
    z-index: 100;
}
.my-istop {
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 9999997;
}

.highIndex {
    z-index: 9999999;
}

/deep/ .grace-page-status-bar {
    height: 0;
}
.bottom-loading{
    width: 100%;
    /*height: 100rpx;*/
    padding-bottom: 32rpx;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    font-size:20rpx;
    color: #aaa;
}
</style>
