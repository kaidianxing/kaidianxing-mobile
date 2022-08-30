<template>
    <message-box :value="value" :title="title" :height="getHeight" @input="modalChange">
        <!-- 不配送区域 -->
        <div v-if="type == 'bupeisong'">
            <div>{{info.content.value}}</div>
        </div>
        <!-- 活动 -->
        <goods-active
                v-else-if="type == 'active'"
                :info="info"
        ></goods-active>
    </message-box>
</template>

<script>
    import MessageBox from '@/components/picker/MessageBox.vue'
    import GoodsActive from './GoodsActive'

    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            info: {
                type: Object,
                default: () => {}
            },
            title: {
                type: String,
            },
            type: {
                type: String,
                required: true
            }
        },
        components: {
            MessageBox,
            GoodsActive
        },
        computed: {
            getHeight() {
                let special = ['coupon', 'biaoqian','active']
                return special.includes(this.info.type) ? '980rpx' : '600rpx'
            }
        },
        methods: {
            modalChange(e) {
                this.$emit('input', e)
            },
            refreshHandler() {
                this.$emit('on-refresh')
            }
        }

    }
</script>