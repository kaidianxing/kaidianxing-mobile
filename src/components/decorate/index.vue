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
    <div class='decorate-components' v-if="mergeData">
        <Banner :component-data='mergeData' v-if='componentData.id=="banner"' @custom-event='eventHandler'></Banner>
        <MyLineBlank :component-data='mergeData' v-else-if='componentData.id=="blank"||componentData.id=="line"' @custom-event='eventHandler'></MyLineBlank>
        <CommissionSharecodeBlockgroup :component-data='mergeData' v-else-if='componentData.id=="commission_sharecode" || componentData.id=="blockgroup"' @custom-event='eventHandler'></CommissionSharecodeBlockgroup>
        <Coupon :component-data='mergeData' v-else-if='componentData.id=="coupon"' @custom-event='eventHandler'></Coupon>
        <CubeHotArea :component-data='mergeData' v-else-if='componentData.id=="cube"' @custom-event='eventHandler'></CubeHotArea>
        <Customer :component-data='mergeData' v-else-if='componentData.id=="customer"' @custom-event='eventHandler'></Customer>
        <Distributor :component-data='mergeData' v-else-if='componentData.id=="distributor"' @custom-event='eventHandler'></Distributor>
        <Diymenu :component-data='mergeData' v-else-if='componentData.id=="diymenu"' @custom-event='eventHandler'></Diymenu>
        <Fixedsearch :component-data='mergeData' v-else-if='componentData.id=="fixedsearch"' @custom-event='eventHandler'></Fixedsearch>
        <FollowbarFollowpublicaccount :component-data='mergeData' v-else-if='componentData.id=="followbar"' @custom-event='eventHandler'></FollowbarFollowpublicaccount>
        <Goods :component-data='mergeData' v-else-if='componentData.id=="goods"&&mergeData.data.length' @custom-event='eventHandler'></Goods>
        <GotopLayer :component-data='mergeData' v-else-if='componentData.id=="gotop"' @custom-event='eventHandler'></GotopLayer>
        <ListmenuIcongroup :component-data='mergeData' v-else-if='componentData.id=="listmenu" || componentData.id=="icongroup"' @custom-event='eventHandler'></ListmenuIcongroup>
        <Liver  :component-data='mergeData' v-else-if='componentData.id=="liver" && hasConfigSetting("with_live")' @custom-event='eventHandler'></Liver>
        <MyMenuMenu2 :component-data='mergeData' v-else-if='componentData.id=="menu" || componentData.id=="menu2"' @custom-event='eventHandler'></MyMenuMenu2>
        <NoticeDanmu :component-data='mergeData' v-else-if='componentData.id=="notice"' @custom-event='eventHandler'></NoticeDanmu>
        <PicturePictures :component-data='mergeData' v-else-if='componentData.id=="picture"||componentData.id=="pictures"' @custom-event='eventHandler'></PicturePictures>
        <Search :component-data='mergeData' v-else-if='componentData.id=="search"' @custom-event='eventHandler'></Search>
        <Seckill :component-data='mergeData' v-else-if='componentData.id=="seckill"&&mergeData.data.length' @custom-event='eventHandler'></Seckill>
        <TabbarTopmenu :component-data='mergeData' v-else-if='componentData.id=="tabbar" || componentData.id=="topmenu"' @custom-event='eventHandler'></TabbarTopmenu>
        <MyTitleRichtext :component-data='mergeData' v-else-if='componentData.id=="title" || componentData.id=="richtext"' @custom-event='eventHandler'></MyTitleRichtext>
        <MyVideo :component-data='mergeData' v-else-if='componentData.id=="video"' @custom-event='eventHandler'></MyVideo>
        <NoticeModules :component-data='mergeData' v-else-if='componentData.id=="notice_modules"' @custom-event='eventHandler'></NoticeModules>
        <!-- #ifdef MP-WEIXIN -->
        <WxTransaction :component-data='mergeData' v-else-if='componentData.id=="wxTransaction"' @custom-event='eventHandler'></WxTransaction>
        <!-- #endif -->
        <Groups :component-data='mergeData' v-else-if='componentData.id=="groups"&&mergeData.data.length' @custom-event='eventHandler'></Groups>
        <slot></slot>
    </div>
</template>

