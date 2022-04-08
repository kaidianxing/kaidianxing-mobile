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
export const getReg = (path) => {
    if (path) {
        let tmp=path.replace(/:.+?((?=\/)|$)/g, '.+'); 
        let reg = new RegExp('^' + tmp + '$')
        return reg;
    }
    return new RegExp('')
}
export const menuTraverser = (obj, callback) => {//递归遍历菜单
    function traverse(obj, index, key) {
        callback && callback(obj, index, key);//index为层数，obj为当前访问的对象
        if (obj && obj.children) {
            for (var i in obj.children) {
                traverse(obj.children[i], index + 1, i)
            }
        }
    }
    traverse(obj, 0, '');
    return obj;
}
export const searchPath = (tree, wantPath = '', deep = true) => {//查询menu树结构子节点路径,deep深度遍历
    let path = null;
    function forTree(obj, arr = []) {
        if (obj instanceof Array) {
            for (let i = 0; i < obj.length; i++) {
                if (path) {//查到就停止
                    return;
                }
                forTree(obj[i], arr);
            }
        } else if (obj instanceof Object) {
            let reg = obj.path && getReg(obj.path)
            if (obj.path && reg.test(wantPath)) {
                path = [...arr, obj]
            } else {
                if (obj.children) {
                    forTree(obj.children, [...arr, obj])
                } else {
                    for (let k in obj) {
                        if (typeof obj[k] == 'object') {
                            forTree(obj[k], arr)
                        }
                    }
                }
            }
        }
    }
    function deepForTree(obj, arr = []) {
        if (obj instanceof Array) {
            for (let i = 0; i < obj.length; i++) {
                if (path && arr.length < path.length) {
                    return
                }
                deepForTree(obj[i], arr);
            }
        } else if (obj instanceof Object) {
            let reg = obj.path && getReg(obj.path)
            if (obj.path && reg.test(wantPath)) {
                path = [...arr, obj];
            }
            if (obj.children) {
                deepForTree(obj.children, [...arr, obj])
            } else {
                for (let k in obj) {
                    if (typeof obj[k] == 'object') {
                        if (path && arr.length < path.length) {
                            return
                        }
                        deepForTree(obj[k], arr);
                    }
                }
            }
        }

    }

    if (deep) {
        deepForTree(tree)
    } else {
        forTree(tree);
    }
    return path || [];
}