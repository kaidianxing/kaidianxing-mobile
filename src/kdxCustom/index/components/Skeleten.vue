<template>
    <div>
        <div class='app-loading-skeleten'>
            <div class="swiper"></div>
            <div class="btns">
                <p class="btn"></p>
                <p class="btn"></p>
                <p class="btn"></p>
                <p class="btn"></p>
            </div>
            <div class="content content1"></div>
            <div class="content content2"></div>
            <div class="content content3"></div>
            <div class="content content1"></div>
            <div class="content content2"></div>
            <div class="content content3"></div>
            <div class="content content1"></div>
            <div class="content content2"></div>
            <div class="content content3"></div>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss" scoped>

    .app-loading-skeleten {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:#fff;
        z-index: 10000;
    }
    .app-loading-skeleten .swiper {
        width: 93.6vw;
        height: 37.8vw;
        background: #ddd;
        border-radius: 1vw;
        margin: 2vw auto;
    }
    .app-loading-skeleten .btns {
        width: 93.6vw;
        height: 23vw;
        border-radius: 1vw;
        margin: 2vw auto;
        display: flex;
        justify-content: space-around;
    }
    .app-loading-skeleten .btn {
        width: 12vw;
        height: 12vw;
        background: #ddd;
        border-radius: 50%;
        margin: auto;
        position: relative;
    }
    .app-loading-skeleten .content {
        margin: 2vw auto;
        width: 90vw;
        height: 3vw;
        background: #ddd;
        border-radius: 1vw;
    }
    .app-loading-skeleten .content1 {
        margin-left: 3.2vw;
    }
    .app-loading-skeleten .content2 {
        width: 60vw;
        margin-left: 3.2vw;
    }
    .app-loading-skeleten .content3 {
        width: 30vw;
        margin-left: 3.2vw;
        margin-bottom: 6vw;
    }
</style>