<script>

    // 全部./components/templates下的模板组件
    // #ifndef H5
    import NoticeModules from '../spin/Notice'
    import Banner from './templates/Banner'
    import MyLineBlank from './templates/MyLine.Blank.vue'
    import CommissionSharecodeBlockgroup from './templates/Commission_sharecode.Blockgroup'
    import Coupon from './templates/Coupon'
    import CubeHotArea from './templates/Cube.Hot_area'
    import Customer from "./templates/Customer";
    import Distributor from './templates/Distributor'
    import Diymenu from './templates/Diymenu'
    import Fixedsearch from './templates/Fixedsearch'
    import FollowbarFollowpublicaccount from './templates/Followbar.Followpublicaccount'
    import Goods from './templates/Goods'
    import GotopLayer from './templates/Gotop.Layer'
    import Liver from './templates/Liver'
    import ListmenuIcongroup from './templates/Listmenu.Icongroup'
    import MyMenuMenu2 from './templates/MyMenu.Menu2'
    import NoticeDanmu from './templates/Notice.Danmu'
    import PicturePictures from './templates/Picture.Pictures.vue'
    import Search from './templates/Search'
    import Seckill from './templates/Seckill'
    import TabbarTopmenu from './templates/Tabbar.Topmenu'
    import MyTitleRichtext from './templates/MyTitle.Richtext'
    import MyVideo from './templates/MyVideo'
    import WxTransaction from './templates/WxTransaction'
    import Groups from './templates/Groups'
    // #endif

    import {
        mapState,
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
        deepMerge,
        deepCopy
    } from '@/common/objectTools.js'

    import eventHandler from './templates-shim/index.js'
    import needUpdate from './loader/needUpdate.js'
    export default {
        // #ifndef H5
        components: {
            NoticeModules,
            Banner,
            MyLineBlank,
            CommissionSharecodeBlockgroup,
            Coupon,
            CubeHotArea,
            Customer,
            Distributor,
            Diymenu,
            Fixedsearch,
            FollowbarFollowpublicaccount,
            Goods,
            GotopLayer,
            ListmenuIcongroup,
            Liver,
            MyMenuMenu2,
            NoticeDanmu,
            PicturePictures,
            Seckill,
            Search,
            TabbarTopmenu,
            MyTitleRichtext,
            MyVideo,
            WxTransaction,
            Groups

        },
        // #endif
        // #ifdef H5
        components: {
            Banner:()=>import('./templates/Banner.vue'),
            MyLineBlank:()=>import('./templates/MyLine.Blank.vue'),
            CommissionSharecodeBlockgroup:()=>import('./templates/Commission_sharecode.Blockgroup.vue'),
            Coupon:()=>import('./templates/Coupon.vue'),
            CubeHotArea:()=>import('./templates/Cube.Hot_area.vue'),
            Customer:()=>import('./templates/Customer.vue'),
            Distributor:()=>import('./templates/Distributor.vue'),
            Diymenu:()=>import('./templates/Diymenu.vue'),
            Fixedsearch:()=>import('./templates/Fixedsearch.vue'),
            FollowbarFollowpublicaccount:()=>import('./templates/Followbar.Followpublicaccount.vue'),
            Goods:()=>import('./templates/Goods.vue'),
            GotopLayer:()=>import('./templates/Gotop.Layer.vue'),
            ListmenuIcongroup:()=>import('./templates/Listmenu.Icongroup.vue'),
            Liver:()=>import('./templates/Liver.vue'),
            MyMenuMenu2:()=>import('./templates/MyMenu.Menu2.vue'),
            NoticeDanmu:()=>import('./templates/Notice.Danmu.vue'),
            PicturePictures:()=>import('./templates/Picture.Pictures.vue'),
            Search:()=>import('./templates/Search.vue'),
            Seckill:()=>import('./templates/Seckill.vue'),
            TabbarTopmenu:()=>import('./templates/Tabbar.Topmenu.vue'),
            MyTitleRichtext:()=>import('./templates/MyTitle.Richtext.vue'),
            MyVideo:()=>import('./templates/MyVideo.vue'),
            NoticeModules:()=>import('../spin/Notice'),
            Groups:()=>import('./templates/Groups.vue'),

        },
        // #endif
        data() {
            return {
                mergeData: null,
                throttle: null,
                cachePageInfo: {}
            }
        },
        watch: {
            pageInfo: {
                immediate: true,
                handler() {
                    if (needUpdate[this.componentData.id] !== false) { //需要实时更新数据的组件
                        this.updateData()
                    }
                }
            },
            componentData: {
                immediate: true,
                handler(value){
                    this.updateData()
                }
            }
        },
        created() {
            if(!this.mergeData){
                this.mergeData = deepCopy(this.componentData);
            }
        },
        computed: {
            ...mapState('decorate', {
                followbar: state => state.followbar
            }),
            ...mapGetters('setting',['hasConfigSetting'])
        },
        props: {
            pageInfo: {
                type: Object,
                default: () => ({})
            },
            componentData: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            updateData() {
                try{
                    if(!this.componentData){
                        return
                    }

                    if(!this.mergeData){
                        this.mergeData = deepCopy(this.componentData);
                    }
                    let data = deepCopy(this.componentData);//模板
                    let updateData = deepCopy(this.pageInfo[data.id])||{};//通用数据
                    let updateData2 =this.pageInfo[data._comIndex_];//私有数据
                    updateData = deepMerge(updateData, updateData2);
                    if (updateData) { //进行页面真实数据的合并
                        if (data ?.data && updateData.data) { //data直接替换
                            data.data = updateData.data;
                        }
                        if (data ?.items && updateData.items) { //items直接替换
                            data.items = updateData.items;
                        }
                        data = deepMerge(data, updateData || {});
                    }

                    // #ifdef H5
                        this.mergeData = data;
                    // #endif
                    // #ifndef H5
                        if (!this.$utils.deepCompare(this.mergeData, data)) {
                            this.mergeData = data;
                        }
                    // #endif
                }catch(e){
                    console.log(e,'updateData');
                }
            },

            eventHandler(e) { //自定义事件处理
                // 预览时关闭点击事件
                if(this.$store.state.decorate.pageQuery.previewId) {//预览状态
                    this.$toast('预览模式')
                    return
                }
                eventHandler.call(this, e)
                    this.$emit('custom-event', e)
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>
