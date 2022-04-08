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
/**
 * loading 数据模型
 * @author Gao
 */
export default {
  namespaced: true,
  state: {
    /**
     * style 风格根据后台返回，
     * 选择用户自定义的还是默认，默认是选择系统默认的，
     * -99 没有拿到任何数据。
     */
    style: -99,
    // 如果用户用的是系统后台默认的，会有样式规则。类似装修的意思。
    styleRules: {},
    // 是否显示loading默认就不显示
    isShowLoading: false,
    // 如果是用户自定义的图片有
    imgUrl: "",
    // 是否加载配置文件了
    isConfig: false,
  },
  mutations: {
    setLoadState(state, flg = true) {
      // console.error(flg, "@##$$%%");
      state.isShowLoading = flg;
    },
    setStyle(state, flg = -1) {
      state.style = flg;
    },
    setStyleRules(state, rule = {}) {
      state.styleRules = rule;
    },
    setImgUrl(state, imgUrl = "") {
      state.imgUrl = imgUrl;
    },
    setIsConfig(state, flg = true) {
      state.isConfig = true;
    },
    // 页面首次加载开始获取数据
    setOtherData(state, info = {}) {
      const call = () => {
        try {
        // 加载样式
          const result = {
            color: "#FF1F2C",
            style: 0,
            type: 1,
          };
          // 写入缓存
          state.style = 0 === +result.type ? -1 : +result.style;
          state.styleRules = {
            color: result.color,
          };
          // console.error(state, "ding.luchaokings");
          state.imgUrl = result.imgUrl;
          state.isConfig = true;

        } catch (e) {}
      };

      if (!info.ispull && !info.go) {
        // 起轮训来判断是否更新实图
        this.timer = setInterval(() => {
          if (!state.isShowLoading) {
            clearInterval(this.timer);
            call();
          }
        }, 50);
      } else {
        call();
      }
    },
  },
  actions: {
    getLoadState({ commit, state }, result = {}) {
      let cacheRes = result;
      // console.error(result, "sqx");
      if (result?.mobile_loading) {
        result = { ...result?.mobile_loading, nocache: result?.nocache };
      } else {
        // 测试数据
        result = {
            
          color: "#FF1F2C",
          style: 0,
          type: 1,
        };
      }
      // 数据转换
      const { color = "#FF1F2C", style = 0, type = 1 } = result || {};
      const INFO = {
        style: 0 === +type ? -1 : +style,
        styleRules: {
          color,
        },
        imgUrl: "",
      };

      // 赋值
      if (result?.nocache) {
        commit("setStyle", INFO.style);
        commit("setStyleRules", INFO.styleRules);
        commit("setImgUrl", INFO.imgUrl);
        commit("setIsConfig", true);
      }

      // 落入缓存
      try {
        if (!result?.nocache) {
          uni.setStorageSync("loading", JSON.stringify(cacheRes));
        }
      } catch (e) {}

      // 获取接口数据
      // 设置数据
    },
  },
  getters: {
    // 是否加载骨架屏 isSkeleton
    isSkeleton(state) {
      return state.isShowLoading && -1 === state.style;
    },
  },
};
