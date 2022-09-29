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
    <view>
        <view class="user-list">
            <div
                class="user-item van-hairline--bottom"
                v-for="(user,index) in users"
                :key="index"
            >
                <user-item
                    :isLeader="user.member_id == id"
                    :item="user"
                ></user-item>
            </div>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
import UserItem from './components/UserItem'
export default {
    components: {
        UserItem
    },
    computed: {
        ...mapState('order', {
            users: state => state.groupsUser,
            id: state => state.groupLeader
        })
    }
}
</script>


<style lang="scss" scoped>
.user-list {
    margin-top: px2rpx(8);
    padding: 0 px2rpx(12);
    background: #fff;

    .user-item {
        &.van-hairline--bottom:after {
            border-bottom-color: $uni-border-color;
            border-style: solid;
        }

        &:last-child.van-hairline--bottom:after {
            border-width: 0;
        }
    }
}
</style>