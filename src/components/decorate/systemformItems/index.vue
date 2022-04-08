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
    <div class='diyform'>
        <!-- pictures -->
        <div class="form-templates form-templates-pictures" v-if='model.id=="pictures"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required">*</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                </div>
            </div>
            <div class="templates-box templates-img">
                <form-pictures :model="formData" :disabled="disabled"  @on-change="changePictures" @on-click="focusHandle"></form-pictures>
            </div>
        </div>
        <!-- singlelinetext -->
        <div class="form-templates" v-else-if='model.id=="singlelinetext"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <div v-if="disabled" class="item-input box" @click="focusHandle">{{formData.params.tip}}</div>
                        <input v-else :value="formData.params.value" :disabled="disabled" type="text" :maxlength="-1" :placeholder="formData.params.tip"  @blur="blurInput"  class="item-input" />
                    </div>
                </div>
            </div>
        </div>
        <!-- multilinetext -->
        <div class="form-templates" v-else-if='model.id=="multilinetext"'>
            <div class="templates-box">
                <div class="templates-item flex-column">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                         <div v-if="disabled" class="item-input box" @click="focusHandle">{{formData.params.tip}}</div>
                        <textarea v-else :value="!$isPC ? formData.params.value : ''" :disabled="disabled" type="text" :maxlength="-1" auto-height :placeholder="formData.params.tip"  @blur="blurInput" class="item-input item-input-textarea" />
                    </div>
                </div>
            </div>
        </div>
        <!-- selector -->
        <div class="form-templates" v-else-if='model.id=="selector"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <form-select class="flex1" :model="formData" :disabled="disabled" @click.native="focusHandle" @on-change="changeSelect" ></form-select>
                        <div class="item-icon">
                            <i class="icon-m-down iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- radios -->
        <div class="form-templates" v-else-if='model.id=="radios"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                </div>
            </div>
            <div class="templates-box">
                <m-radios :value="$isPC ? value : formData.params.value" :data="formData.data" @on-change="changeRadios" :disabled="disabled" @click.native="focusHandle"></m-radios>
            </div>
        </div>
        <!-- checkboxes -->
        <div class="form-templates" v-else-if='model.id=="checkboxes"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                </div>
            </div>
            <div class="templates-box">
                <m-checked :value="$isPC? value : formData.params.value" :data="formData.data" @on-change="changeCheckbox" :disabled="disabled" @click.native="focusHandle"></m-checked>
            </div>
        </div>
        <!-- city -->
        <div class="form-templates" v-else-if='model.id=="city"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <form-city ref="form_city" class="flex1" :model="formData" :disabled="disabled" @on-change="changeCity" @click.native="focusHandle"></form-city>
                        <div class="item-icon">
                            <i class="icon-m-down iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- datepicker -->
        <div class="form-templates" v-else-if='model.id=="datepicker"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <form-date :model="formData.params" class="flex1" @on-change="changeDate" :disabled="disabled" @click.native="focusHandle"></form-date>
                        <div class="item-icon">
                            <i class="icon-m-riqi iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- daterange -->
        <div class="form-templates" v-else-if='model.id=="daterange"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                </div>
            </div>
            <div class="templates-box flex-column template-date-range">
                <div class="templates-item-box">
                    <div class="templates-item flex">
                        <form-date :model="formData.params.start" class="flex1" @on-change="changeStart" :disabled="disabled" @click.native="focusHandle"></form-date>
                        <div class="item-icon">
                            <i class="icon-m-riqi iconfont-m-"></i>
                        </div>
                    </div>
                </div>
                <div class="templates-item-box">
                    <div class="templates-item flex">
                        <form-date :model="formData.params.end" class="flex1" @on-change="changeEnd" :disabled="disabled" @click.native="focusHandle"></form-date>
                        <div class="item-icon">
                            <i class="icon-m-riqi iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- identity -->
        <div class="form-templates" v-else-if='model.id=="identity"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <div v-if="disabled" class="item-input box" @click="focusHandle">{{formData.params.tip}}</div>
                        <input v-else :value="!$isPC ? formData.params.value: ''" type="text" :disabled="disabled" :placeholder="formData.params.tip" class="item-input" @blur="blurInput"  />
                    </div>
                </div>
            </div>
        </div>
        <!-- timer -->
        <div class="form-templates" v-else-if='model.id=="timer"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <form-time :model="formData.params" @on-change="changeTime" class="flex1"  :disabled="disabled" @click.native="focusHandle"></form-time>
                        <div class="item-icon">
                            <i class="icon-m-shijian1 iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- timerange -->
        <div class="form-templates" v-else-if='model.id=="timerange"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                </div>
            </div>
            <div class="templates-box flex-column template-date-range">
                <div class="templates-item-box">
                    <div class="templates-item flex">
                        <form-time :model="formData.params.start" class="flex1" @on-change="changeStart"  :disabled="disabled" @click.native="focusHandle"></form-time>
                        <div class="item-icon">
                            <i class="icon-m-shijian1 iconfont-m-"></i>
                        </div>
                    </div>
                </div>
                <div class="templates-item-box">
                    <div class="templates-item flex">
                        <form-time :model="formData.params.end" class="flex1" @on-change="changeEnd"  :disabled="disabled" @click.native="focusHandle"></form-time>
                        <div class="item-icon">
                            <i class="icon-m-shijian1 iconfont-m-"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- telephone -->
        <div class="form-templates" v-else-if='model.id=="telephone"'>
            <div class="templates-box">
                <div class="templates-item">
                    <div class="item-label">
                        <span class="item-title">{{formData.params.title}}</span>
                        <span class="item-required" v-if="formData.params.required"> *</span>
                    </div>
                    <div class="item-tip" v-if="formData.params.explain">
                        {{formData.params.explain}}
                    </div>
                    <div class="item-content">
                        <div v-if="disabled" class="item-input box" @click="focusHandle">{{formData.params.tip}}</div>
                        <input v-else :value="!$isPC ? formData.params.value: ''"  type="text" :disabled="disabled" :placeholder="formData.params.tip" class="item-input"  @blur="blurInput" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import FormPictures from "../templates-shim/FormPictures";
    import FormSelect from "../templates-shim/FormSelect";
    import MRadios from "../templates-shim/MRadios";
    import MChecked from "../templates-shim/MChecked";
    import FormCity from "../templates-shim/FormCity";
    import FormDate from "../templates-shim/FormDate";
    import FormTime from "../templates-shim/FormTime";
    export default {
        props:{
            type: {
                type: String,
                default: ''
            }
        },
        mixins: [mixin],
        components: {
            FormPictures,
            FormSelect,
            MRadios,
            MChecked,
            FormCity,
            FormDate,
            FormTime
        },
        data() {
            return {
                value: ''
            }
        },
        computed: {
            disabled(){
                if(this.$isPC){
                    return false
                } else {
                    return !this.$store.state.login.isLogin || (this.$utils.hasBindBySence('submit_form') && this.type=='diyform')
                }
            }
        },
        beforeMount() {
            if (this.model.id == "checkboxes") {
                this.value = []
            }
        },
        methods: {
            changeTime(value) {
                if (!this.$isPC) {
                    this.model.params.value = value;
                    this.$emit('on-change', this.model);
                    this.formData = this.$utils.deepCopy(this.model)
                }
            },
            changeStart(value) {
                if (!this.$isPC) {
                    this.model.params.start.value = value;
                    this.formData = this.$utils.deepCopy(this.model)
                    this.$emit('on-change', this.model);
                }
            },
            changeEnd(value) {
                if (!this.$isPC) {
                    this.model.params.end.value = value;
                    this.formData = this.$utils.deepCopy(this.model)
                    this.$emit('on-change', this.model);
                }
            },
            blurInput(e) {
                if (!this.$isPC) {
                    this.model.params.value = e.target.value;
                    this.$emit('on-change', this.model);
                }
            },
            changeRadios(value) {
                if (this.$isPC) {
                    this.value = value;
                } else {
                    this.model.params.value = value;
                    this.$emit('on-change', this.model);
                }
            },
            blurInput2(e) {
                if (!this.$isPC) {
                    this.model.params.value = e.target.value;
                    this.$emit('on-change', this.model);
                }
            },
            changeSelect(value) {
                if (!this.$isPC) {
                    this.model.params.value = value;
                    this.$emit('on-change', this.model);
                }
            },
            changeCheckbox(value) {
                if (this.$isPC) {
                    this.value = value;
                } else {
                    this.model.params.value = value;
                    this.$emit('on-change', this.model);
                }
            },
            changeCity(data) {
                if (!this.$isPC) {
                    this.$emit('on-change', data);
                }
            },
            changeDate(value) {
                if (!this.$isPC) {
                    this.model.params.value = value;
                    this.$emit('on-change', this.model);
                    this.formData = this.$utils.deepCopy(this.model)
                }
            },
            changePictures(data) {
                if (!this.$isPC) {
                    this.model.params.value = data;
                    this.$emit('on-change', this.model);
                }
            },
            focusHandle(e){
                console.log(e)
                if(!this.disabled) return
                this.$emit('on-focus')
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .form-templates-checkboxes {
        .templates-item {
            .item-label {
                .font-text {
                    padding-left: px2rpx(8);
                    font-size: px2rpx(12);
                }
            }
        }
        .templates-img {
            padding: px2rpx(14) 0;
        }
    }
    .form-templates-pictures {
        .templates-item {
            .item-label {
                .font-text {
                    padding-left: px2rpx(8);
                    font-size: px2rpx(12);
                }
            }
        }
        .templates-img {
            padding: px2rpx(14) 0;
        }
    }
</style>
