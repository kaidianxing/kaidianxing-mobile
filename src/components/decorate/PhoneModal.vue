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
    <div class="login-modal" @touchmove.stop.prevent :style="{
        height: windowHeight
    }">
        <div class="login-container">
            <div class="main">
                <image :src="$utils.themeMediaUrl('theme/login/phone.png')" class="login-img" />
                <div class="title">需要获取您的手机号</div>
                <button
                    class="btn theme-primary-bgcolor"
                    open-type="getPhoneNumber"
                    lang="zh_CN"
                    @getphonenumber="getPhoneNumber"
                >立即绑定</button>
                <div class="cancel-btn" @click="cancelBind">暂不授权</div>
            </div>
        </div>
    </div>
    </theme-content>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import $decorator from '@/common/decorator'
export default {
    computed: {
        ...mapState(['windowHeight']),
    },
    data() {
        return {
            btnLoad: false,
        }
    },
    methods: {
        ...mapMutations('login', ['setBindUser','setBind','setModal']),
        // 授权获取 解密信息
        getPhoneNumber(e) {
            let {encryptedData,iv } = e.detail
            //  授权取消
            if(!encryptedData || !iv){
                return
            }
            
            if(this.btnLoad) return
                this.btnLoad = true
            uni.login({
                provider: 'weixin',
                success: res => {
                    this.$api.loginApi
                        .postAuth({ type: 'wxapp', code: res.code })
                        .then(res => {
                            let data = {
                                iv,
                                session_key: res.session_key,
                                encryptedData
                            }
                            this.toBindMobile(data)
                        })
                },
                complete:()=> {
                    this.btnLoad = false
                }
            })
        },
        // 获取手机号
        toBindMobile(data) {
            this.$api.loginApi
                .getLogin({ ...data, type: 'wxapp', get_mobile: '1' })
                .then(res => {
                    if (res.error === 0) {
                        this.bindMobile(res.purePhoneNumber)
                    }
                })
        },
        bindMobile(mobile) {
            this.$api.loginApi
                .bindMobile({ mobile, is_auth: '1' })
                .then(res => {
                    if (res.error === 0) {
                        this.setBind(true)
                        $decorator.getPage('vipCenter').getUserInfo()
                        this.cancelBind()
                    } else if (res.error === 211265) {
                        this.cancelBind()
                        let { user, bind_user, bind_mobile } = res
                        this.setBindUser({ user, bind_user, bind_mobile })
                        this.$Router.auto('/kdxMember/bindTel/hadBound')
                    } else if(res.error === -1) {
                        this.$toast('授权失败,请重新授权')
                    }
                })
        },
        cancelBind() {
            this.setModal(false)
        }
    },
    beforeDestroy(){
        this.setModal(false)
    }
}
</script>

<style lang="scss" scoped>
.login-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
    width: 100vw;
    background: rgba(#000, 0.6);

    .login-container {
        left: 50%;
        top: 50%;
        position: absolute;
        transform: translate(-50%, -60%);
        width: 532rpx;
        height: 420rpx;

        .login-img {
            position: absolute;
            top: -80rpx;
            left: calc(50% - 100rpx);
            width: 200rpx;
            height: 200rpx;
        }

        .main {
            text-align: center;
            padding-top: 140rpx;
            border-radius: 12rpx;
            width: 532rpx;
            height: 430rpx;
            background-color: #fff;

            .title {
                margin-bottom: 64rpx;
                font-size: 32rpx;
                line-height: 44rpx;
                color: $uni-text-color;
            }

            .btn {
                margin: 0 auto;
                border-radius: 128rpx;
                width: 436rpx;
                height: 80rpx;
                font-size: 28rpx;
                line-height: 80rpx;
                color: #fff;
                background: linear-gradient(
                    168.71deg,
                    $uni-color-primary 0%,
                    #ff6f29 94.38%
                );
            }

            .cancel-btn {
                margin-top: 16rpx;
                font-size: 28rpx;
                line-height: 40rpx;
                text-align: center;
                color: $uni-text-color-grey;
            }
        }
    }
}
</style>