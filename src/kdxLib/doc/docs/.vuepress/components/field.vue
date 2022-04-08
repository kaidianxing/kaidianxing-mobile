<!--
 * @Description: field
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
    <div :class="classes" :style="style">
        <div class="field-box" :class="{'bottom-border': border, 'field-disabled': disabled, 'field-align': autoSize}" ref="box">
            <div v-if="leftIcon" class="iconfont-m- left-icon" :class="leftIcon" @click="clickLeft"></div>
            <div class="label" @click="clickLeft">
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
            <div class="field-right" @click.stop="clickRightIcon" v-if="rightIcon || rightSlot">
                <div v-if="rightIcon && rightSlot" class="iconfont-m- right-icon" :class="rightIcon"></div>
                <button-sqx type="default" size="small">文本</button-sqx>
            </div>
        </div>
    </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";
import { oneOf } from "../../utils";

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
        },
        rightSlot: {
            type: Boolean,
            default: false
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
            this.$emit('on-blur', e)
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
                this.$emit('on-change', value)
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