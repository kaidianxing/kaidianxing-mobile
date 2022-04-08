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
<!--
 * @Description: field
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div :class="classes" :style="style">
        <div class="field-box" :class="{'bottom-border': border, 'field-disabled': disabled, 'field-align': autoSize}" ref="box">
            <div v-if="leftIcon" class="iconfont-m- left-icon" :class="leftIcon" @click="clickLeft"></div>
            <div class="label" @click="clickLeft" v-if="title">
                {{ label }}
            </div>
            <div class="field-body" @click="clickBody">
                <template v-if="!$slots.default">
                    <div class="readonly" v-if="readonly">
                        {{ value }}
                    </div>
                    <textarea v-else-if="type === 'textarea'" :value="value" :auto-height="autoSize"
                              :placeholder="placeholder" :readonly="readonly"
                              :maxlength="maxLength" :disabled="disabled" class="field-textarea" @blur="handleBlur"
                              @input="handleInput"></textarea>
                    <input v-else :value="value" :type="type" :readonly="readonly" :maxlength="maxLength"
                           :disabled="disabled" :placeholder="placeholder" class="field-input" :class="[inputAlign]"
                           @blur="handleBlur" @input="handleInput">
                </template>
                <slot v-else></slot>
            </div>
            <div class="field-right" @click.stop="clickRightIcon" v-if="rightIcon || $slots.right">
                <div v-if="rightIcon && $slots.right" class="iconfont-m- right-icon" :class="rightIcon"></div>
                <slot name="right" v-else></slot>
            </div>
        </div>
    </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";
import {oneOf} from "@/kdxLib/utils";

const NAME = "Field";

export default {
    name: NAME,
    mixins: [PublicMixin],
    props: {
        type: {
            type: String,
            default: 'text',
            validator: value => {
                return oneOf(value, ['text', 'textarea', 'password', 'number', 'digit', 'tel'])
            }
        },
        fixed: {
            type: Number,
            default: -1
        },
        value: {
            type: [Number, String]
        },
        label: {
            type: String,
            default: ''
        },
        autoSize: {
            type: Boolean,
            default: false
        },
        inputAlign: {
            type: String,
            default: 'left'
        },
        leftIcon: {
            type: String
        },
        rightIcon: {
            type: String
        },
        border: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number,
            default: -1
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentValue: '',
        }
    },
    computed: {
        // 样式计算
        classes() {
            return ["kdx-field-wrap", ...this.classNames].join(" ");
        },
        style() {
            return `${this.styles}`;
        }
    },
    methods: {
        handleBlur(e) {
            this.$emit('blur', e)
        },
        handleInput(e) {
            let value = e.target.value;
            this.formatValue(value);
        },
        formatValue(value) {
            if (this.type === 'number') {
                value = value ? Number(value) : '';
                if (this.fixed === 0 && value) {
                    value = parseInt(value);
                } else if (this.fixed > -1 && value) {
                    value = parseFloat(value).toFixed(this.fixed);
                }
            } else if ((this.type === 'digit' || this.type === 'tel') && value) {
                if (value.indexOf('-') > 0) {
                    value = value.split('-')[1];
                }
                value = parseInt(value);
                value = isNaN(value) ? '' : value;
            } else if (this.type === 'tel') {

            }
            if (value && this.maxLength !== -1 && value.length > this.maxLength) {
                value = value.slice(0, this.maxLength);
            }
            if (value !== this.value) {
                this.$emit('input', value);
                this.$emit('change', value)
            }
        },
        clickBody() {
            this.$emit('click');
        },
        clickRightIcon() {
            this.$emit('click-right');
        },
        clickLeft() {
            this.$emit('click-left');
        }
    }
}
</script>