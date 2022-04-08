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
    <page-box :setting="{background:'#fff'}">
        <view class="img-box">
            <image class="close-img" :src="$utils.staticMediaUrl('shop_close.png')" />
            <view class="close-text">{{from=='noMall'?'未找到店铺':'店铺已打烊'}}</view>
        </view>
         
        <div v-if="linkurl" style="padding:90rpx 50rpx 0 50rpx">
            <btn @btn-click="skipPage" size="middle">查看</btn>
        </div>
    </page-box>
</template>

<script>
import {
    isWx, is_weixin
} from '@/common/util'
import {client_type} from "@/common/variable/channel";

import PageMixin from '@/common/PageMixin.js'
export default {
    mixins: [PageMixin],
    data() {
        return {
            linkurl: '',
            from:''
        }
    },
    mounted() {
        this.$loading.hideLoading()
        this.from = this.$Route.query.from
        // #ifdef H5
        this.linkurl = this.$store.state.setting.systemSetting.basic?.mall_close_url
        // #endif
        this.$store.dispatch('setting/getSysSetting').then(res => {
            if (res) {
                let { basic: { mall_status } } = res
                 // 判断商城是否开启
                this.$store.commit('setting/setSystemSetting',res)
                this.$store.commit('setting/setCloseStatus', mall_status == '0')
                if(mall_status =='1') {
                     this.getChannelStatus()
                }
            }
        })
    },
    methods: {
        skipPage() {
            // #ifdef H5
            window.open('http://'+this.linkurl)
            // #endif
        },

        getChannelStatus() {
            let admin_status = this.$store.state.setting.systemSetting.admin_status
            let mall_status = this.$store.state.setting.systemSetting.basic.mall_status
            if(admin_status == 0 || mall_status == '0') return
            this.$store.dispatch('setting/getChannelStatus').then(res => {
                if (res) {
                    this.$store.commit('setting/setChannelStatus',res)
                    //#ifdef H5
                    if((isWx && res.wechat==1 ) ||(!is_weixin() && res.h5==1 ) ) {

                        this.$store.commit('setting/setCloseStatus', false)
                        this.$Router.replaceAll({
                            path: '/'
                        })
                    } else {
                        //判断打烊了
                        this.$store.commit('setting/setCloseStatus', true)
                    }
                    //#endif

                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.img-box {
    padding-top: px2rpx(90);

    .close-img {
        display: block;
        margin: 0 auto;
        width: px2rpx(216);
        height: px2rpx(293);
    }

    .close-text {
        margin-top: px2rpx(32);
        font-size: px2rpx(18);
        text-align: center;
        line-height: px2rpx(25);
        color: #969696;
    }
}

.btn {
    margin: px2rpx(90) auto px2rpx(50);
    border-radius: px2rpx(64);
    width: px2rpx(294);
    height: px2rpx(40);

    font-size: px2rpx(16);
    line-height: px2rpx(40);
    text-align: center;
    color: #fff;

    background: #ff3c29;
}
</style>
