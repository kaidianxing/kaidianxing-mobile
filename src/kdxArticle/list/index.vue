/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <page-box :showDiymenu="settings.bottom_menu == 1">
        <view class="pages">
            <search @search="handlerSearch"></search>
            <view class="list-banner" v-if="bannerData.data.length">    
                <Banner ref="banner" :component-data='bannerData' @custom-event='handleClick'></Banner>
            </view>
            <view v-if="menuData.data.length">    
                <GroupMenu :component-data='menuData' :background="background" @custom-event='handleClick'></GroupMenu>
            </view>
            <small-img-list v-if="settings.template_type == '1'" :settings="settings" :list="list"></small-img-list>
            <waterfall-list v-if="settings.template_type == '2'" :settings="settings" :list="list"></waterfall-list>
            <!--加载更多  -->
            <page-loading v-if="settings.template_type == '1' && list.length != total" :loadingType="loadingType"></page-loading>
            <view class="list-empty" v-if="list.length === 0 && !loading">
                <image class="default-img" :src="$utils.staticMediaUrl('default/article.png')" />
                暂无文章
            </view>
        </view>
    </page-box>
</template>

<script>
import Banner from '@/components/decorate/templates/Banner'
import GroupMenu from './components/GroupMenu'
import PageMixin from '@/common/PageMixin'
import SmallImgList from "./components/SmallImgList"
import WaterfallList from "./components/WaterfallList"
import Search from "./components/Search"
import {articleApi} from "../../api/article";

