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
    <page-box :showSuspension="false" :articleModalStatue="articleModalStatue">
        <view id="article-shot" v-if="perm && !error" class="article-detail" :class="shotHide ? 'padding-b' : ''">
            <view v-if="articleData.top_thumb_type == 0 && articleData.top_thumb">
                <img class="top-thumb" mode="widthFix" :src="$utils.mediaUrl(articleData.top_thumb)" alt=""></img>
            </view>
            <view v-if="articleData.top_thumb_type == 1 && articleData.top_thumb_all.length">
                <Banner ref="banner" :component-data='bannerData'></Banner>
            </view>
            <view class="article">
                <view v-if="articleData.title" class="article-title">
                    <view class="is-top" v-if="articleData.is_top == '1'">
                        置顶
                    </view>
                    {{ articleData.title }}
                </view>
                <view class="article-info">
                    <view class="author">{{articleData.author}}</view>
                </view>
                <view class="article-content">
                    <view v-for="(item, index) in articleData.content" :key="index">
                        <!-- 富文本 -->
                        <my-rich-text v-if="item.type === 'text'" :content='item.value'></my-rich-text>
                        <!-- 商品 -->
                        <GoodsItem v-if="item.type === 'goods' && itemDetail('goods', item.id).id" :article-id="id" :goods-data="itemDetail('goods', item.id)"></GoodsItem>
                        <!-- 优惠券 -->
                        <CouponItem v-if="item.type === 'coupon' && itemDetail('coupons', item.id).coupon_id" :article-id="id" :coupon-data="itemDetail('coupons', item.id)"></CouponItem>
                    </view>
                </view>
                <view class="article-bottom">
                    <view class="article-read">
                        <block v-if="!shotHide && articleData.read_number_status == 1">
                            阅读数
                            <view class="read-num">{{ articleData.read_number > 9999 ? "9999+" : articleData.read_number }}</view>
                        </block>
                    </view>
                    <view class="date">{{articleData.created_at}}</view>
                </view>
            </view>
            <view v-if="!shotHide" class="btn-bottom" :style="{marginBottom:areaBottom+'px'}">
                <view class="layer-group">
                    <view v-if="articleSettings.customer != 0" class="btn" @click="handleCustomer">
                        <!--#ifdef H5-->
                        <i class="icon iconfont-m- icon-m-zujian-kefu"></i>
                        <!--#endif-->
                        <!--#ifdef MP-WEIXIN-->
                        <button v-if="articleSettings.customer == 'wx'" class="channel-list" open-type="contact" hover-class="none">
                            <i class="icon iconfont-m- icon-m-zujian-kefu"></i>
                        </button>
                        <i v-else class="icon iconfont-m- icon-m-zujian-kefu"></i>
                        <!--#endif-->
                    </view>
                    <view v-if="articleData.goods.length" class="btn btn-b" @click="showGoods">
                        <text class="badge">{{articleData.goods.length}}</text>
                        <i class="icon iconfont-m- icon-m-gouwudai"></i>
                    </view>
                    <view @click="download" v-if="showDownload" class="btn">
                        <i class="icon iconfont-m- icon-m-xiazai"></i>
                    </view>
                    <!-- 返回首页 -->
                    <view class="btn" v-if="f" @click="toIndex">
                        <i class="icon iconfont-m- icon-m-xuanzeqishangchengshouye2"></i>
                    </view>
                </view>
                <view class="navbar">
                    <view class="line"></view>
                    <view class="navbar-btn">
                        <view class="navbar-l no-submit">
                            <view v-if="articleData.thumps_up_status == 1" class="navbar-item" @click="thumpsUp">
                                <i class="icon iconfont-m- icon-m-dianzan1-1 actice" v-if="articleData.member_thump_up_status"  :class="show ? 'thumps' : ''"></i>
                                <i class="icon iconfont-m- icon-m-dianzan1" v-else :class="show ? 'thumps' : ''"></i>
                                <view class="nav-text">{{articleData.thumps_up_number > 9999 ? "9999+" : articleData.thumps_up_number}}</view>
                            </view>
                            <view v-if="articleData.share_number != undefined" class="navbar-item" @click="handleShare">
                                <i class="icon iconfont-m- icon-m-fenxiang"></i>
                                <view class="nav-text">{{articleData.share_number > 9999 ? "9999+" : articleData.share_number}}</view>
                            </view>
                            <view class="navbar-item" @click="favorite">
                                <i class="icon iconfont-m-" :class="articleData.is_favorite ? 'icon-m-star actice' : 'icon-m-shoucang'"></i>
                                <view class="nav-text">{{articleData.favorite_count > 9999 ? "9999+" : articleData.favorite_count}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 商品弹出层 -->
            <GoodsModal ref="goodsModal" :goods-list="goodsList" :article-id="id"></GoodsModal>
            <!-- 分享 -->
            <share-modal v-model="showShare" @handlerPoster="posterShow" @handlerShare="addShareNum" @handlerShot="handlerShot" :poster-url="posterUrl"></share-modal>
            <!-- #ifndef MP-TOUTIAO -->
            <poster-modal ref='poster' posterType="article"></poster-modal>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <shot-modal ref='shot' @shotComplete="shotComplete"></shot-modal>
            <!-- #endif -->
        </view>
        <view class="article-empty" v-if="!perm || error">
            <image class="default-img" :src="$utils.staticMediaUrl('default/article.png')"></image>
            {{ errorText }}
        </view>
        <phone-modal :visible="visible" @join="join" @close="visible = false"></phone-modal>
    </page-box>
</template>

<script>
import MyRichText from '@/components/decorate/templates-shim/RichText.vue'
import PageMixin from '@/common/PageMixin.js'
import GoodsItem from "./components/GoodsItem"
import CouponItem from "./components/CouponItem"
import GoodsModal from "./components/GoodsModal"
import ShareModal from "./components/ShareModal"
import PhoneModal from "../join/components/PhoneModal"
import Banner from '@/components/decorate/templates/Banner'
import eventHandler from '@/components/decorate/templates-shim/index.js'
// #ifndef MP-TOUTIAO
import PosterModal from './components/poster/PosterModal'
import { mapState } from 'vuex'
// #endif
// #ifdef H5
import ShotModal from './components/shot/ShotModal'
import {mediaUrl} from "../../common/util";
// #endif
export default {
    mixins: [PageMixin],
    components: {
        GoodsItem,
        CouponItem,
        GoodsModal,
        ShareModal,
        PhoneModal,
        Banner,
        // #ifndef MP-TOUTIAO
        PosterModal,
        // #endif
        // #ifdef H5
        ShotModal,
        // #endif
        MyRichText
    },
    created() {
        this.$loading.showLoading();
    },
    data() {
        return {
            shotHide: false,
            visible: false,
            perm: true,
            id: 0,
            f: 0,
            settings: {},
            articleData: {
                cover: "",
                content: [],
                goods_ids: [],
                goods: []
            },
            goods_ids: [],
            thumps_up_status: 1,
            timer: null,
            reqesting: false,
            show: false,
            goodsList: [],
            showShare: false,
            posterUrl: "",
            error: false,
            inviter_id: 0,
        };
    },
    onShow() {
        this.init()
    },
    onHide() {
        clearTimeout(this.timer)
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    // #ifndef H5
    onShareAppMessage() {
        let url = `/kdxArticle/detail/index?id=${this.id}&f=1&inviter_id=${this.$store.state.login.userInfo.id}`;
        return {
            title: this.articleData.title,
            imageUrl: this.cover,
            path: url,
            success: function () {},
            fail: function () {}
        }
    },
    onShareTimeline(){
        let shareParams = {
            id: this.id,
            f: 1,
            inviter_id: this.$store.state.login.userInfo.id
        };
        return {
            title: this.articleData.title,
            imageUrl: this.cover,
            query: this.$utils.createQueryParams(shareParams)
        }
    },
    watch: {
        '$store.state.login.isLogin': {
            handler() {
                this.init();
            }
        }
    },
    // #endif
    computed: {
        ...mapState(['areaBottom']),
        ...mapState('setting', ['articleSettings']),
        signStatus() {
            return this.articleData?.join_activity_data?.sign_status
        },
        joinDisabled() {
            return (new Date() > new Date(this.articleData?.activity?.activity_end_time.replace(/-/g, "/"))) || (new Date() < new Date(this.articleData?.activity?.activity_start_time.replace(/-/g, "/")))
        },
        signDisabled() {
            return (new Date() > new Date(this.articleData?.activity?.sign_end_time.replace(/-/g, "/"))) || (new Date() < new Date(this.articleData?.activity?.sign_start_time.replace(/-/g, "/")))
        },
        errorText() {
            if(this.perm) {
                return "文章跑丢了"
            }else {
                if(this.error) {
                    return "文章跑丢了"
                }else {
                    return "暂无权限"
                }
            }
        },
        articleModalStatue() {
            return !this.$store.state.login.isLogin
        },
        address() {
            let res = "";
            res = `${this.articleData.activity?.province}${this.articleData.activity?.city}${this.articleData.activity?.area}${this.articleData.activity?.detail}`
            return res
        },
        showDownload() {
            let show = true;
            // #ifdef H5
            show = !this.$utils.is_weixin()
            // #endif
            return show && (this.articleData.download_limit_type == 0 || this.articleData.is_download_auth) && this.articleData.enclosure_status == 1 && this.articleData.enclosure_name
        },
        cover() {
            let cover = this.articleData.cover.split(',');
            return this.$utils.mediaUrl(cover[0])
        },
        bannerData() {
            let imgList = [];
            if(this.articleData?.top_thumb_all?.length) {
                imgList = this.articleData.top_thumb_all.map((item) => {
                    return {
                        "imgurl": item,
                        "linkurl": ""
                    }
                })
            }
            return {
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
                "data": imgList,
                "svg": "tupianlunbo",
                "groupName": "基础组件",
                "yIndex": 2,
                "groupType": "2",
                "typeid": "banner"
            }
        }
    },
    methods: {
        handleCustomer() {
            if(!this.$store.state.login.isLogin) {
                this.$store.commit('login/setModal', true)
                return
            }
            //#ifdef MP-WEIXIN
            if(this.articleSettings.customer == 'wx' ) return
            //#endif
            let event = {}
            event['target'] = "customer/clickItem";
            event['data'] = {
                params: {
                    id: "customer",
                    customer: this.articleSettings.customer,
                    customerChannel: this.articleSettings.customer_channel,
                    customerName: this.articleSettings.customer_name,
                    link_url: this.articleSettings.link_url,
                }
            };
            eventHandler.call(this, event)
        },
        async saveImg() {
            let imgList = [];
            let text = "";
            this.articleData.content.forEach((item) => {
                if(item.type === 'text') {
                    text += item.value
                }
            })
            let textList = text.split(/<img /);
            textList.forEach((item) => {
                if(item.indexOf('src="') !== -1) {
                    let img = item.substring(item.indexOf(`src="`) + 5, item.indexOf(`" />`));
                    imgList.push(img);
                }
            })
            if(imgList.length > 0) {
                uni.showLoading({title: '保存中'})
                for(let i = 0; i < imgList.length; i++) {
                    await this.saveImage(this.$utils.mediaUrl(imgList[i]))
                }
                uni.hideLoading()
                this.$toast('保存成功')
            }
        },
        saveImage(url) {
            return new Promise((resolve) => {
                uni.downloadFile({
                    url: url,
                    success: res => {
                        uni.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: () => {
                                resolve()
                            },
                            fail: (e) => {
                                console.log(e, "-----saveImageToPhotosAlbum")
                                uni.hideLoading();
                                this.$toast('保存失败')
                            }
                        })
                    },
                    fail: (e) => {
                        console.log(e, "-----downloadFile")
                        uni.hideLoading();
                        this.$toast('保存失败')
                    }
                })
            })
        },
        async download() {
            let url = this.$utils.mediaUrl(this.articleData.enclosure_name);
            console.log(url, 99)
            let nameArr = this.articleData.enclosure_name.split("/")
            let name = nameArr[nameArr.length - 1]
            // #ifndef H5
            uni.downloadFile({
                url: url,
                success: (res) => {
                    console.error(res, "downloadFile")
                    let typeArr = res.tempFilePath.split(".");
                    let type = "";
                    console.log(typeArr)
                    if(typeArr.length) {
                        type = typeArr[1]
                    }
                    let img = ["jpg", "png", "mpg", "gif"]
                    let video = ["mp3", "mp4"]
                    let file = ["doc", "docx", "xls", "xlsx", "pdf", "ppt"]
                    if(img.includes(type)) {
                        uni.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function () {
                                uni.showToast({
                                    title: '保存成功'
                                })
                            },
                            fail: (res3) => {
                                console.error(res3, "fail")
                            },
                            complete: (res3) => {
                                console.error(res3, "complete")
                            },
                        });
                    }else if(video.includes(type)) {
                        uni.saveVideoToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success: function () {
                                uni.showToast({
                                    title: '保存成功'
                                })
                            },
                            fail: (res3) => {
                                console.error(res3, "fail")
                            },
                            complete: (res3) => {
                                console.error(res3, "complete")
                            },
                        });
                    }else if(file.includes(type)) {
                        uni.getFileSystemManager().saveFile({
                            tempFilePath: res.tempFilePath,
                            filePath: wx.env.USER_DATA_PATH + "/" + name,
                            success: (res2) => {
                                console.error(res2, "saveFile")
                                uni.openDocument({
                                    filePath: res2.savedFilePath,
                                    showMenu: true,
                                    success: function (res3) {
                                        console.log(res3,'打开文档成功');
                                    },
                                    fail: (res3) => {
                                        console.error(res3, "fail")
                                    },
                                    complete: (res3) => {
                                        console.error(res3, "complete")
                                    },
                                });
                            },
                            fail: (res2) => {
                                console.error(res2, "fail")
                            },
                            complete: (res2) => {
                                console.error(res2, "complete")
                            },
                        })
                    }
                },
                fail: (res) => {
                    console.error(res, "fail")
                },
                complete: (res) => {
                    console.error(res, "complete")
                },
            })
            // #endif
            // #ifdef H5
            this.downloadH5(url, name)
            // #endif
        },
        async downloadH5(url, name) {
            let response = await fetch(url)
            // 内容转变成blob地址
            let blob = await response.blob()
            // 创建隐藏的可下载链接
            let objectUrl = window.URL.createObjectURL(blob)
            let a = document.createElement('a')
            //地址
            a.href = objectUrl
            //修改文件名
            a.download = name
            // 触发点击
            document.body.appendChild(a)
            a.click()
            //移除
            setTimeout(() => document.body.removeChild(a), 1000)
        },
        // 报名
        handlerJoin() {
            if(this.joinDisabled) {
                return
            }
            if(this.articleData?.activity?.check_form == 1 && this.$store.state.setting.pluginsPerms.diyform) {
                this.$Router.auto({
                    path: "/kdxArticle/join/index",
                    query: {
                        id: this.articleData.id,
                        form_id: this.articleData?.activity?.form_id,
                        check_mobile: this.articleData?.activity?.check_mobile
                    }
                })
                return
            }
            if((this.articleData?.activity?.check_form == 0 || !this.$store.state.setting.pluginsPerms.form) && this.articleData?.activity?.check_mobile == 1) {
                this.visible = true;
                return
            }
            this.join()
        },
        join() {
            this.$api.articleApi.join({
                id: this.articleData.id
            }).then((res) => {
                if(res.error === 0) {
                    this.$toast("报名成功")
                    this.getArticleDetail()
                }
            })
        },
        // 取消报名
        handlerCancel() {
            this.$api.articleApi.cancelJoin({
                id: this.articleData.id
            }).then((res) => {
                if(res.error === 0) {
                    this.$toast("取消成功")
                    this.getArticleDetail()
                }
            })
        },
        // 签到
        handlerSign() {
            if(this.signDisabled) {
                return
            }
            this.$api.articleApi.sign({
                id: this.articleData.id
            }).then((res) => {
                if(res.error === 0) {
                    this.$toast("签到成功")
                    this.getArticleDetail()
                }
            })
        },
        // 收藏
        favorite() {
            if(!this.reqesting) {
                this.reqesting = true;
                let resStatus = this.articleData.is_favorite;
                let api = "addFavorite";
                if(resStatus) {
                    api = "cancelFavorite";
                }
                if(api=='cancelFavorite') {
                    this.$api.articleApi[api]({
                        article_id: this.id,
                    }).then((res) => {
                        if(res.error === 0) {
                            this.articleData.is_favorite = !(this.articleData.is_favorite)
                            if(!resStatus) {
                                this.articleData.favorite_count++
                            }else {
                                this.articleData.favorite_count--
                            }
                        }
                    }).finally(() => {
                        this.reqesting = false;
                    })
                }else {
                    this.$api.articleApi[api]({
                        article_id: this.id,
                    }).then((res) => {
                        if(res.error === 0) {
                            this.articleData.is_favorite = !(this.articleData.is_favorite)
                            if(!resStatus) {
                                this.articleData.favorite_count++
                            }else {
                                this.articleData.favorite_count--
                            }
                        }
                    }).finally(() => {
                        this.reqesting = false;
                    })
                }
            }
        },
        // 打开地图
        openLocation() {
            let data = {
                latitude: this.articleData.activity.lat,
                longitude: this.articleData.activity.lng,
                title: this.articleData.activity.detail,
                province: this.articleData.activity.province,
                city: this.articleData.activity.city,
                area: this.articleData.activity.area,
                address: this.articleData.activity.detail,
            }
            this.$utils.openMapLocation(data)
        },
        // 拨打电话
        makePhoneCall() {
            uni.makePhoneCall({
                phoneNumber: this.articleData.activity.telephone
            })
        },
        init() {
            this.settings = this.$store.state.setting.articleSettings;
            if(this.settings) {
                uni.setNavigationBarTitle({
                    title: this.settings?.title ? this.settings.title : "专题文章"
                })
            }
            this.id = this.$Route.query?.id || 0;
            this.f = this.$Route.query?.f || 0;
            this.inviter_id = this.$Route.query?.inviter_id || 0;
            // #ifndef H5
            // 处理扫小程序码进入文章详情
            if (this.$Route?.query?.scene) {
                let scene = decodeURIComponent(this.$Route?.query?.scene)
                let paramsArr = scene.split('&')
                let idParams = paramsArr.filter(item => item.indexOf('id')>-1 && item.indexOf("inviter_id") ==-1)
                if (idParams?.length) {
                    this.id = idParams?.[0]?.split('=')?.[1]
                }
                let fParams = paramsArr.filter(item => item.indexOf('f=')>-1)
                if (fParams?.length) {
                    this.f = fParams?.[0]?.split('=')?.[1]
                }
                let inviterParams = paramsArr.filter(item => item.indexOf('inviter_id=')>-1)
                if (fParams?.length) {
                    this.inviter_id = inviterParams?.[0]?.split('=')?.[1];
                }
            }
            // #endif
            this.getArticleDetail().then(() => {
                this.setPosterData()
            })
            this.sendReward();
        },
        // 文章详情
        getArticleDetail() {
            this.$loading.showLoading();
            return this.$api.articleApi.getArticleDetail({
                id: this.id
            }, {cache: 1}).then(async (res) => {
                // if (this.$store.state.login.isLogin) {
                // }
                this.$loading.hideLoading();
                if(res.error === 0) {
                    this.error = false;
                    this.perm = true;
                    res.data.top_thumb_all = JSON.parse(res.data.top_thumb_all)
                    this.articleData = res.data;
                    if(res.data.content) {
                        this.articleData.content = JSON.parse(res.data.content);
                    }
                    let contentGoods = this.articleData.content.filter((item) => {
                        return item.type === "goods"
                    })
                    let goodsArr = []
                    contentGoods.forEach((item) => {
                        let res = this.itemDetail("goods", item.id);
                        if(res.id) {
                            goodsArr.push(res)
                        }
                    })
                    this.goodsList = goodsArr;
                    this.posterUrl = res.data.poster_url;
                    // #ifdef H5
                    this.setShareInfo(res.data);
                    // #endif
                    if(this.articleData?.activity?.check_mobile == 1) {
                        this.$store.dispatch('member/getBasicInfo')
                    }
                }else if(res.error === 531027) {
                    this.perm = false;
                }else {
                    this.error = true;
                }
            })
        },
        setPosterData() {
            let title = this.articleData.title;
            let digest = this.articleData.digest;
            if(title?.length > 40) {
                title = title.substr(0, 40) + "..."
            }
            if(digest?.length > 40) {
                digest = digest.substr(0, 40) + "..."
            }
            let posterData = {
                thumb: this.cover,
                title,
                digest,
                poster_url: this.articleData.poster_url,
                id: this.articleData.id
            }
            this.$store.commit('posterData/setPosterData', posterData);
        },
        setShareInfo(res) {
            if (!this.$utils.is_weixin()) {
                return
            }

            let articleUrl = this.articleData.poster_url;
            let shareInfo = {};
            if (this.$app_isW7) {
                // 微擎版-单独处理url
                let url = window.location.href;
                let settings_location_url = window.location.href || url;
                let location_href = this.$utils.operationSystem() == 'ios' ? settings_location_url : url; //第一次进入页面时的url
                shareInfo = {
                    title: res.title,
                    logo: this.cover,
                    link: articleUrl,
                    sdkUrl: location_href.split('#')[0] + '#' + location_href.split('#')[1],
                    description: res.digest,
                };
            }else {
                shareInfo = {
                    title: res.title,
                    logo: this.cover,
                    link: articleUrl,
                    sdkUrl: window.location.href,
                    description: res.digest,
                };
            }
            console.log(shareInfo, '文章shareInfo<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            this.$utils.getShareInfo(shareInfo);
        },
        // 发送转发奖励
        sendReward() {
            if(this.f) {
                this.timer = setTimeout(() => {
                    if(this.$store.state.login.isLogin) {
                        this.$api.articleApi.sendReward({
                            id: this.id,
                            article_share_member_id: this.inviter_id
                        }, {errorToast: false}).then((res) => {
                            if(res.error === 0) {
                                this.articleData = res.data;
                                this.articleData.content = JSON.parse(res.data.content)
                            }
                        })
                    }
                }, Number(this.settings.reward_time_limit) * 1000)
            }
        },
        showGoods() {
            this.$refs.goodsModal.toggle();
        },
        // 商品，优惠券信息
        itemDetail(type, id) {
            let res = {};
            this.articleData[type].forEach((item) => {
                if(type === "goods") {
                    if(id === item.id) {
                        res = item
                    }
                }else {
                    if(id === item.coupon_id) {
                        res = item
                    }
                }
            })
            return res
        },
        // 分享
        handleShare() {
            this.showShare = true;
        },
        // 分享海报
        posterShow() {
            this.showShare = false;
            this.$refs.poster && this.$refs.poster.toggle(show => {
                console.log("toggle", show);
            });
        },
        // 文章快照
        handlerShot() {
            this.showShare = false;
            this.shotHide = true;
            console.log('handlerShot------start')
            this.$refs.shot && this.$refs.shot.toggle(show => {
                console.log("toggle", show);
            });
            console.log('handlerShot------end')
        },
        shotComplete() {
            this.shotHide = false;
        },
        // 增加分享数
        addShareNum() {
            this.$api.articleApi.increaseShare({
                id: this.id
            });
        },
        // 点赞
        thumpsUp() {
            if(!this.reqesting) {
                this.reqesting = true;
                let resStatus = Number(!Number(this.articleData.member_thump_up_status));
                this.$api.articleApi.articleThumpsUp({
                    id: this.id,
                    status: resStatus
                }).then((res) => {
                    if(res.error === 0) {
                        this.articleData.member_thump_up_status = resStatus
                        if(resStatus) {
                            this.articleData.thumps_up_number++
                        }else {
                            this.articleData.thumps_up_number--
                        }
                    }
                }).finally(() => {
                    this.reqesting = false;
                })
            }
        },
        // 返回首页
        toIndex() {
            this.$Router.push({
                path: '/pages/index/index',
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.article-detail {
    position: relative;
    min-height: 100vh;
    background: #fff;
    padding-bottom: px2rpx(104);
    &.padding-b {
        padding-bottom: 0;
    }
    .top-thumb {
        display: block;
        width: 100vw;
        margin-bottom: px2rpx(6);
    }
    .article {
        padding: px2rpx(16);
        &.activity {
            padding-bottom: px2rpx(74);
        }
        ul, li{
            width: auto!important;
        }
    }
    .article-title {
        font-weight: bold;
        line-height: px2rpx(28);
        font-size: px2rpx(18);
        margin-bottom: px2rpx(12);
        .is-top {
            display: inline-block;
            width: px2rpx(32);
            height: px2rpx(18);
            line-height: px2rpx(18);
            text-align: center;
            font-weight: normal;
            color: #fff;
            background: $uni-color-primary;
            border-radius: px2rpx(2);
            margin-right: px2rpx(5);
            margin-top: px2rpx(5);
            vertical-align: top;
            font-size: px2rpx(12);
        }
    }
    .article-info {
        display: flex;
        justify-content: space-between;
        line-height: px2rpx(17);
        color: $uni-text-color-grey;
        margin-bottom: px2rpx(24);
        view, text {
            font-size: px2rpx(12)!important;
        }
        .author {
            &.text {
                margin-right: px2rpx(4);
                color: #969696;
            }
            &.num {
                color: #565656;
            }
        }
    }
    .article-activity {
        display: flex;
        font-size: px2rpx(12);
        color: #565656;
        margin-bottom: px2rpx(8);
        view, text {
            font-size: px2rpx(12)!important;
        }
        .address {
            width: calc(100% - 130rpx);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .iconfont-m- {
            font-size: px2rpx(14);
            width: px2rpx(18);
            height: px2rpx(18);
            border-radius: 50%;
            text-align: center;
            line-height: px2rpx(18);
            background: #FFF3F5;
            color: #FF3C29;
            margin-left: px2rpx(8);
        }
    }
    .article-content {
        font-weight: normal;
        margin-bottom: px2rpx(24);
        /deep/ img {
            max-width: 100% !important;
        }
        /deep/ ul {
            display: block;
            list-style-type: disc;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
            li {
                display: list-item;
                text-align: -webkit-match-parent;
                list-style-type: disc;
            }
        }
        /deep/ table {
            width: 100%!important;
        }
        /deep/ ol {
            display: block;
            list-style-type: disc;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
            li {
                display: list-item;
                text-align: -webkit-match-parent;
                list-style-type: decimal;
            }
        }
    }
    .article-bottom {
        display: flex;
        justify-content: space-between;
        line-height: px2rpx(16);
        color: #969696;
        view, text{
            font-size: px2rpx(12)!important;
        }
        .article-read {
            display: flex;
        }
        .read-num {
            margin-left: px2rpx(4);
        }
    }
    .article-bottom-btn {
        line-height: px2rpx(36);
        margin-top: px2rpx(24);
        text-align: center;
        color: #FF3C29;
        border: px2rpx(1) solid #FF3C29;
        border-radius: px2rpx(30);
    }
    .btn-group {
        position: fixed;
        bottom: px2rpx(24);
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 0 px2rpx(12);
        .btn {
            height: px2rpx(56);
            background: rgba($color: #fff, $alpha: 0.8);
            filter: drop-shadow(0 0 12rpx rgba(0, 0, 0, 0.15));
            border-radius: px2rpx(6);
            &.btn-l {
                width: fit-content;
                padding: px2rpx(12);
                display: flex;
                .goods-modal-icon {
                    display: inline-block;
                    width: px2rpx(32);
                    height: px2rpx(32);
                    position: relative;
                    border-radius: 50%;
                    color: #fff;
                    text-align: center;
                    line-height: px2rpx(32);
                    margin-right: px2rpx(8);
                    &:last-child {
                        margin-right: 0;
                    }
                    .icon {
                        color: #fff;
                        font-size: px2rpx(18);
                    }
                    .icon-goods {
                        color: #FF3C29;
                        font-size: px2rpx(32);
                    }
                    .badge {
                        position: absolute;
                        top: px2rpx(-9);
                        right: px2rpx(-9);
                        width: px2rpx(28);
                        height: px2rpx(28);
                        background: #FF3C29;
                        border-radius: 50%;
                        border: px2rpx(2) solid #fff;
                        color: #fff;
                        font-size: px2rpx(14);
                        text-align: center;
                        line-height: px2rpx(26);
                        transform: scale(.5);
                    }
                }
            }
            &.btn-r {
                display: flex;
                justify-content: space-between;
                padding: px2rpx(10) px2rpx(12) px2rpx(8);
                color: $uni-text-color-grey;
                .thumps, .share {
                    display: flex;
                    min-width: px2rpx(31);
                    flex-direction: column;
                    margin-right: px2rpx(8);
                    text-align: center;
                    font-size: px2rpx(10);
                    line-height: px2rpx(14);
                    transition: .3s;
                    transform: scale(1);
                    &:last-child {
                        margin-right: 0;
                    }
                }
                .thumps .thumps{
                    transform: scale(1.5);
                }
                .icon {
                    font-size: px2rpx(24);
                    line-height: px2rpx(24);
                    color: $uni-color-primary;
                }
            }
        }
        img {
            width: px2rpx(32);
            height: px2rpx(32);
        }
    }
    .btn-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        .layer-group {
            position: absolute;
            bottom: px2rpx(68);
            right: px2rpx(14);
            .btn {
                width: px2rpx(40);
                height: px2rpx(40);
                text-align: center;
                line-height: px2rpx(40);
                box-shadow: 0px 0px 10px rgba(97, 97, 97, 0.2);
                border-radius: 50%;
                background: #fff;
                margin-bottom: px2rpx(8);
                .icon {
                    color: #FF3C29;
                    font-size: px2rpx(26);
                }
                &.btn-b {
                    position: relative;
                    .badge {
                        position: absolute;
                        top: -8rpx;
                        right: -4rpx;
                        width: px2rpx(28);
                        height: px2rpx(28);
                        background: #FF3C29;
                        border-radius: 50%;
                        border: px2rpx(2) solid #fff;
                        color: #fff;
                        font-size: px2rpx(18);
                        text-align: center;
                        line-height: px2rpx(25);
                        transform: scale(.5);
                    }
                }
            }
        }
        .navbar {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: #fff;
            .line {
                position: absolute;
                bottom: px2rpx(52);
                height: px2rpx(0.5);
                background: #E6E7EB;
                width: 100%;
            }
            .navbar-btn {
                display: flex;
                height: px2rpx(52);
                padding: px2rpx(3) px2rpx(8);
                .navbar-l {
                    display: flex;
                    justify-content: center;
                    text-align: center;
                    &.no-submit {
                        flex: 1;
                        justify-content: space-around;
                    }
                    .navbar-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        height: px2rpx(46);
                        width: px2rpx(46);
                        line-height: px2rpx(14);
                        color: #565656;
                        .nav-text {
                            font-size: px2rpx(20);
                            transform: scale(0.5);
                            width: px2rpx(46);
                            height: px2rpx(14);
                            white-space: nowrap;
                            text-align: center;
                        }
                    }
                    .iconfont-m- {
                        font-size: px2rpx(22);
                        height: px2rpx(22);
                        line-height: px2rpx(22);
                    }
                }
                .navbar-r {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    margin: px2rpx(4) 0 px2rpx(4) px2rpx(6);
                    height: px2rpx(38);
                    line-height: px2rpx(38);
                    text-align: center;
                    .join-btn {
                        flex: 1;
                        background: #FF3C29;
                        color: #fff;
                        font-size: px2rpx(14);
                        font-weight: bold;
                        border-radius: px2rpx(30);
                        &.cancel-btn {
                            background: #FFF3F5;
                            color: #FF3C29;
                            margin-right: px2rpx(6);
                        }
                        &.disabled {
                            background: #eee;
                            color: #ccc;
                        }
                    }
                }
            }
        }
        img {
            margin-top: px2rpx(10);
            width: px2rpx(20);
            height: px2rpx(20);
        }
    }
}
.article-empty {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    width: 100%;
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

.to-index {
    position: fixed;
    bottom: px2rpx(90);
    right: px2rpx(14);
    width: px2rpx(36);
    height: px2rpx(36);
    line-height: px2rpx(36);
    text-align: center;
    background-color: #fff;
    box-shadow: 0 0 px2rpx(4) rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    .icon-m-dibudaohang-home {
        font-size: px2rpx(24);
        color: $uni-color-primary;
    }
}
/deep/.uni-video-cover {
    z-index: 0;
}
.actice {
    color: #ff3c29;
}
.channel-list {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border: 0;
    background: transparent;
    &::after {
        display: none;
    }
}
</style>
