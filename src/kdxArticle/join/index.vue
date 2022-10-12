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
    <page-box>
        <view class="member-info-diy-form" v-if="form.content.length">
            <diyform-items :items="form.content" class="member-info-diy-form-items" @on-change="changeForm" @click="handleClick"></diyform-items>
            <view class="save-btn" :style="{bottom:isIphoneX}">
                <view class="btn" @click="handleSave">提交报名信息</view>
            </view>
            <phone-modal :visible="visible" @join="handlerJoin" @close="visible = false"></phone-modal>
        </view>
    </page-box>
</template>

<script>
import DiyformItems from "@/components/decorate/templates-shim/DiyformItems";
import saveForm from '@/components/decorate/templates-shim/formSubmit.js'
import PhoneModal from "./components/PhoneModal"
import {hasBindBySence} from '@/common/helper/user';
export default {
    components: {
        DiyformItems,
        PhoneModal,
    },
    data() {
        return {
            id: 0,
            diyformId: 0,
            check_mobile: 0,
            form: {
                id: 0,
                content: []
            },
            visible: false,
        };
    },
    computed: {
        isIphoneX() {
            // 获取iphonex底部安全区域
            return this.$store.state.areaBottom + 'px'
        },
    },
    mounted() {
        this.id = this.$Route.query?.id;
        this.form.id = this.$Route.query?.form_id;
        this.check_mobile = this.$Route.query?.check_mobile - 0;
        this.getForm();
        if(this.check_mobile) {
            this.$store.dispatch('member/getBasicInfo')
        }
    },
    methods: {
        handleClick() {
            if (hasBindBySence('submit_form')) {
                this.$store.commit('login/setModal', true)
                return
            }
        },
        changeForm(data) {
            this.form.content = data;
        },
        handlerJoin() {
            console.log(131244)
            this.$api.articleApi.join({
                id: this.id,
                form_id: this.diyformId,
            }).then((res) => {
                if(res.error === 0) {
                    this.$toast("报名成功")
                    setTimeout(() => {
                        this.$Router.auto({
                            path: "/kdxArticle/detail/index",
                            query: {
                                id: this.id
                            }
                        })
                    }, 500)
                }
            })
        },
        getForm() {
            this.$api.decorateApi.getFormDetail({
                id: this.form.id,
            }).then(res => {
                if (res.error == 0 && res.data) {
                    let data = JSON.parse(res.data.content)
                    this.form.content = data
                }
            })
        },
        async handleSave() {
            let params = await saveForm(this.form);
            params.location = "活动报名";
            this.$api.decorateApi.saveDiyForm(params).then(res => {
                if (res.error == 0) {
                    this.diyformId = res.data
                    if(this.check_mobile) {
                        this.visible = true;
                        return
                    }
                    this.handlerJoin()
                } else {
                    uni.showToast({ title: res.message || '保存失败', icon: 'none' });
                }
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.member-info-diy-form {
    padding: px2rpx(8) px2rpx(12);
    margin-bottom: px2rpx(52);
    /*margin: 0 px2rpx(12);*/
    .member-info-diy-form-items {
        /* #ifdef  H5 */
        border-radius: px2rpx(10);
        /* #endif */
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef  MP-WEIXIN */
        /deep/ .diyform-item {
            border-radius: px2rpx(10);
        }
        /* #endif */
        /deep/ .form-item {
            &:first-child {
                /*border-top: 1rpx solid #E6E7EB;*/
            }
        }
    }
    .save-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        /*padding: 0 px2rpx(12);*/
        background-color: #FFFFFF;
        padding: px2rpx(6) px2rpx(12);
        border-top: 1px solid rgb(238, 238, 238);
        z-index: 1;
    }
    .btn {
        width: 100%;
        height: px2rpx(38);
        line-height: px2rpx(38);
        border-radius: px2rpx(64);
        background: #FF3C29;
        color: #fff;
        font-size: px2rpx(14);
        font-weight: bold;
        text-align: center;
    }
}
</style>