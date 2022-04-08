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
let checker={}
checker.isRequired = (data)=>{
    if (data.params.required) {
        if (!data.params.value) {
            let message = `请填写${data.params.title}`;
            uni.showToast({ title: message, icon: 'none' });
            return false;
        }
    }
    return true;
}
// 数组类型的校验
checker.isRequiredArr = data => {
    if (data.params.required) {
        if (!data.params.value?.length) {
            let message = `请填写${data.params.title}`;
            uni.showToast({ title: message, icon: 'none' });
            return false;
        }
    }
    return true;
}
// city
checker.city = data => {
    if (data.params.required) {
        // 省市
        if (data.params.status === 0) {
            if (!data.params.province || !data.params.city) {
                let message = `请正确填写省市信息`;
                uni.showToast({ title: message, icon: 'none' });
                return false;
            }
        } else if (data.params.status === 1) {
            if (!data.params.province || !data.params.city || !data.params.area) {
                let message = `请正确填写省市区信息`;
                uni.showToast({ title: message, icon: 'none' });
                return false;
            }
        } else if (data.params.status == 2) {
            if (!data.params.province) {
                uni.showToast({ title: '请填写正确的省份信息', icon: 'none' });
                return false;
            }
        }
    }
    return true;
}
// daterange
checker.daterange = data => {
    if (data.params.required) {
        if (!data.params.start.value || !data.params.end.value) {
            let message = `请正确填写日期范围`;
            uni.showToast({ title: message, icon: 'none' });
            return false
        }
    }
    if (data.params.start.value || data.params.end.value) {
        if (new Date(data.params.end.value) < new Date(data.params.start.value)) {
            let message = `开始日期应该小于结束日期`;
            uni.showToast({ title: message, icon: 'none' });
            return false;
        }
    }
    return true;
}
// timerange
checker.timerange = data => {
    if (data.params.required) {
        if (!data.params.start.value || !data.params.end.value) {
            let message = `请正确填写时间范围`;
            uni.showToast({ title: message, icon: 'none' });
            return false
        }
    }
    return true
}
// identity
checker.identity = data => {
    console.log('identity------', data)
    if (data.params.required && !data.params.value) {
        let message = `请正确填写身份证号`;
        uni.showToast({ title: message, icon: 'none' });
        return false
    }
    let valid = true;
    if (data.params.value) {
        if (data.params.value.length !== 15 && data.params.value.length !== 18) {
            let message = `请正确填写身份证号`;
            uni.showToast({ title: message, icon: 'none' });
            return false
        }
        valid = isIDCard(data.params.value);
        if (!valid) {
            uni.showToast({ title: '请填写正确的身份证号', icon: 'none' });
        }
    }

    return valid;
}
// telephone
checker.telephone = data => {
    console.log('telphone------', data)
    if (data.params.required) {
        if (!data.params.value) {
            let message = `请填写手机号码`;
            uni.showToast({ title: message, icon: 'none' });
            return false
        }
    }
    let valid = true;
    if (data.params.value) {
        let reg = new RegExp(/^(^1[3-9]\d{9}$)|(^0\d{2,3}-?\d{7,8}$)$/);
        valid = reg.test(data.params.value);
        console.log('valid-telephone', valid, data.params.value)
        if (!valid) {
            uni.showToast({ title: '请正确填写手机号码', icon: 'none' });
        }
    }
    return valid;
}
export default function (e) {
    if (e.target) {
        let target = e.target;
        let checkerObj = '';
        let requiredId = ['singlelinetext', 'multilinetext', 'selector', 'radios', "datepicker", 'timer'],
            requiredArr = ['pictures', 'checkboxes'];
        if (requiredId.indexOf(target) > -1) {
            checkerObj = checker.isRequired;
        } else if (requiredArr.indexOf(target) > -1) {
            checkerObj = checker.isRequiredArr;
        } else {
            checkerObj = checker[target];
        }
        if (!checkerObj || typeof checkerObj !== 'function') {
            return;
        }
        let data = e.data;
        return  checkerObj(data);
    }
}

const isIDCard = function(obj) {
    let aCity = {11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙 江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖 北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西 藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国 外"};
    let iSum = 0;
    //let info = "";
    let strIDno = obj;
    let idCardLength = strIDno.length;
    let sBirthday;
    if (!/^\d{17}(\d|x)$/i.test(strIDno) && !/^\d{15}$/i.test(strIDno))
        return false; //非法身份证号

    if (aCity[parseInt(strIDno.substr(0, 2))] == null)
        return false;// 非法地区

    // 15位身份证转换为18位
    if (idCardLength == 15)
    {
        sBirthday = "19" + strIDno.substr(6, 2) + "-" + Number(strIDno.substr(8, 2)) + "-" + Number(strIDno.substr(10, 2));
        let d = new Date(sBirthday.replace(/-/g, "/"))
        let dd = d.getFullYear().toString() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        if (sBirthday != dd)
            return false; //非法生日
        strIDno = strIDno.substring(0, 6) + "19" + strIDno.substring(6, 15);
        strIDno = strIDno + GetVerifyBit(strIDno);
    }

    // 判断是否大于2078年，小于1900年
    let year = strIDno.substring(6, 10);
    if (year < 1900 || year > 2078)
        return false;//非法生日

    //18位身份证处理

    //在后面的运算中x相当于数字10,所以转换成a
    strIDno = strIDno.replace(/x$/i, "a");

    sBirthday = strIDno.substr(6, 4) + "-" + Number(strIDno.substr(10, 2)) + "-" + Number(strIDno.substr(12, 2));
    let d = new Date(sBirthday.replace(/-/g, "/"))
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
        return false; //非法生日
    // 身份证编码规范验证
    for (let i = 17; i >= 0; i --)
        iSum += (Math.pow(2, i) % 11) * parseInt(strIDno.charAt(17 - i), 11);
    if (iSum % 11 != 1)
        return false;// 非法身份证号

    // 判断是否屏蔽身份证
    let words = new Array();
    words = new Array("11111119111111111", "12121219121212121");

    for (let k = 0; k < words.length; k++) {
        if (strIDno.indexOf(words[k]) != -1) {
            return false;
        }
    }

    return true;
}
