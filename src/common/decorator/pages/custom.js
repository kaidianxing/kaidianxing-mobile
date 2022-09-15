import store from '@/store'
import {PageMixin} from '../Mixin'
import $decorator from '@/common/decorator'
class CustomPage  extends PageMixin{
    _config={
        store:'decorate/customPage',
        pageType:0,
        route:'/kdxCustom/index/index'
    }
    constructor(){
        super()
    }
    data={
        pageTopHeight : 0, //页面顶部高度
        pageBottomHeight : 0, //页面底部高度
        cachePagList : [],
        isBottom : [],
        isTop : [],
        isFixed : [],
        pageList : [], //装修后的页面模板数据,不包括置顶、置底、悬浮的装修组件
        pageInfo : {}, //各个页面的装修组件的对应页面实际的数据，包括置顶、置底、悬浮的装修组件
        pageLoading : true,
        onshowing : false,
        pageSettings : {},
        forClearFormData : {},
        showSkeleten:true,
        showMenu:{},
    } 
    methods={
        setShowMenu(bool=true,pageId){
            this.showMenu[pageId] = bool
            this.setData(['showMenu'])
        },
        toggleShowSkeleten(res,from){
            this.showSkeleten=res
            this.setData(['showSkeleten'])
        },
        clearAll() {
            // this.pageList=[]
            this.cachePagList=[]
            // this.pageInfo={}
            // this.isTop=[]
            // this.isFixed=[] 
            this.toggleShowSkeleten(true,'clearAll')
            this.setData(['pageList','showSkeleten','cachePagList','pageInfo','isTop','isFixed','isBottom'])
        },
        setPageSettings(settings) {
            this.pageSettings = settings
            this.setPageTitle()
            this.setData(['pageSettings'])
        },
        setPageLoading(loading) {
            if (this.pageLoading != loading) {
                this.pageLoading = loading
                this.setData(['pageLoading'])
            }
        },
    
        setPageList(list, from) {
            this._setPageList(list).finally(()=>{
                if(from == 'firstLoad'){//
                    setTimeout(()=>{
                        this.toggleShowSkeleten(false);
                    },50)
                }
            })
        },
    }
   
    onLoad() {
        this.setPageTitle()
        if(store.state.login.isLogin && !this.pageInfo.diymenu){
            $decorator.getModule('diymenu').getCartNum();//获取购物车数量
        }
    }
    onShow() {

    }
    onUnload() {
        this.clearAll()
    }
}
export default new CustomPage()