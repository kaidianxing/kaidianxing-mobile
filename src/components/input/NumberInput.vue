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
    <div class="reg-input">
        <p class="placeholder" v-if="!tmpVal">{{ placeholder }}</p>
        <input
            class="input"
            type="text"
            v-model="tmpVal"
            @input="getInput"
            @change="changeVal"
        />
    </div>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            default: '请输入金额'
        },
        notFitReg: {
            type: [String],
            default: ''
        },
        value: {
            type: [Number, String],
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        max: {
            type: [Number, String],
            default: ''
        },
        min: {
            type: [Number, String],
            default: ''
        }
    },
    watch: {
        value: {
            immediate: true,
            handler() {
                this.tmpVal = this.value + ''
            }
        },
        reg: {
            immediate: true,
            handler() {
                if (typeof this.notFitReg === 'string') {
                    this.regexp = new RegExp(this.notFitReg)
                }
            }
        }
    },
    computed: {
        inputReg() {
            if (this.type == 'int') {
                return /[^\d]$/
            } else if (this.type == 'number') {
                if (/^(\d+)\.\d*$/.test(this.tmpVal)) {
                    return /^(\d+)(\.\d{0,2})?$/
                }
                return /^(\d+)\.?\d*$/
            }
            return /.*/
        },
        changeReg() {
            if (this.type == 'int') {
                return /[^\d]$/
            } else if (this.type == 'number') {
                return /^(\d+)(\.\d{0,2})?$/
            }
            return /.*/
        }
    },
    data() {
        return {
            regexp: null,
            regValue: '',
            originValue: '',
            tmpVal: '',
            refresh: 0
        }
    },
    methods: {
        getInput(val) {
            if (this.max !== '') {
                if(Math.min(val.detail.value + '', this.max)!= this.tmpVal) {
                    return false
                }
            }
            this.tmpVal = val.detail.value + ''
            if (this.tmpVal && this.inputReg.test(this.tmpVal)) {
                this.originValue = this.tmpVal
                if (this.changeReg.test(this.tmpVal)) {
                    this.regValue = this.tmpVal
                }
            } else if (this.tmpVal) {
                setTimeout(() => {
                    this.tmpVal = this.originValue
                    if (this.max !== '') {
                        this.tmpVal = Math.min(this.tmpVal, this.max)
                    }
                    this.$emit('input', this.tmpVal)
                }, 0)
            } else {
                this.regValue = this.min || ''
                this.originValue = this.min || ''
            } 
            
            this.$emit('input', this.tmpVal)
        },
        changeVal(val) {
            this.tmpVal = val.detail.value + ''
            if (this.tmpVal && this.inputReg.test(this.tmpVal)) {
                this.originValue = this.tmpVal
                if (this.changeReg.test(this.tmpVal)) {
                    this.regValue = this.tmpVal
                }
            } else if (this.tmpVal) {
                setTimeout(() => {
                    this.tmpVal = this.originValue
                }, 0)
            } else {
                this.regValue = this.min || ''
                this.originValue = this.min || ''
            }

            if (this.changeReg.test(this.originValue)) {
                this.tmpVal = this.originValue
                this.regValue = this.originValue
            } else {
                this.originValue = this.regValue
                this.tmpVal = this.regValue
            }
            if (/^(\d+)\.$/.test(this.tmpVal)) {
                this.tmpVal = this.tmpVal.replace('.', '')
            }
            if (this.max !== '') {
                this.tmpVal = Math.min(this.tmpVal, this.max)
            }
            if (this.min !== '') {
                this.tmpVal = Math.max(this.tmpVal, this.min)
            }
            if (this.tmpVal == 0) {
                this.tmpVal = this.min
            }
            this.$emit('change', this.tmpVal)
            this.$emit('input', this.tmpVal)
        }
    }
}
</script>

<style lang="scss" scoped>
.reg-input {
    width: 100%;
    height: 100%;
    position: relative;
    .input {
        position: absolute;
        bottom: 0;
        top: 0;
        width: 100%;
        height: 100%;
        color: #212121;
    }
    .placeholder {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(1px, -20%);
        font-size: 28rpx;
        color: #969696;
    }
}
</style>
