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
    <div class="search" :style="{ background: getBg, padding:`${px2rpx(componentData.style.paddingtop)} ${px2rpx(componentData.style.paddingleft)} ${px2rpx(componentData.style.paddingbottom)}`}" v-if="componentData&&componentData.id=='search'">
        <div class="position" v-if="showPos && chooseAddress && componentData.params.showstyle!=0" @click="openPicker">
            <i class="iconfont-remix icon-remix-dingwei2" v-if="componentData.params.locationicon == 1" :style='{color:componentData.style.locationiconcolor}'></i>
            <span class="locationtext overflow-h" :style='{color:componentData.style.locationcolor}'>{{chooseAddress}}</span>
            <i class="iconfont-def icon-def-jiantou-xia1" :style='{color:componentData.style.locationcolor}'></i>
        </div>

        <div class="custom-input" v-if='componentData.params.searchtype=="sort"'>
            <div class="input-box" :class="{focus:focusInput}">
                <i class="search-icon iconfont-m- icon-m-shangpinxiangqing-search"></i>
                <input type="text" placeholder='搜索' class='input' @confirm='onConfirm' @focus="onFocus" @blur='onBlur'>
            </div>
            <div class='search-col'>
                <div class="input-col col1" @click='clickCol(1)' :class="{active:activeCol==1,up:this.increase,down:!this.increase}"><span class='text'>销量</span><span class='arrow'><i class='iconfont-m- icon-m-arrow-up'></i><i class='iconfont-m- icon-m-arrow-down'></i></span></div>
                <div class="input-col col2" @click='clickCol(2)' :class="{active:activeCol==2,up:this.increase,down:!this.increase}"><span class='text'>价格</span><span class='arrow'><i class='iconfont-m- icon-m-arrow-up'></i><i class='iconfont-m- icon-m-arrow-down'></i></span></div>
                <div class="input-col col3" @click='clickCol(3)' :class="{active:activeCol==3,up:this.increase,down:!this.increase}"><span class='text'>最新</span><span class='arrow'><i class='iconfont-m- icon-m-arrow-up'></i><i class='iconfont-m- icon-m-arrow-down'></i></span></div>
            </div>
            <div class="input-col col4" @click='clickRedraw'><i class='iconfont-m- redraw' :class='currentStatus?"icon-m-fenlei-liebiaoliu":"icon-m-fenlei-pubuliu"'></i></div>
        </div>
        <div class="box" @click="clickInput" v-else>
            <span class="placeholder word" :style="{
                        color:componentData.style.color,
                        textAlign:componentData.style.textalign,
                        background:componentData.style.inputbackground,
                        borderRadius: px2rpx(componentData.style.borderradius)
                    }">
            <i
                class="search-icon iconfont-m- icon-m-shangpinxiangqing-search"
                :style="{color:componentData.style.iconcolor}"
            ></i>
            {{value?'':componentData.params.placeholder}}
        </span>
        </div>
        <address-picker ref='areaPicker' :curTab='curTab' :addressList='addressList' :showTab="false"
                        @change='onValuesChange'></address-picker>
    </div>
</template>

<script>
import mixin from "./mixin.js";
import addressPicker from '@/components/picker/OverseasPicker/Index.vue'
import PageMixin from '@/common/PageMixin.js'
import $decorator from "../../../common/decorator";
export default {
    mixins: [mixin,PageMixin],
    name: "search",
    components: {
        addressPicker
    },
    computed: {
        getBg(){
            if(this.componentData.params.bgstyle =='color'){
                return this.componentData.style.bgcolor
            }
            return ''
        },
        showPos() {
            //  小程序及公众号
            return this.$utils.is_weixin()
        },
    },
    data() {
        return {
            value: "",
            focusInput: false,
            activeCol: 1,
            currentStatus:0,
            increase:false,//当前列是递增还是递减
            showAddress: false, // 删除地址弹窗
            showPicker: false,
            addressList: [],
            curTab: 0,
            chooseAddress: '', // 选中地址文案
            showCity: [], // 选中地址数据
        };
    },
    watch: {
        '$store.state.setting.showCity': {
            immediate: true,
            deep: true,
            handler() {
                // console.log(val,'searchShowCity>>>>>>>>>')
                let showCity = this.$store.state.setting?.showCity
                showCity && this.getData(showCity)
                $decorator.getModule('search')?.notify?.()
            }
        }
    },
    methods: {
        clickRedraw(){
            this.currentStatus=this.currentStatus?0:1;
            this.$emit("custom-event", {
                target: "search/clickRedraw",
                data:{
                    status:this.currentStatus
                }
            });
        },
        clickCol(idx) {
            if (this.activeCol != idx) {
                this.activeCol = idx;
                this.increase=false
            }else{
                this.increase=!this.increase
            }
            this.$emit("custom-event", {
                target: "search/clickCol",
                data:{
                    idx,
                    increase:this.increase
                }
            });

        },
        onFocus() {
            this.focusInput = true;
        },
        onBlur() {
            this.focusInput = false;
        },
        onConfirm(val) {
            this.focusInput = false;
            this.$emit("custom-event", {
                target: "search/onChange",
                data:{
                    value:val.detail.value
                }
            });
        },
        clickInput(e) {
            this.value = e.target.value;
            this.$emit("custom-event", {
                target: "search/clickInput"
            });
        },
        // 地址三级联动picker改变
        onValuesChange(values) {
            let val = values.map(item => {
                item.code = item.code_id;
                return item;
            });
            this.showCity = val;
            this.chooseAddress = this.componentData.params.showstyle==1? this.showCity[2].name : this.showCity[1].name;
            this.$refs.areaPicker.togglePicker();
            let locPos = values[2].location.split(",");
            let location= {}
            if(locPos[0] > locPos[1]) {
                location.lng = locPos[1];
                location.lat = locPos[0]
            }else {
                location.lng = locPos[0];
                location.lat = locPos[1]
            }
            let showCity = [
                {name: values[0].name},
                {name: values[1].name},
                {
                    code: values[2].code,
                    name: values[2].name
                }
            ]
            this.$store.commit('setting/setLocationPosition',location)
            this.$store.commit('setting/setShowCity',showCity)
        },
        openPicker() {
            // 打开地址picker
            this.$refs.areaPicker.togglePicker();
        },
        getData(data) {
            this.chooseAddress = this.componentData.params.showstyle==1? data[2].name : data[1].name;
            this.addressList =  data;
        },
    }
};
</script>

