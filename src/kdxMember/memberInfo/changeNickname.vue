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
<theme-content>
    <div class="my-name page">
        <view class="bg">
            <search
                :noSearch="true"
                :value="name"
                :maxlength="15"
                inputStyle="background:#fff"
                @input="getInput"
                :placeholder="placeholder"
                @clear="clear"
            ></search>
        </view>
        <view class="margin200"></view>
        <div style="padding:0 24rpx;">
            <btn type="do" size="middle" classNames="theme-primary-bgcolor" :disabled="disable" @btn-click="saveName">保存</btn>
        </div>
    </div>
    </theme-content>
</template>

<script>
import search from '@/components/input/SearchInput.vue'
import longButton from '@/components/button/LongButton.vue'
import { mapState, mapActions } from 'vuex'
import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    components: {
        longButton,
        search,
    },
    data() {
        return {
            name: '',
            placeholder: '请输入昵称',
        }
    },
    computed: {
        ...mapState('member', {
            memberInfo: (state) => state.memberInfo,
        }),
        disable() {
            return !this.name
        },
    },
    mounted() {
        this.name = this.$Route.query.nickname
    },
    methods: {
        ...mapActions('member', ['changeUserInfo']),
        clear() {
            this.name = ''
        },
        getInput(val) {
            this.name = val.value || ''
            this.memberInfo.basicInfo[1].content = this.name
        },
        saveName() {
            uni.showLoading({title:'保存中'})
            this.changeUserInfo().then((res) => {
                uni.hideLoading()
                if (res.error == 0) {
                    this.$toast('修改成功')
                    setTimeout(() => {
                        this.$Router.back(0)
                    }, 1000)
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.my-name {
    .margin200 {
        height: 32rpx;
    }
    .bg {
        margin-top: 16rpx;
        margin-left: 24rpx;
        margin-right: 24rpx;
        border-radius: 12rpx;
        background: #fff;
        padding: 8rpx 14rpx;
    }
}
</style>
