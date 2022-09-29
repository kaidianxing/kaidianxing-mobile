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
    <div class="detail-index">
      <!-- 商品图 -->
      <detail-swipe :list="videoList"></detail-swipe>
      <!-- 商品信息 -->
      <detail-info :info-data="infoData" @clickShare="clickShare"></detail-info>
      <!-- 商品活动 -->
      <detail-sale :active-data="activeData" @saleBtn="saleBtn"></detail-sale>
      <!-- 商品规格 -->
      <detail-spec
        v-if="infoData.has_option === '1'"
        :optionChoose="optionChoose"
        @chooseOption="chooseOption"
      ></detail-spec>
      <!-- 商品参数 -->
      <detail-pullup
        v-if="infoData.type === '0'"
        :pull-data="pullData"
      ></detail-pullup>
    </div>
    <!-- 底部导航 -->
    <div class="footer" slot="foot">
      <detail-navbar :sold-out="soldOut" @clickBtn="clickBuy"></detail-navbar>
    </div>

    <!-- 多规格选择 -->
    <goods-picker
      ref="goodsPicker"
      from="creditShop"
      @choose="specPickerChoose"
      @changeNum="optionChangeNum"
      @clickBtn="clickBtn"
    ></goods-picker>
    <!-- 活动弹窗 -->
    <goods-modal
      v-model="activity.show"
      v-if="activity.show"
      :info="activity.info"
      :type="activity.type"
      :title="getTitle"
      @on-refresh="getDetail"
    ></goods-modal>
    <!-- 自提弹窗 -->
    <map-picker ref="mapPicker"></map-picker>
    <!-- 商品详情分享 -->
    <share-modal
      v-model="showShare"
      v-if="showShare"
      :posterUrl="detailInfo.poster_url"
      @share="shareHandler"
    ></share-modal>
    <poster-modal
      v-if="showPoster"
      ref="poster"
      poster-type="creditGoods"
      @mounted="posterShow"
    ></poster-modal>
  </page-box>
</template>

<script>
import DetailSwipe from "./components/detail/DetailSwipe";
import DetailInfo from "./components/detail/DetailInfo";
import DetailSale from "./components/detail/DetailSale";
import DetailSpec from "./components/detail/DetailSpec";
import DetailPullup from "./components/detail/DetailPullup";
import DetailNavbar from "./components/detail/DetailNavBar";
import GoodsPicker from "@/components/goods/GoodsPicker";
import { hasBindBySence } from "@/common/helper/user";
import GoodsModal from "./components/detail/GoodsModal";
import MapPicker from "./components/verify/MapPicker";
import ShareModal from "./components/detail/ShareModal";
import PosterModal from "@/components/poster/PosterModal";
import {
  handleVideo,
  handleExpressFee,
  handleActive,
  createOrder,
  setShareInfo,
  handleSaleBtn,
} from "./components/detail/indexTools";
import {
  CREDIT_GOODS_INVALID_CODE,
  CREDIT_STATUS_CODE,
} from "@/common/variable/statusCode";
// #ifdef MP-TOUTIAO
import EventBus from "@/common/decorator/eventBus.js";
// #endif
import { mapState } from "vuex";

