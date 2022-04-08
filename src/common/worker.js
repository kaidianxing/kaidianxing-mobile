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
class serviceWorker {
    worker = null;
    constructor() {
        if (this.worker) {
            this.worker.terminate();
        }
        //#ifdef H5
        this.worker = new Worker('/static/h5/worker/index.js');
        //#endif
        //#ifdef MP-WEIXIN
        this.worker = wx.createWorker('wxcomponents/worker/index.js');
        //#endif
    }
    onMessage(callback) {
        //#ifdef H5
        this.worker.onmessage = res => {
            callback(res.data)
        };
        //#endif
        //#ifdef MP-WEIXIN
        this.worker.onMessage(res => {
            callback(res.msg)
        });
        //#endif
        return this
    }
    postMessage(data) {
        this.worker.postMessage({
            msg: data
        })
        return this
    }
    initWorker() {
        this.worker.terminate();
        //#ifdef H5
        this.worker = new Worker('/static/h5/worker/index.js');
        //#endif
        //#ifdef MP-WEIXIN
        this.worker = wx.createWorker('wxcomponents/worker/index.js');
        //#endif
        return this
    }
}
export default serviceWorker