<style lang="scss" scoped>
@import "./decorate.scss";
.search {
    width: 100%;
    display: flex;
    padding: 0;
    margin: auto;
    .box {
        width: 100%;
        margin: auto;
        position: relative;
        overflow: hidden;
        &.marginkLft {
            margin-left: px2rpx(12);
        }
        .round {
            border-radius: px2rpx(30);
        }
        .search-icon {
            width: px2rpx(15);
            height: px2rpx(15);
            font-size: px2rpx(16);
            overflow: hidden;
            color: #b4b4b4;
            line-height: px2rpx(16);
            text-align: center;
            vertical-align: px2rpx(-1);
        }
        .placeholder {
            display: block;
            box-sizing: border-box;
            padding: px2rpx(7) px2rpx(14);
            font-size: px2rpx(12);
            line-height: px2rpx(16);
        }
    }
    .custom-input {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        .input-box {
            transition: width 0.5s;
            background: #ececec;
            width: px2rpx(102);
            height: px2rpx(30);
            border-radius: px2rpx(30);
            display: flex;
            flex-shrink: 0;
            flex-wrap: nowrap;
            input {
                width: 100%;
                background: rgba(0, 0, 0, 0);
                font-size: px2rpx(12);
                padding-right: px2rpx(6);
                margin: auto 0;
            }
            .search-icon {
                width: px2rpx(16);
                height: px2rpx(16);
                color: #969696;
                text-align: center;
                display: flex;
                justify-content: center;
                flex-direction: column;
                margin: auto px2rpx(6) auto px2rpx(12);
            }
            &.focus {
                width: px2rpx(180);
            }
        }
        .search-col {
            display: flex;
            flex-wrap: nowrap;
            width: 0;
            flex: 1;
            overflow: hidden;
            box-sizing: border-box;
        }
        .input-col {
            flex-shrink: 0;
            display: flex;
            flex-wrap: nowrap;
            white-space: nowrap;
            padding: 0 px2rpx(17);
            height: px2rpx(20);
            margin: auto 0;
            .text {
                margin: auto 0;
                font-size: px2rpx(14);
                font-weight: 600;
                line-height: px2rpx(14);
                height: px2rpx(14);
                color: #969696;


            }
            &.active {
                .text{
                    color: #FF3C29;
                }
            }
            &.active.up{
                .icon-m-arrow-up{
                    color:  #FF3C29;
                }
            }
            &.active.down{
                .icon-m-arrow-down{
                    color:  #FF3C29;
                }
            }
            .arrow {
                margin: auto 0;
                height: px2rpx(12);
                display: flex;
                flex-direction: column;
                justify-content: center;
                .iconfont-m- {
                    margin: auto;
                    width: 100%;
                    height: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: px2rpx(12);
                    transform: scale(0.6);
                    text-align: center;
                    color: #C4C4C4;
                }
            }
            .redraw {
                width: px2rpx(20);
                height: px2rpx(20);
                font-size: px2rpx(20);
                color: #969696;
                justify-content: center;
                display: flex;
                flex-direction: column;
                text-align: center;
            }
        }
        .col4 {
            padding: 0 0 0 px2rpx(13);
            border-left: px2rpx(0.5) solid #E6E7EB;
        }
        .col3 {
            padding-right: px2rpx(12);
        }
    }
    .position {
        display: flex;
        align-items: center;
        max-width: px2rpx(96);
        i {
            font-size: px2rpx(12);
            line-height: px2rpx(16);
            &.iconfont-def {
                color: #fff;
            }
        }
        .locationtext {
            font-size: px2rpx(12);
            line-height: px2rpx(16);
            margin-left: px2rpx(2);
            &.overflow-h {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}
</style>
