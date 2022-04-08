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
import Schema from 'async-validator';

export const validMobile = ({ field }, val, callback) => {
    let reg = /^1[3456789]\d{9}$/
    if (!val) {
        callback('手机号不能为空')
    } else if (!reg.test(val)) {
        callback('请输入正确的手机号')
    } else {
        callback()
    }
}

export const validCode = ({ field }, val, callback) => {
    let reg = /^\d{6}$/
    if (!val) {
        callback('验证码不能为空')
    } else if (!reg.test(val)) {
        callback('请输入正确的手机号验证码')
    } else {
        callback()
    }
}

export const validVerify = ({ field }, val, callback) => {
    if (!val) {
        callback('图形验证码不能为空')
    } else if (val.length !== 4) {
        callback('请输入正确的图形验证码')
    } else {
        callback()
    }
}



export const validPass = (rule, value, callback) => {
    let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/
    if (value === '') {
        callback('请输入密码')
    } else if (!reg.test(value)) {
        callback('请输入正确格式的密码')
    } else {
        callback()
    }
}


export const validate = (rules, data, cb) => {
    validateField(rules, data).
        then(() => {
            cb(null)
        }).catch(({ fields }) => {
            let errMsg = null
            if (fields) {
                errMsg = {}
                Object.keys(fields).forEach(key => {
                    errMsg[key] = fields[key][0].message
                })
            }
            cb(errMsg)
        }
        )
}

export const validateField = (rules, data) => {
    let validtor = new Schema(rules)

    return validtor.validate(data)
}