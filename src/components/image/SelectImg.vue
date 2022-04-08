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
    <view class="add-list">
        <view
            class="add-list-items"
            v-for="(item, index) in imgLists"
            :key="index"
        >
            <image
                :src="$utils.mediaUrl(item)"
                :data-imgurl="item"
                @click.stop="showImgs"
                class="add-list-image"
            />
            <view
                class="iconfont-m- icon-m-no1 add-list-remove"
                :style="{ color: closeBtnColor }"
                @click.stop="removeImg"
                :id="'items-img-' + index"
                v-if="!readonly"
            ></view>
            <slot name="foot" :row="item"></slot>
        </view>
        <view
            class="add-list-items add-list-btn"
            @click.stop="addImg"
            v-if="imgLists.length < maxFileNumber && !readonly"
        >
            <text class="iconfont-m- icon-m-jiahao btn" style='font-size:32rpx;margin-bottom:20rpx;'></text>
            <view class="add-list-btn-text">{{ btnName }}</view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        maxFileNumber: {
            type: Number,
            default: 9,
        },
        btnName: {
            type: String,
            default: '添加图片',
        },
        items: {
            type: Array,
            default: function() {
                return []
            },
        },
        closeBtnColor: {
            type: String,
            default: '#666666',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        // 上传之前的校验
        beforeUpload: {
            type: Function
        }
    },
    data() {
        return {
            imgLists: [],
            uploadSet: {
                max_size: 1024,
                extensions: ['gif', 'jpg', 'png', 'jpeg'],
            },
            isLoadSet: false,
        }
    },
    created: function() {
        this.imgLists = this.items
    },
    watch: {
        imgLists: function(newVal, oldVal) {
            this.$emit('change', newVal)
        },
    },
    methods: {
        getUploadOpt() {
            this.$api.orderApi.getUploadSet().then((res) => {
                if (res.error == 0) {
                    this.isLoadSet = true
                    this.uploadSet = {
                        ...this.uploadSet,
                        ...res.settings?.image,
                    }
                }
            })
        },
        addImg: async function() {
            // #ifdef MP-TOUTIAO
            if(this.$parent?.beforeUpload){
                // 传进来的Function 在编译时function 为null,
                const res = await this.$parent.beforeUpload()
                if(!res) return
            }
            // #endif

            if(this.beforeUpload) {
                // #ifdef H5
                const res= await this.beforeUpload()
                // #endif
                // #ifdef MP-WEIXIN
                // 修复this指向
                // 传进来的Function 在编译时this指向了当前组件
                const res = await this.beforeUpload.call(this.$parent)
                // #endif
                if(!res) return
            }
            if (!this.isLoadSet) {
                await this.getUploadOpt()
            }

            var num = this.maxFileNumber - this.imgLists.length
            if (num < 1) {
                return false
            }
            //  设置表单中图片选择状态
            this.$store.commit('form/setIsChooseImage', true)
            uni.chooseImage({
                count: num,
                sizeType: ['compressed'],
                success: (res) => {
                    let reg = new RegExp(
                        `\.(${this.uploadSet.extensions.join('|')})$`,
                        'i'
                    )
                    let list = []
                    res.tempFiles.forEach((v) => {
                        if (v.size / 1024 > this.uploadSet.max_size) {
                            this.$toast(
                                `单个文件大小不能超过${this.uploadSet.max_size}KB`
                            )
                        }
                        // #ifdef H5
                        else if (!reg.test(v.name)) {
                            this.$toast(
                                `只支持后缀名为${this.uploadSet.extensions.join(
                                    ','
                                )}的文件`
                            )
                        }
                        // #endif
                        // #ifdef MP-WEIXIN
                        else if (!reg.test(v.path)) {
                            this.$toast(
                                `只支持后缀名为${this.uploadSet.extensions.join(
                                    ','
                                )}的文件`
                            )
                        }
                        // #endif
                         else {
                            list.push(v.path)
                        }
                    })
                    this.imgLists = this.imgLists.concat(
                        list.splice(0, this.maxFileNumber)
                    )
                },
                complete: () => {
                    setTimeout(() => {
                        //  设置表单中图片选择状态
                        this.$store.commit('form/setIsChooseImage', false)
                    }, 500)
                }
            })
        },
        removeImg: function(e) {
            var index = e.currentTarget.id.replace('items-img-', '')
            this.imgLists.splice(index, 1)
        },
        showImgs: function(e) {
            let currentImg = this.$utils.mediaUrl(e.currentTarget.dataset.imgurl)
            let imgList = this.imgLists.map(item => this.$utils.mediaUrl(item));
            uni.previewImage({
                urls: imgList,
                current: currentImg,
            })
        },
        setItems: function(items) {
            this.imgLists = items
        },
    },
}
</script>
<style lang="scss" scoped>
.add-list {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}
.add-list-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.add-list-btn-text {
    font-size: 20rpx;
    line-height: 28rpx;
    text-align: center;
    color: $uni-text-color-grey;
    width: 100%;
}

.btn {
    font-size: 54rpx;
    color: $uni-text-color-grey;
}

.add-list-items {
    box-sizing: border-box;
    width: 120rpx;
    height: 120rpx;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
    font-size: 0;
    position: relative;
    border: 2rpx solid #e6e7eb;
    border-radius: 4rpx;
    &.add-list-btn {
        border: 2rpx dashed #e6e7eb;
    }
    &:last-child {
        margin-right: 0;
    }
}
.add-list-image {
    height: 100%;
    width: 100%;
    border-radius: 4rpx;
}
.add-list-remove {
    text-align: center;
    font-size: 30rpx;
    position: absolute;
    z-index: 1;
    right: 0;
    top: 0;
    color: $uni-text-color-grey;
    transform: translate(50%, -50%);
}
</style>