export default {
  name: "detail",
  components: {
    DetailSwipe,
    DetailInfo,
    DetailSale,
    DetailSpec,
    DetailPullup,
    DetailNavbar,
    GoodsPicker,
    GoodsModal,
    MapPicker,
    ShareModal,
    PosterModal,
  },
  props: {},
  data() {
    return {
      id: "", // 积分商品id
      type: "", // 商品type
      videoList: [],
      infoData: {},
      activeData: {},
      pullData: {},
      optionChoose: {
        optionName: "",
      }, // 选中的规格
      optionChoseNum: "1",
      perm: {}, // 是否可以购买
      detailInfo: {},
      activity: {
        show: false,
        info: {}, //商品营销活动信息
        type: "", //商品营销活动类型
      },
      showShare: false,
      showPoster: false,
      soldOut: false, // 售罄
      postData: {}, // 海报数据
    };
  },
  computed: {
    getTitle() {
      if (this.activity.type === "bupeisong") {
        return `${this.activity.info.label}区域`;
      }
      if (this.activity.type === "active") return "活动";
    },
    ...mapState("setting", {
      credit_text: (state) => state.systemSetting.credit_text,
    }),
  },
  created() {
    // #ifndef MP-TOUTIAO
    this.$loading.showLoading();
    // #endif

    // #ifdef MP-TOUTIAO
    EventBus.$off("mounted-child");
    EventBus.$on("mounted-child", (child) => {
      this.$refs.goodsPicker = child;
    });
    EventBus.$off("mounted-mapPicker");
    EventBus.$on("mounted-mapPicker", (child) => {
      this.$refs.mapPicker = child;
    });
    this.$once("hook:beforeDestory", () => {
      EventBus.$off("mounted-child");
      // EventBus.$off('mounted-mapPicker')
    });
    // #endif
  },
  onShow() {
     if (this.$Route.query?.scene) {
       let scene = decodeURIComponent(this.$Route?.query?.scene)
       let paramsArr = scene.split('&')
       let params = paramsArr.filter(item => item.indexOf('id')>-1)
       if (params?.length) {
         this.id =  params?.[0]?.split('=')?.[1]
       }
       this.getDetail();
     }
  },
  mounted() {
    if (this.$Route.query?.id) {
      this.id = this.$Route.query?.id;
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      this.$api.creditShopApi
        .getCreditShopDetail({ id: this.id })
        .then((res) => {
          if (res.error === 0) {
            // handleGoodsData(res)

            this.perm = {
              canBuy: res.perm.buy,
              buy_num: res.data.buy_num,
            };
            this.soldOut = res.credit_shop.credit_shop_stock == 0;
            this.activeData = handleActive(
              res.credit_shop.type,
              res.data.goods,
              res.data?.dispatch_template,
              res?.intracity,
              res?.activity
            );
            this.videoList = handleVideo(res.credit_shop.type, res.data.goods);
            if (res.credit_shop.type === "1") {
              this.infoData = {
                type: res.credit_shop.type,
                has_option: 0,
                min_price: res.credit_shop.min_price,
                min_price_credit: res.credit_shop.min_price_credit,
                origin_min_price: `${res.data.goods.credit}${this.credit_text}+${res.data.goods.balance}元`,
                title: `优惠券：${res.data.goods.coupon_name}`,
                credit_shop_stock: res.credit_shop.credit_shop_stock,
                id: res.data.goods.id,
              };
            } else {
              this.infoData = {
                type: res.credit_shop.type,
                has_option: res.data.goods.has_option,
                min_price: res.credit_shop.min_price,
                min_price_credit: res.credit_shop.min_price_credit,
                origin_min_price: res.data.goods.min_price,
                title: res.data.goods.title,
                sub_title: res.data.goods.sub_title,
                credit_shop_stock: res.credit_shop.credit_shop_stock,
                expressFee: handleExpressFee(
                  res.data.goods,
                  res.data?.dispatch_template,
                  res?.intracity
                ),
                sales: res.credit_shop.sale,
                showsales: res.data.goods?.ext_field?.show_sales != "0",
                goods_type: res.data.goods.type,
                id: res.data.goods.id,
              };
              this.pullData = {
                content: res.data.goods.content,
                params_switch: res.data.goods.params_switch,
                data: res.data.goods.params,
              };
              if (+this.infoData.has_option === 1) {
                this.getOption(res);
              }
            }
            this.detailInfo = res;
            this.postData = {
              id: this.id,
              poster_url: res.poster_url,
              thumb:
                res.credit_shop.type === "1"
                  ? this.$utils.staticMediaUrl(
                      `creditShop/${
                        +res?.data?.goods?.coupon_sale_type === 1
                          ? "full.png"
                          : "discount.png"
                      }`
                    )
                  : res?.data?.goods?.thumb,
              title: this.infoData.title,
              price: `${res.credit_shop.min_price_credit}${this.credit_text}+${res.credit_shop.min_price}元`,
              original_price: this.infoData.origin_min_price,
            };
            //#ifdef H5
            setShareInfo.call(this);
            //#endif
            this.$store.commit("creditShop/setPosterData", this.postData);
            // 往goodsPicker里存值
            this.$store.commit("creditQuickPurchase/setGoodDetail", res);
            // 清除
            this.$store.commit("creditQuickPurchase/setOptionsInfo", {});
          } else {
            // 商品不存在跳转失效页面
            if (
              res.error === CREDIT_GOODS_INVALID_CODE ||
              CREDIT_STATUS_CODE
            ) {
              uni.redirectTo({ url: "/kdxGoods/invalid/index" });
            }
          }
        })
        .finally((rej) => {
          this.$loading.hideLoading();
          setTimeout(() => {
            this.$loading.hideLoading();
          }, 100);
        });
    },
    async getOption() {
      this.$api.creditShopApi
        .getCreditShopOption({ id: this.id })
        .then((res) => {
          if (res.error === 0) {
            this.$store.commit("creditQuickPurchase/setOptionsInfo", res);
          }
        });
    },
    chooseOption() {
      this.$refs?.goodsPicker.toggle(null, "buy", "cacheNum");
    },
    //规格选完回来
    specPickerChoose(specs, options) {
      this.optionChoose = options;
    },
    //数量选完回来
    optionChangeNum(num) {
      this.optionChoseNum = num;
    },
    async clickBuy(type) {
      if (type === "jump") {
        this.$Router.auto({
          path: "/kdxCreditShop/index",
        });
        return;
      }
      // 需要绑定登录
      if (!(await this.$store.dispatch("login/checkLogin"))) {
        return this.$store.commit("login/setModal", true);
      }
      // 需要绑定手机号
      if (hasBindBySence("buy")) {
        return this.$store.commit("login/setModal", true);
      }
      if (this.detailInfo.data.goods?.has_option === "1") {
        this.$refs?.goodsPicker.toggle(null, "buy", "cacheNum");
        return;
      }
      // 单规格表单
      if (
        this.detailInfo.data.goods?.has_option == 0 &&
        this.detailInfo.data.goods?.form_data?.id
      ) {
        this.$refs?.goodsPicker.toggle(null, "buy", "cacheNum");
        return;
      }
      this.clickBtn("buy");
    },
    async clickBtn(type) {
      if (type === "buy") {
        let data = {
          goods_id: this.id,
          option_id: this.optionChoose?.credit_option_id || 0,
          total: this.optionChoseNum,
          detailInfo: this.detailInfo,
          goodDetail: this.detailInfo.data.goods,
          canBuy: this.perm.canBuy,
          buy_num: this.perm.buy_num,
        };
        await createOrder.call(this, data);
      }
    },
    saleBtn(type) {
      handleSaleBtn.call(this, type);
    },
    async clickShare() {
      if (!(await this.$store.dispatch("login/checkLogin"))) {
        return this.$store.commit("login/setModal", true);
      } else if (hasBindBySence("share")) {
        return this.$store.commit("login/setModal", true);
      } else {
        this.showShare = true;
      }
    },
    shareHandler() {
      this.showShare = false;
      this.posterShow();
    },
    posterShow() {
      if (!this.showPoster) {
        this.showPoster = true;
        return;
      }
      this.$refs.poster &&
        this.$refs.poster.toggle((show) => {
          console.log("toggle", show);
        });
    },
  },
  // #ifndef H5
  onShareAppMessage() {
    let url =
      "/kdxCreditShop/detail?id=" +
      this.id +
      "&inviter_id=" +
      this.$store.state.login.userInfo.id;
    return {
      title: this.postData.title,
      imageUrl: this.$utils.mediaUrl(this.postData.thumb),
      // desc: this.goodsData.sub_title,
      path: url,
      success: function () {},
      fail: function () {},
    };
  },
  // #endif
};
</script>

<style lang="scss" scoped>
.detail-index {
  padding-bottom: px2rpx(60);
}
</style>