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
    <div class='navbar'>
        <overseas-picker ref='picker' :title='pickerTitle' :bottom='bottom' :areaGrade="areaGrade" :navbars='navbars' :pickerList='pickerList' pickerTitle='选择城市' :showTab="showTab" :maxLength='areaGrade=="country"?1:3' :pickerTop='pickerTop' @clickItem='clickItem'>
            <!-- 中国大陆  、海外国家/地区的选择按钮组件 -->
            <div class='custom-tabs'>
                <p class="tab" :class='{"active theme-primary-color":curTab==index}' v-for='(item,index) in tabs' :key='index' @click='switchTab(
                    {value: [tabs[index]]}
                )'>{{item.name}}</p>
            </div>

            <!-- 自定义内容区 -->
            <template slot="attachment" v-if="areaGrade == 'province'">
                <h6 class='sub-title'>热门地区</h6>
                <!-- 热门地区展示区 -->
                <view class='hot-cities van-hairline--bottom'>
                    <view class="city" v-for='(item,index) in hotCities' :key='index' @click='clickItem( {type: "hotCity",value: [item]})'>
                        {{item.name}}
                    </view>
                </view>
            </template>
        </overseas-picker>
    </div>
</template>
<script>
    import getAllAreas from './getAllAreas.js';
    import OverseasPicker from './OverseasPicker'

    export default {
        components: {
            OverseasPicker,
        },
        props: {
            bottom:{
                type: [String, Number],
                default:'0'
            },
            curTab: {
                type: Number,
                default: 0,
            },
            addressList: {
                type: Array,
                default: []
            },
            showTab: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            curTab: {
                handler() {
                    this.curNavbar = this.tabs[this.curTab];
                    this.switchTab({
                        value: [this.curNavbar]
                    })
                },
                immediate: true
            },
            addressList() {
                this.navbars = this.addressList;
            }
        },
        data() {
            return {
                pickerTitle: '选择国家/地区',
                pickerTop: 20,
                tabs: [{
                        name: '国内',
                        id: 0
                    },
                    {
                        name: '国外',
                        id: 1
                    }
                ],
                navbars: [],
                hotCities: [],
                pickerList: [],
                areaGrade: 'province', //country,province,city,area
                curNavbar: {
                    id: 0,
                    name: "中国大陆"
                }, //当前的
                abroad: [
                    {
                        code_id: "990000",
                        id: "990000",
                        letter: "guowai",
                        letterId: "G",
                        level: "1",
                        location: "",
                        name: "国外",
                        parent_id: "0",
                        sort: "G",
                        list: [
                            {
                                code_id: "990100",
                                id: "990100",
                                letter: "guowai",
                                letterId: "G",
                                level: "2",
                                location: "",
                                name: "国外",
                                parent_id: "990000",
                                sort: "G",
                                list: [
                                    {
                                        code_id: "990101",
                                        id: "990101",
                                        letter: "guowai",
                                        letterId: "G",
                                        level: "3",
                                        location: "",
                                        name: "国外",
                                        parent_id: "990100",
                                        sort: "G",
                                    }
                                ],
                            }
                        ],
                    }
                ]
            }
        },
        methods: {
            /**
             * 切换国内、国外的按钮组
             * @param {*} param0 
             */
            switchTab(event) {
                let {
                    value: [item]
                } = event;
                if (item && item?.id == 0) { //大陆地区
                    this.pickerTitle = '选择省份/地区';
                    this.areaGrade = 'province';
                    this.curNavbar = item;
                    this.hotCities = getAllAreas.getProvinces(true);
                    this.pickerList = getAllAreas.getProvinces()
                    if(this.navbars.length>0 && this.navbars[0].code == '990000') {
                        this.navbars = []
                    }
                } else if (item && item.id == 1) { //海外地区
                    this.pickerTitle = '选择地区';
                    this.areaGrade = 'country';
                    this.curNavbar = item;
                    // this.hotCities = getAllAreas.getOverseas(true);
                    this.pickerList = this.abroad;
                }
                this.pickerTop = (this.areaGrade == 'province' || this.areaGrade == 'country') ? this.calPickerTop(this.hotCities.length) : 0;
            },
            /**
             * 点击热门城市
             * @param {} value 
             */
            clickHotCity(value) {
                let arr = [];
                if (this.curNavbar?.id == 0) { //国内
                    let grade = '';
                    if (value.parent) { //查询市级热门城市的层级
                        getAllAreas.getProvince(value.parent.code_id);
                        getAllAreas.getCity(value.code_id);
                        arr = [getAllAreas.curProvince, getAllAreas.curCity];
                        grade = 'area'
                        this.pickerTitle = '选择区域'
                    } else { //查询省级热门城市的层级
                        getAllAreas.getProvince(value.parent.code_id);
                        arr = [getAllAreas.curProvince];
                        grade = 'province'
                    }
                    this.areaGrade = grade;
                    this.navbars = arr || [];
                    this.hotCities = [];
                    this.pickerList = getAllAreas.getAreas()
                } else { //国外 
                    getAllAreas.getOversea(value.code_id);
                    arr = [getAllAreas.curOversea];
                    this.areaGrade = 'country';
                    this.navbars = arr || [];
                }
                if (this.areaGrade == 'country') { //海外地址只有一级的地址可以直接返回值
                    this.$emit('change', this.navbars);
                }
            },
            /**
             * 点击已选的地址面包屑
             * @param {} value 
             */
            clickCrumbs(value) {
                let arr = [];
                if (this.curNavbar?.id == 0) { //国内
                    if (value.index === 0) { //省级 
                        getAllAreas.getProvince(value.name);
                        this.navbars[1] && getAllAreas.getCity(this.navbars[1].name);
                        this.navbars[2] && getAllAreas.getArea(this.navbars[2].name);
                        this.areaGrade = 'province';
                        this.hotCities = getAllAreas.getProvinces(true) || [];
                        this.pickerList = getAllAreas.getProvinces() || [];
                        this.pickerTitle = '选择城市'
                    } else if (value.index === 1) { //市级 
                        getAllAreas.getCity(value.name);
                        this.navbars[2] && getAllAreas.getArea(this.navbars[2].name);
                        this.areaGrade = 'city';
                        this.hotCities = [];
                        this.pickerList = getAllAreas.getCities() || []
                        this.pickerTitle = '选择区域'
                    } else if (value.index === 2) { //区级 
                        getAllAreas.getArea(value.name);
                        this.areaGrade = 'area';
                        this.hotCities = [];
                        this.pickerList = getAllAreas.getAreas() || []
                    }
                } else { //国外 
                    this.areaGrade = 'country'
                }
            },
            /**
             * 点击主要选区
             * @param {} value 
             */
            clickPicker(value) {
                let arr = [];
                if (this.curNavbar?.id == 0) { //国内
                    if (this.areaGrade == 'province') {
                        if (!this.navbars[0] || this.navbars[0].name != value.name) {
                            getAllAreas.getProvince(value.name);
                            this.areaGrade = 'city';
                            this.navbars = [value];
                            this.pickerList = getAllAreas.getCities() || []
                        }
                    } else if (this.areaGrade == 'city') {
                        if (!this.navbars[1] || this.navbars[1].name != value.name) {
                            getAllAreas.getCity(value.name);
                            this.areaGrade = 'area';
                            this.navbars = [this.navbars[0], value];
                            this.pickerList = getAllAreas.getAreas() || []
                        }
                    } else if (this.areaGrade == 'area') {
                        getAllAreas.getArea(value.name);
                        this.navbars = [this.navbars[0], this.navbars[1], value]
                    }
                } else { //国外 
                    this.areaGrade = 'country',
                        this.navbars = [value]
                }
                if (this.areaGrade == 'country' || this.navbars.length == 3) { //国外地址为1级，国内为3级
                    this.$emit('change', this.navbars);
                }
            },
            /**
             * 点击事件集中处理区
             * @param {} param0 
             */
            clickItem(event) {
                let {
                    type,
                    value: [value]
                } = event;
                if (type == 'hotCity') { //热门城市或国家
                    this.clickHotCity(value);
                } else if (type == 'crumbs') { //已选中的层级展示面包屑区
                    this.clickCrumbs(value);
                } else if (type == 'picker') { //分字母的选区
                    this.clickPicker(value)
                }
                this.pickerTop = (this.areaGrade == 'province' || this.areaGrade == 'country') ? this.calPickerTop(this.hotCities.length) : 0;
            },
            // 本组件的显示隐藏控制
            togglePicker() {
                this.$refs.picker.togglePicker()
            },
            /**
             * 计算picker顶部的热门城市以及国内外切换的按 钮所占高度
             * @param {*热门城市数量} hotCitiesNum 
             */
            calPickerTop(hotCitiesNum) {
                let rowNum = Math.ceil(hotCitiesNum / 4); //热门城市行数
                let switchTabs = 114; //切换国内外的按钮高104rpx；
                return (rowNum ? (rowNum + 1) * 63 : 0) + switchTabs;
            },
        },
        mounted() {
            this.navbars = this.addressList;
            getAllAreas.requestAllAreas().then(res => { 
                let hotCities = getAllAreas.getProvinces(true); //热门城市
                this.pickerTop = this.calPickerTop(hotCities.length);
                this.hotCities = hotCities;
                this.pickerList = getAllAreas.getProvinces();
                this.switchTab({
                    value: [this.curNavbar]
                })
            })
        }
    }
</script>

<style lang="scss" scoped>
    .sub-title {
        font-size: 20rpx;
        font-weight: 400;
        color: $uni-text-color-grey;
        line-height: 22rpx;
        margin-bottom: 39rpx;
    }
    .hot-cities {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        &.van-hairline--bottom:after {
            border-bottom-color: $uni-border-color;
            border-style: solid;
        }
        .city {
            width: 20%;
            height: 34rpx;
            font-size: 26rpx;
            font-weight: 400;
            color: $uni-text-color;
            line-height: 34rpx;
            margin: 0 0 32rpx;
        }
    }
    .custom-tabs {
        display: flex;
        flex-wrap: nowrap;
        padding: 0 24rpx;
        border-bottom: 1px solid #E6E7EB;
    }
    .custom-tabs .tab {
        width: fit-content;
        height: 68rpx;
        margin-right: 67rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #212121;
        text-align: center;
        line-height: 68rpx;
        position: relative;
    }
    .custom-tabs .active {
        color: #FF463E;
    }
    .custom-tabs .active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 56rpx;
        height: 4rpx;
        margin-left: -28rpx;
        background: #FF3C29;
        border-radius: 4rpx;
    }
</style>