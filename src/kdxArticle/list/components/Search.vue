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
    <div class="search">
        <div class="custom-input" >
            <div class="input-box" :class="{focus:focusInput}">
                <i class="search-icon iconfont-m- icon-m-shangpinxiangqing-search"></i>
                <input type="text" placeholder='请输入关键字进行搜索' v-model="title" class='input' @confirm='onConfirm' @focus="onFocus" @blur='onBlur'>
            </div>
        </div>
        <address-picker 
            ref='areaPicker' 
            :curTab='curTab'
            :showNationwide="true"
            :addressList='addressList' 
            :showTab="false"
            @change='onValuesChange'>
        </address-picker>
    </div>
</template>

<script>
    import addressPicker from '@/components/picker/OverseasPicker/Index.vue'
    export default {
        name: "search",
        components: {
            addressPicker
        },
        data() {
            return {
                title: "",
                focusInput: false,
                showPicker: false,
                addressList: [],
                curTab: 0,
                chooseAddress: '全国', // 选中地址文案
                showCity: [], // 选中地址数据
            };
        },
        methods: {
            onFocus() {
                this.focusInput = true;
            },
            onBlur() {
                this.focusInput = false; 
            },
            onConfirm() {
                this.focusInput = false;
                this.$emit("search", {
                    title: this.title,
                    code: this.code

                }); 
            },
            // 地址三级联动picker改变
            onValuesChange(values) {
                let val = values.map(item => {
                    item.code = item.code_id;
                    return item;
                });
                this.showCity = val;
                if(val.length > 1) {
                    this.chooseAddress = this.showCity[2]?.name;
                }else {
                    this.chooseAddress = this.showCity[0]?.name;
                }
                this.$refs.areaPicker.togglePicker();
                let code = "";
                this.showCity.length > 1 && (code = this.showCity[2].code)
                this.showCity[0].id == "990000" && (code = "990000");
                this.code = code;
                this.$emit("search", {
                    title: this.title,
                    code: this.code
                }); 
            },
            openPicker() {
                // 打开地址picker
                this.$refs.areaPicker.togglePicker();
            },
        }
    };
</script>

<style lang="scss" scoped>
    .search {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rpx(48);
        display: flex;
        padding: px2rpx(8) px2rpx(12);
        background: #fff;
        z-index: 99999;
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
                background: #f5f5f5;
                width: 100%;
                height: px2rpx(30);
                border-radius: px2rpx(30);
                display: flex;
                flex-shrink: 0;
                flex-wrap: nowrap;
                font-size: px2rpx(12);
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
                    margin: auto px2rpx(4) auto px2rpx(12);
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
            margin-right: px2rpx(8);
            i {
                font-size: px2rpx(16);
                line-height: px2rpx(16);
            }
            .iconfont-remix {
                font-size: px2rpx(14);
            }
            .locationtext {
                font-size: px2rpx(14);
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
/deep/.uni-input-placeholder {
    font-size: px2rpx(12)!important;
    line-height: px2rpx(16);
}
</style>
