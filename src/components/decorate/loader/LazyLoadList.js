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
/**
 * 用于页面组件懒加载
 */
import {
    deepCompare,
    deepCopy
} from '@/common/objectTools.js'
import Calculater from './Calculater.js'
import $decorator from '@/common/decorator'

export class LazyLoadList {
    pageInfo = {};
    pageList = [];
    showingList = [];
    cacheCallbacks = null;
    screenHeight = 0;
    px2upx = 1;
    container = null;
    checkDistance = false;
    scrollTop = -1;
    newAddPageBoxHeight=0;//期望增加页面高度rpx
    hodedPageHeight=0;//期望的页面高度
    pageBoxHeight=0;//当前页面实际总高度rpx
    pageType = -1;
    loader = null;
    throttleCheckPageList = null;
    throttleGetMore=null;
    screenHeightPx=null
    lastLazyComponent = null;//最后一个组件如果是懒加载并且还没结束
    lastLazyComponentIdx=-1;
    isNotLazyCom={}//是否懒加载组件
    constructor(callback, pageType) {
        this.loader = new Calculater($decorator.getPage(pageType).pageInfo)
        this.pageType = pageType
        //#ifdef H5
        this.container = document.getElementsByClassName('decorate-page')
        //#endif
        this.px2upx = uni.upx2px(10) / 10
        if (callback) {
            this.cacheCallbacks = callback
        }
        $decorator.$off('getPageBoxHeight')
        $decorator.$on('getPageBoxHeight',data=>{//这里获得页面的真实数据，用来矫正估算的值
            this.checkPageList()
        })
    }
    getSysInfo() {
        let that = this;
        return new Promise(((resolve, reject) => {
            if (that.screenHeight) {
                resolve(that.screenHeight)
            }
            uni.getSystemInfo({
                success: function(res) {
                    that.screenHeightPx=res.windowHeight
                    that.screenHeight = res.windowHeight / res.windowWidth * 750;
                    resolve(that.screenHeight)
                }
            });
        }))
    }
    initPageList(list) {
        if (!deepCompare(this.pageList, list)) {
            this.showingList = []
            this.pageList = [...list]
            this.scrollTop= 0
            this.newAddPageBoxHeight=0;
            this.hodedPageHeight=0;
            this.lastLazyComponent=null;
            this.lastLazyComponentIdx=-1
            this.isNotLazyCom={};
            let page=$decorator.getPage(this.pageType)
            $decorator.onGetMorePageList([...(page.isBottom||[]),...(page.isTop||[]),...(page.isFixed||[])],this,this.pageType);
        }
    }
    refresh() {
        this.scrollTop = 0
        this.pageList = [];
        this.showingList = [];
        this.newAddPageBoxHeight=0;
        this.hodedPageHeight=0;
        this.lastLazyComponent=null;
        this.lastLazyComponentIdx=-1
        this.isNotLazyCom={}
        return this
    }
    async lazyComponent(item){//判断是否是懒加载组件，懒加载组件是指组件内部有懒加载功能的组件；
        let loadAll = null;
        let res= true;
        let tmp=$decorator.getModule(item.id)
        loadAll=tmp?.onLoadAll?.(item,this.pageType);//如果该组件有onLoadAll方法，且返回值是Promise
        if(loadAll&&loadAll instanceof Promise){
            try{
                res= await loadAll;//如果Promise对象正常返回值就说明懒加载完毕
                if(res){
                    return
                }else if(typeof tmp.onLoadMore=='function'){ //如果返回值有问题，并且有onLoadMore方法就说明该组件还没加载完毕
                    this.lastLazyComponent = tmp
                    return item
                }
            }catch(err){ 
                return
            }
        }  
        return
    }
    async getComponentsLength(list, newAddHeight,start=0) { //估算需要组件列表的长度

        let len = 0;
        let top = 0;
        let tmp = null;
        for (let k = start; k < list.length; k++) {
            tmp = list[k];
            if(!this.isNotLazyCom[k]){//查看懒加载组件的记录，不再重复检查
                this.isNotLazyCom[k]=true
                try{
                    await this.lazyComponent(tmp);//先判断组件是否是懒加载组件
                }catch(err){
                    this.lastLazyComponent =null;
                    this.lastLazyComponentIdx=-1;
                }
                if(this.lastLazyComponent){//如果是就停止判断
                    this.lastLazyComponentIdx=k
                    this.isNotLazyCom[k]=false
                }
            }
            if (typeof this.loader[tmp.id] == 'function') {
                top += this.loader[tmp.id](tmp); //估算当前组件列表的总高度
            }else{
                console.error(`请完善组件：${tmp.id}对应的./Calculater.js中尺寸计算功能！！`)
            }
            if (top >= newAddHeight) { 
                len = k+1;
                if(start==0){
                    this.hodedPageHeight=top;//修正估算高度
                }
                break;
            }
        }
        len = Math.min(len, list.length) || list.length; //全部组件的总高度小于滚动高度+屏高
        
        return len;
    }
    getNewAddNum(more=500) {//more是至每次页面高度至少要新增的高度
        let newAddHeight = 0;
        let newAddNum = 0;
        let tmp = null;
        for (let i = this.showingList.length; i <= this.pageList.length; i++) {
            tmp = this.pageList[i];
            if (tmp) {
                newAddHeight += this.loader[tmp.id](tmp);
                if (newAddHeight > more) {//新增组件的总高度超过more
                    newAddNum = i - this.showingList.length
                    break;
                }
            }
        }
        if (!newAddNum) {//如果剩余组件总高度小于more
            newAddNum = this.pageList.length - this.showingList.length
        }
        return newAddNum
    }
    checkPageList() {//部分组件的尺寸会发生变化，如：商品组等；导致懒加载的组件高度不够，这里后续处理
        clearTimeout(this.throttleCheckPageList)
        this.throttleCheckPageList=setTimeout(async () => {
            let length = await this.getComponentsLength(this.pageList, this.hodedPageHeight,0);//
            if (length > this.showingList.length && this.showingList.length <= this.pageList.length) {
                let newAdd = this.pageList.slice(this.showingList.length, length);
                let newList = this.pageList.slice(0, length);
                if(newAdd.length && (newList.length!=this.showingList.length)){ 
                    if(this.lastLazyComponent){//这里是为实现组件内部懒加载功能做准备的
                        try{
                            let res= await this.lastLazyComponent.onLoadAll(this.pageList[this.lastLazyComponentIdx],this.pageType);
                            if(!res){
                                this.lastLazyComponent.onLoadMore(this.pageType);
                            }else{
                                this.lastLazyComponent=null;
                                this.lastLazyComponentIdx=-1;
                            }
                            return
                        }catch(e){
                            this.lastLazyComponent=null;
                            this.lastLazyComponentIdx=-1;
                        }
                    }else{
                        $decorator.onGetMorePageList(newAdd,this,this.pageType);
                    }
                }
            
                if (this.cacheCallbacks && newList.length != this.showingList.length) {
                    this.showingList = newList;
                    this.cacheCallbacks &&this.cacheCallbacks(deepCopy(this.showingList));
                }
            }
        },500)
    }
    getAll(list){
        this.showingList=[...list]
        $decorator.onGetMorePageList([...list], this,this.pageType);
        this.cacheCallbacks(deepCopy(this.showingList));
    }
    /**
     * 加载更多的页面组件
     * 相对上次的页面至少新增半个屏幕高度的组件
     * @param {页面全部模板数组} list 
     * @param {当前页面滚动高度} scrollTop 
     * @param {当前页面加载的模板数} lazyListLength 
     */
    async getMore(list, scrollTop = 0,lazyListLength) {
        try{
            await this.getSysInfo();
        }catch(e){
            
        }
        if(this.lastLazyComponent){//这里是为实现组件内部懒加载功能做准备的
            try{
                let res= await this.lastLazyComponent.onLoadAll(this.pageList[this.lastLazyComponentIdx],this.pageType);
                if(!res){//还没有加载完毕
                    this.lastLazyComponent.onLoadMore(this.pageType);
                    return
                }else{
                    this.lastLazyComponent=null;
                    this.lastLazyComponentIdx=-1;
                }
            }catch(e){
                this.lastLazyComponent=null;
                this.lastLazyComponentIdx=-1;
            }
        }
        this.scrollTop = scrollTop;//实际滚动高度
        this.initPageList(list);//对比上次的页面是否发生了变化

        if(this.newAddPageBoxHeight==0){//首屏加载
            this.newAddPageBoxHeight =Math.max(this.screenHeight*1.1,this.scrollTop);//缓存期望的页面高度
            this.hodedPageHeight=this.newAddPageBoxHeight;
        }else{
            this.newAddPageBoxHeight = this.screenHeight*0.5;//每次多加载半个屏幕高度
            this.hodedPageHeight=this.hodedPageHeight+this.newAddPageBoxHeight;//增加后期望的页面高度
        }

        let length = await this.getComponentsLength(this.pageList, this.newAddPageBoxHeight,this.showingList.length);//计算当前需要的组件个数,估算有误差，组件越多，误差越大
        if(length==this.showingList.length&&this.lastLazyComponent){
            await this.lastLazyComponent.onLoadMore(this.pageType)
        }else if (length <= this.pageList.length && length <= this.showingList.length) {
            length = Math.min(this.pageList.length,this.showingList.length +  (this.getNewAddNum(this.screenHeight*0.5)||1));//防止估算错误，每次至少增加一个组件
        }
        if (length > this.showingList.length && this.showingList.length <= this.pageList.length) {
            let newAdd = this.pageList.slice(this.showingList.length, length);
            newAdd.length && $decorator.onGetMorePageList(newAdd, this,this.pageType);
            let newList = this.pageList.slice(0, length);
            if (this.cacheCallbacks && newList.length != this.showingList.length) {
                this.showingList = newList
                this.cacheCallbacks(deepCopy(this.showingList));
            }
        }
    }
    /**
     * h5端的onReachBottom经常有问题
     * 这里手写一个作为备用
     * @param {*} callback 
     */
    h5ReachBottom(callback) {
        //#ifdef H5
        let body = document.getElementsByTagName('body')[0];
        let html = document.documentElement;
        let scrollDistance = 200 / this.px2upx; //距离底部的距离
        body.onscroll = () => {
            this.scrollTop = body.scrollTop || html.scrollTop;
            //框架在h5端常出bug，onReachBottom不好使；这里多一个保险
            clearTimeout(this.checkDistance)
            this.checkDistance = setTimeout(() => {
                if (callback && Math.abs((this.container[0] ?.clientHeight - this.scrollTop) / this.px2upx - this.screenHeight) < scrollDistance) {
                    callback({
                        scrollTop:this.scrollTop
                    })
                }
                this.checkDistance = false
            }, 60)
        }
        //#endif
    }
}
