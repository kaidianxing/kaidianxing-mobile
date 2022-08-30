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
/* 状态码 */
export const MALL_CLOSE_CODE = [133019, 350000, 211239, 350002, 350001]; // 商城打烊
export const NEED_LOGIN_CODE = 211223; // 需要登录
export const NEED_BIND_MOBILE_CODE = 211222; // 强制绑定手机号
export const INVALID_CODE = 211223; // 登录失效
export const MEMBER_DELETE_CODE = [211237,211247,211294]; // 会员被删除
// export const NO_TOAST = [-1, 333201];  // 无需提示状态码
export const NO_TOAST = [333201];  // 无需提示状态码

export const INVALID_GOODS_CODE = 200420; // 失效商品状态码

// 积分商城相关code
export const CREDIT_GOODS_INVALID_CODE = 520005; // 积分商品失效 商品不存在，删除 下架，或者是id错误
export const CREDIT_STATUS_CODE = 520006; // 积分商城未开启
