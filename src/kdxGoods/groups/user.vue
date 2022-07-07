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