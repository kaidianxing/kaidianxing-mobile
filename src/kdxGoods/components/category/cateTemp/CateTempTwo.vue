<template>
    <div class="temp-two">
        <scroll-view
            class="scroll-box"
            scroll-y
        >
            <div
                class="menu-list"
                v-for="(item, index) in list"
                :key="index"
                :class="{
                    'active': active == index
                }"
                @click="clickItem(item.id,index)"
            >
                <div
                    class="menu-title"
                    :class="{
                        'active theme-primary-color': active == index
                    }"
                >{{$utils.showCategoryName(item.name)}}</div>
                <div class="rect theme-primary-bgcolor"></div>
            </div>
        </scroll-view>
    </div>
</template>


<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        active: {
            type: Number,
            default: 0
        }
    },
    methods: {
        clickItem(id, index) {
            if(this.active == index) return;
            this.$emit('on-choose', {
                id, index
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.temp-two {
    width: px2rpx(88);
    height: 100%;

    .scroll-box {
        height: 100%;
    }

    .menu-list {
        position: relative;
        padding-left: px2rpx(6);
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: px2rpx(88);
        height: px2rpx(48);
        line-height: px2rpx(20);
        background: #f5f5f5;
        text-align: center;

        .rect {
            display: none;
        }

        .menu-title {
            width: 100%;
            font-size: px2rpx(12);
            color: #212121;
            white-space: pre-line;
        }

        &.active {
            background: #fff;
            .menu-title {
                font-size: px2rpx(14);
                font-weight: 600;
                color: #ff3c29;
            }

            .rect {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translate(0, -50%);
                width: px2rpx(5);
                height: px2rpx(18);
                display: block;
                background: linear-gradient(
                    104.32deg,
                    #ff3c29 0%,
                    #ff6f29 94.38%
                );
            }
        }
    }
}
</style>