export default {
    mixins: [PageMixin],
    components: {
        Banner,
        GroupMenu,
        SmallImgList,
        WaterfallList,
        Search
    },
    options: { styleIsolation: "shared" }, //小程序样式穿透
    data() {
        return {
            search: {
                title: "",
                code: ""
            },
            settings: {
                template_type: "1",
                title: "",
                banner: [],
                bottom_menu: "0"
            },
            group_id: "",
            list: [],
            total: 0,
            page: 0,
            page_size: 10,
            loading: true,
            currentGroup: 0,
            menuData: {
                "id": "topmenu",
                "type": "topmenu",
                "name": "顶部菜单",
                "istop": 1,
                "max": 1,
                "global": true,
                "params": {
                    "current": 0
                },
                "style": {
                    "activebgcolor": "#ffffff",
                    "textcolor": "#212121",
                    "activecolor": "#ff3c29"
                },
                "data": [
                    {
                        "title": "全部",
                        "linkurl": "",
                    },
                ],
                "svg": "dingbudaohang",
                "groupName": "基础组件",
                "yIndex": 2,
                "groupType": "2",
                "color": "#2d8cf0"
            },
            bannerData: {
                "id": "banner",
                "type": "banner",
                "name": "图片轮播",
                "params": [],
                "style": {
                    "dotstyle": "round",
                    "dotalign": "center",
                    "background": "#ffffff",
                    "leftright": "24",
                    "bottom": "16",
                    "opacity": "0.54",
                    "imgheight": 161.230376515635,
                    "topradius": 20,
                    "bottomradius": 20,
                    "margintop": 16,
                    "marginbottom": 16,
                    "marginleft": 24
                },
                "data": [],
                "svg": "tupianlunbo",
                "groupName": "基础组件",
                "yIndex": 2,
                "groupType": "2",
                "typeid": "banner"
            }
        };
    },
    watch: {
        banner(newVal) {
            this.bannerData.data = newVal.filter((item) => {
                return item.linkurl || item.imgurl
            })
        }
    },
    // #ifndef H5
    onShareAppMessage() {
        let url = `/kdxArticle/list/index`;
        return {
            title: this.settings?.title ? this.settings.title : "专题文章",
            path: url,
            success: function () {},
            fail: function () {}
        }
    },
    onShareTimeline(){
        return {
            title: this.settings?.title ? this.settings.title : "专题文章",
        }
    },
    // #endif
    computed: {
        loadingType() {
            let loadingType = 0;
            if (this.loading) {
                loadingType = 1
            } else if (this.list.length == this.total && this.total > 0 && this.loading == false) {
                loadingType = 2
            }
            return loadingType
        },
        background() {
            return "#ffffff"
        },
    },
    mounted() {
        this.getGroupList();
        this.getList();
    },
    onShow() {
        this.settings = this.$store.state.setting.articleSettings;
        uni.setNavigationBarTitle({
            title: this.settings?.title ? this.settings.title : "专题文章"
        })
        this.bannerData.data = this.settings?.banner.filter((item) => {
            return item.linkurl || item.imgurl
        })
        this.$nextTick(() =>{
            if(this.bannerData.data.length) {
                this.$refs.banner.setSettings({
                    autoplaySpeed: 3000,
                    autoplay: false,
                    loop: true
                },)
            }
        })
        this.setShareInfo()
    },
    methods: {
        handlerSearch(data) {
            this.search = data;
            this.page = 1;
            this.list = [];
            this.getArticleList()
        },
        setShareInfo() {
            if (!this.$utils.is_weixin()) {
                return
            }
            let articleUrl = window.location.href;
            let shareInfo = {};
            shareInfo = {
                title: this.settings?.title ? this.settings.title : "专题文章",
                link: articleUrl,
                sdkUrl: window.location.href,
            };
            this.$utils.getShareInfo(shareInfo);
        },
        getList() {
            if(!this.reqesting) {
                this.page = this.page + 1;
                this.getArticleList()
            }
        },
        getArticleList() {
            this.reqesting = true;
                this.loading = true;
                let group_id = [];
                if(this.group_id) {
                    group_id.push(this.group_id)
                }
            this.$api.articleApi.getArticleList({
                    ...this.search,
                    ...this.search,
                    ...this.search,
                    ...this.search,
                    page: this.page,
                    pagesize: this.page_size,
                    group_id,
                    status: 1
                }).then((res) => {
                    if(res.error === 0) {
                        this.list = this.list.concat(res.list);
                        this.total = res.total;
                    }
                    this.loading = false;
                    this.reqesting = false
                }).catch(res=>{
                    this.reqesting = false
                })
        },
        getGroupList() {
            this.$api.articleApi.getGroupList().then((res) => {
                if(res.error === 0) {
                    let resArr = res.data.list.map((item) => {
                        return {
                            "title": item.name,
                            "linkurl": item.id,
                        }
                    })
                    this.menuData.data = [{ "title": "全部", "linkurl": ""}].concat(resArr)
                }
            })
        },
        handleClick(e) {
            if(e.target === "banner/clickImg") {
                if (e.data.linkurl) {
                    this.$Router.push(e.data.linkurl)
                    return;
                }
            }else if(e.target === "topmenu/clickItem"){
                this.menuData.params.current = e.data.key;
                this.group_id = e.data.value.linkurl;
                this.list = [];
                this.page = 0;
                this.getList();
            }
        },
        onPullDownRefresh() {
            this.list = [];
            this.page = 0;
            this.getList();
            setTimeout(() => {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        onReachBottom() {
            if (this.list.length == this.total && this.page > 1) return;
            this.getList()
        },
        //页面滚动时启动懒加载
        //此处如果图片在滚动区域内则监听滚动区域事件并传递 滚动区域的 scrollTop 值给 load函数
        onPageScroll(e) {
            this.graceLazyload.load(e.scrollTop, this);
        },
    },
};
</script>
<style lang='scss' scoped>
.pages {
    height: 100vh;
    padding-top: px2rpx(48);
    display: flex;
    flex-direction: column;
}
.list {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #fff;
    &.fixed {
        padding-top: px2rpx(40);
        background: transparent;
    }
}
.list-banner {
    background: #fff;
}
.fixed-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
}
.list-empty {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: calc();
    font-size: px2rpx(16);
    color: #565656;
    background: #fff;
    border: px2rpx(1) solid #E6E7EB;
    .default-img {
        width: px2rpx(90);
        height: px2rpx(90);
        margin-bottom: px2rpx(16);
    }
}
/deep/.active {
    font-size: px2rpx(14);
}
</style>