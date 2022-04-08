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

import {
    LazyLoadList
} from '@/components/decorate/loader/LazyLoadList'
export default{
    data() {
        return {
            reachBottom: false,
        }
    },
    watch:{
        pageList: {
            handler() {
                this.listLoader =
                    this.listLoader || new LazyLoadList(this.loadList, this.$decorator.getPageType(this.$Route))
                if (this.pageList ?.length) {

                    this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
                }
            },
        },
    },
    methods: {
        loadList(list) {
            if (list.length>this.lazyLoadList.length) {
                setTimeout(() => {
                    this.reachBottom = false;
                },200)
            }
            // if(!this.lazyLoadList.length&&!list.length){
            //     setTimeout(() => {
            //         this.listLoader.getMore(this.pageList, 0)
            //     },500)
            // }
            this.lazyLoadList = list
            // 页面全部显示时显示底部内容
            if (this.pageList.length === this.lazyLoadList.length) {
                setTimeout(() => {
                    this.reachBottom = true;
                },200)
            }
        },
        touchstart(e){
            this.touchstartY = e.changedTouches?.[0]?.clientY
            this.startScrollTop = this.scrollTop
        },
        touchend(e){
            this.touchendY = e.changedTouches?.[0]?.clientY
            if (this.scrollTop == this.startScrollTop && this.touchendY - this.touchstartY < -50) {
                this.reachBottom=true
            }
        },
        touchmove(e) {
            if (this.reachBottom && this.pageList ?.length) {
                clearTimeout(this.throttle)
                this.throttle = setTimeout(() => {
                    this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
                }, 500)
            }
        },
    },
    computed:{
        getPageList() {
            if (this.showSkeleten) {
                // this.showSkeleten = false
            }
            // console.log(this.lazyLoadList,'>>>>>>>>',this.showSkeleten,this.pageList)
            return this.lazyLoadList
        },
        loadTip() {
            if (this.reachBottom&&this.pageList.length>1) {
                return this.pageList ?.length > 0 &&
                    this.pageList.length == this.lazyLoadList.length ?
                    '已经到底了' :
                    '正在加载...'
            } else {
                return ''
            }
        },

    },
    onLoad() {
        this.scrollTop = 0
        this.listLoader = this.listLoader||new LazyLoadList(this.loadList, this.$decorator.getPageType(this.$Route))
        if(!this.lazyLoadList.length){
            this.listLoader.refresh().getMore(this.pageList, 0,this.lazyLoadList.length)
        }
        //#ifdef H5
        this.listLoader.h5ReachBottom((e) => {
            this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
            this.reachBottom = true
            if (this.pageList ?.length) {
                this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
            }
        })
        //#endif
    },
    onPageScroll(e) {
        if ((e.scrollTop > this.scrollTop + 50) && this.reachBottom) {
            this.reachBottom = false;
        }
        this.scrollTop = Math.max(e.scrollTop,this.scrollTop)
    },
    onReachBottom(e) {
        this.reachBottom = true
        if (this.pageList ?.length) {
            this.listLoader.getMore(this.pageList, this.scrollTop,this.lazyLoadList.length)
        }
    },
}
