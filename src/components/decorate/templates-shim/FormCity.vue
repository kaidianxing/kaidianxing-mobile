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
    <picker @change="changeCity" mode="multiSelector" :value="value" :disabled="disabled" range-key="name" :range="range" @columnchange="changeColumnCity">
        <view v-if="cityData">{{cityData}}</view>
        <view class="item-placeholder" v-else>
            {{model.params.tip}}
        </view>
    </picker>
</template>

<script>
    import getAllAreas from '../../picker/OverseasPicker/getAllAreas.js';

    export default {
        name: "FormCity",
        props: {
          model: {
              type: Object,
              default: () => {}
          },
          disabled: {
              type: Boolean,
              default: false
          }
        },
        data() {
            return {
                bottom: 0,
                curTab: 0,
                range: [],
                allProvinces: [],
                cityList: [],
                areaList: [],
                value: []
            };
        },
        computed: {
            cityData() {
                if (this.model?.params?.status == 2) {
                    return `${this.model?.params?.province || ''}`;
                } else if (this.model?.params?.status == 0) {
                    return `${this.model.params.province || ''}${this.model.params.city || ''}`;
                } else if (this.model?.params?.status == 1) {
                    return `${this.model?.params?.province || ''}${this.model?.params?.city || ''}${this.model?.params?.area || ''}`;
                } else {
                    return ''
                }
            }
        },
        mounted() {
            this.range = [];
            this.value = [];
            getAllAreas.requestAllAreas().then(res => {
                this.allProvinces = getAllAreas.flatObj(res.result.list);
                this.initRange();
            })
        },
        methods: {
            changeCity(e) {
                this.value = e.detail.value;
                let data = JSON.parse(JSON.stringify(this.model));
                if (data.params.status == 2) {
                    data.params.province = this.allProvinces[this.value[0]].name;
                } else if (data.params.status == 0) {
                    data.params.province = this.allProvinces[this.value[0]].name;
                    this.cityList = getAllAreas.flatObj(this.allProvinces[this.value[0]].list);
                    data.params.city = this.cityList[this.value[1]].name;
                } else if (data.params.status == 1) {
                    data.params.province = this.allProvinces[this.value[0]].name;
                    this.cityList = getAllAreas.flatObj(this.allProvinces[this.value[0]].list);
                    data.params.city = this.cityList[this.value[1]].name;
                    this.areaList = getAllAreas.flatObj(this.cityList[this.value[1]].list);
                    data.params.area = this.areaList[this.value[2]].name;
                }
                this.$emit('on-change', data);
            },
            initRange() {
                let value = [];
                //初始化range
                if (this.model?.params?.status == 2) { // 省份
                    this.range = [this.allProvinces];
                    value[0] = getListValue(this.allProvinces, this.model?.params?.province)
                } else if (this.model?.params?.status == 0) { // 省市
                    this.range[0] = this.allProvinces;
                    value[0] = getListValue(this.allProvinces, this.model?.params?.province)
                    this.cityList = getAllAreas.flatObj(this.allProvinces[value[0]].list);
                    this.range[1] = this.cityList;
                    value[1] = getListValue(this.cityList, this.model?.params?.city)
                } else if (this.model?.params?.status == 1) {
                    this.range[0] = this.allProvinces;
                    value[0] = getListValue(this.allProvinces, this.model?.params?.province)
                    this.cityList = getAllAreas.flatObj(this.allProvinces[value[0]].list);
                    this.range[1] = this.cityList;
                    value[1] = getListValue(this.cityList, this.model?.params?.city)
                    this.areaList = getAllAreas.flatObj(this.cityList[value[1]].list);
                    this.range[2] = this.areaList;
                    value[2] = getListValue(this.areaList, this.model?.params?.area)
                }
                this.value = value;
            },
            changeColumnCity(e) {
                const {column, value} = e.detail;
                if (this.value.length - 1 !== column) {
                    if (column == 1) {
                        this.areaList = getAllAreas.flatObj(this.cityList[value].list);
                        this.value[2] = 0;
                        this.range[2] = this.areaList;
                    } else if (column == 0) {
                        this.cityList = getAllAreas.flatObj(this.allProvinces[value].list);
                        this.value[1] = 0;
                        this.range[1] = this.cityList;
                        if (this.value.length == 3) {
                            this.areaList = getAllAreas.flatObj(this.cityList[0].list);
                            this.range[2] = this.areaList;
                            this.value[2] = 0;
                        }
                    }
                }
            }
        }
    };
    function getListValue(list = [], name = '') {
        let index = 0;
        if (name) {
            list.forEach((item, i) => {
                if (item.name === name) {
                    index = i;
                }
            })
        }
        return index;
    }
</script>

<style scoped lang="scss">
    /* #ifdef  MP-WEIXIN */
    .item-placeholder {
        color: #CCCCCC;
        flex: 1;
        cursor: pointer;
    }
    /* #endif */
</style>
