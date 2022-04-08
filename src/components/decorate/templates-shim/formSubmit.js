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
/***
 *   此处用于系统表单对于表单数据的处理方法
 ***/
import formChecker from "@/components/decorate/templates-shim/formChecker";
import * as $utils from '@/common/util.js'
export default (form) => new Promise(async (resolve, reject) => {
        let content = form.content,
            valid = true;
        for (let item of content) {
            let validItem = formChecker({
                target: item.id,
                data: item
            });
            if (!validItem) {
                valid = validItem;
                break;
            }
            // 如果是图片则进行上传处理
            if (item.id === 'pictures' && item.params.value ?.length) {
                let reg = /^((blob:){0,1}(http|https):\/\/(tmp\/wx){0,1})|(wxfile:\/\/tmp_)|(ttfile:\/\/temp\/)\w*/;
                let imageList = item.params.value.filter(imgItem => reg.test(imgItem));
                if (imageList.length) {
                    let imgRes = await $utils.multipleFilesUpload(imageList);
                    let i = 0;
                    item.params.value.forEach((imgItem, index) => {
                        if (reg.test(imgItem)) {
                            item.params.value[index] = imgRes[i];
                            i += 1;
                        }
                    })
                }
            }
        }
        if (!valid) return;
        resolve({
            form_id: form.id,
            content: JSON.stringify(form.content)
        })
    })
