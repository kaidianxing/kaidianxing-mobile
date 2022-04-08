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
import Store from "@/store";
import api from "@/api";

export default {
  showLoading() {
    Store.commit("loading/setLoadState", true);
  },
  hideLoading() {
    Store.commit("loading/setLoadState", false);
  },
  async setOtherData(ispull = false) {
    return new Promise((resolve, reject) => {
      // 缓存名称
      const CACHE_NAME = "loadingCache";
      // 默认数据
      const MOBILE_LOADING = {
        mobile_loading: {
          color: "#FF1F2C",
          style: 0,
          type: 1,
        },
      };
      // 如果是第一次进来，既没有缓存，也没有接口数据，直接写死骨架屏。
      if (!ispull) {
        // 不是下拉刷新
        // 获取cache

        try {
          res = JSON.parse(uni.getStorageSync(CACHE_NAME));
        } catch (e) {
          res = MOBILE_LOADING;
        }
        res = {
          ...res,
          ispull,
          go: true, //直接放行
        };

        Store.commit("loading/setOtherData", res);
      }

      // 是否是下拉刷新
      // res.ispull = ispull;

      // 可以作为正常的增量更新
      Store.dispatch('setting/getSysSetting').then((res) => {
        if (0 === +res.error) {
          try {
            res.core_settings.ispull = ispull;
          } catch (e) {}
          let copyright = {
            "mobile_loading": {
              "type": 1,
              "style": 2,
              "color": "#FF1F2C"
            },
            "copyright": {
              "copyright_info": "<p>Copyright 2020-2022 青岛开店星信息技术有限公司版权所有<br/> <br/>网站备案号/许可证号：鲁ICP备2021028233号-1</p>",
              "open": 1
            }
          }
          Store.commit("loading/setOtherData", copyright);
          // 写入缓存
          try {
            uni.setStorageSync(CACHE_NAME, JSON.stringify(copyright));
          } catch (e) {
            // todo
          }
        } else {
          Store.commit("loading/setOtherData", {
            ...MOBILE_LOADING,
          });
        }

        resolve(1);
      });
    });
  },
};
