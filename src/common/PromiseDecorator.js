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
 * 拦截所有的请求根据策略存入缓存
 * 当缓存存在数据，拿数据，接口继续更新
 * 可以理解先缓存在读取数据。
 *
 * @class PromiseDecorator
 */
let config = require('@/static/settings.js').config
class PromiseDecorator {
  // 获取原Promise
  constructor(Promise, { setting = {} } = {}) {
    this.setting = setting;
    this.Promise = Promise;
    // console.log(this.setting, "@@@");
  }
  // 拦截原来的promise
  then(call = (res) => {}) {
    this.callBack = call;
    this.formatData();
    return this.Promise;
  }
  // 处理数据
  formatData() {
    this.doCache();

    // 走真正的请求返回
    this.Promise.then((res) => {
      try {
        this.callBack(res);

        // 写入缓存
        try {
          if (
            this.setting.needCache &&
            (undefined === this?.setting?.data?.page ||
              1 === +this?.setting?.data?.page)
          ) {
            // uni.setStorageSync(`${this.setting.api}&shop_id=${config.shop_id}`, JSON.stringify(res)); // 修改bug 23984
          }
        } catch (e) {}
      } catch (e) {}
    });
  }
  // 根据策略来拉取缓存的数据
  doCache() {
    if (this.setting.needCache) {
      // 拉取缓存并且返回
      try {
        this.callBack(JSON.parse(uni.getStorageSync(`${this.setting.api}`)));
      } catch (e) {}
    }
  }
  // catch
  catch(call = () => {}) {
    this.Promise.catch(call);
    return this.Promise;
  }
  finally(call = () => {}) {
    this.Promise.finally(call);
    return this.Promise;
  }
}
export default PromiseDecorator;
