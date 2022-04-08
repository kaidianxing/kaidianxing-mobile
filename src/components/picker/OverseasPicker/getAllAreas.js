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
import $api from 'api'

class getAllAreas {
    result = { error: -1 };
    allProvinces = [];
    allCities = [];
    allAreas = [];
    allOverseas = [];
    curProvince = null;//当前省
    curCity = null;//当前市
    curArea = null;//当前区
    curOversea = null;//当前海外地址 
    // 热门
    allHotProvinces = [];
    allHotCities = [];
    allHotAreas = [];
    allHotOverseas = [];
    curHotProvince = null;//当前省
    curHotCity = null;//当前市
    curHotArea = null;//当前区
    curHotOversea = null;//当前海外地址 
    constructor() {}
    /**
     * // 获取快递地址全部数据
     * @param {*} data 
     */
    requestAllAreas() {
        return new Promise((resolve, reject) => {
            if (this.result.error == 0) {
                resolve(this.result)
            } else {
                $api.memberApi.getAddressBase().then(res => {
                    if(res.error==0){
                        this.allProvinces = [];
                        this.allHotProvinces = [];
                        this.allOverseas = this.flatObj(res.result.country||[]);
                        this.allHotOverseas = res.result.hotCountry||[];
                        this.result = res;
                        this.allProvinces = this.flatObj(res.result.list);
                        this.allHotProvinces = res.result.hot;
                        resolve(res)
                    }

                }, {}, res => {
                    reject();
                });
            }
        })
    };
    /**
     * 将{A:[],B:[],...}转为【{letterId：'A'}，{letterId：'B'}】
     * @param {} area 
     */
    flatObj(area) {
        let list = [];
        for (let k in area) {
            list = list.concat(area[k].map(item => {
                item.letterId = k;
                return item;
            }));
        }
        return list;
    }
    getProvince(name = '', hot = false) {
        let result = this.result;
        let curProvince = hot ? this.curHotProvince : this.curProvince;
        let allProvinces = hot ? this.allHotProvinces : this.allProvinces;
        
        if (result.error == 0 && name) {
            if (curProvince && (name == curProvince.name || name == curProvince.code_id)) {
                return curProvince
            } else {
                let res = null;
                let tmp = null;
                for (let i = 0; i < allProvinces.length; i++) {
                    tmp = allProvinces[i];
                    if (tmp.name == name || tmp.code_id == name) {
                        res = tmp;
                        break;
                    }
                }
                let list = res ? res.list : {};
                let allCities = this.flatObj(list);
                this[`cur${hot ? 'Hot' : ''}Province`] = res;
                this[`cur${hot ? 'Hot' : ''}City`] = null;
                this[`cur${hot ? 'Hot' : ''}Area`] = null;
                this[`all${hot ? 'Hot' : ''}Cities`] = allCities;
                return res
            }

        } else {
            return [];
        }
    };
    getProvinces(hot = false) {
        let provs = hot ? this.allHotProvinces : this.allProvinces;
        return provs||[]
    }
    getCity(name = '', hot = false) {
        let result = this.result;
        let curCity = hot ? this.curHotCity : this.curCity;
        let curProvince = hot ? this.curHotProvince : this.curProvince;
        if (result.error == 0 && name) {
            if (curCity && (name == curCity.name || name == curCity.code_id)) {
                return curCity;
            } else {
                let tmp = null;
                let res = null;
                if (curProvince) {
                    let allCities = this[`all${hot ? 'Hot' : ''}Cities`];
                    for (let i = 0; i < allCities.length; i++) {
                        tmp = allCities[i];
                        if (tmp.name == name || tmp.code_id == name) {
                            res = tmp;
                            break;
                        }
                    }
                    let list = res ? res.list : {};
                    let allAreas = this.flatObj(list);
                    this[`cur${hot ? 'Hot' : ''}City`] = res;
                    this[`cur${hot ? 'Hot' : ''}Area`] = null;
                    this[`all${hot ? 'Hot' : ''}Areas`] = allAreas;
                    return res;
                }
                return null;
            }
        } else {
            return null;
        }
    }
    getCities(hot = false) {
        let cities = hot ? this.allHotCities : this.allCities;
        return cities
    }
    getArea(name = '', hot = false) {
        let result = this.result;
        let curArea = hot ? this.curHotArea : this.curArea;
        let curCity = hot ? this.curHotCity : this.curCity;
        if (result.error == 0 && name) {
            if (curArea && (name == curArea.name || name == curArea.code_id)) {
                return curArea
            } else {
                let tmp = null;
                let res = null;
                if (curCity) {
                    let allAreas = this[`all${hot ? 'Hot' : ''}Areas`];
                    for (let i = 0; i < allAreas.length; i++) {
                        tmp = allAreas[i];
                        if (tmp.name == name || tmp.code_id == name) {
                            res = tmp;
                            break;
                        }
                    }
                    this[`cur${hot ? 'Hot' : ''}Area`] = res;
                    return res;
                }
                return null;
            }

        } else {
            return null;
        }
    }
    getAreas(hot = false) {
        let areas = hot ? this.allHotAreas : this.allAreas;
        return areas
    }
    getOversea(name = '', hot = false) {
        let result = this.result;
        let curOversea = hot ? this.curHotOversea : this.curOversea;
        let allOverseas = hot ? this.allHotOverseas : this.allOverseas;
        if (result.error == 0 && name) {
            if (curOversea && (name == curOversea.name || name == curOversea.code_id)) {
                return curOversea
            } else {
                let res = null;
                let tmp = null;
                for (let i = 0; i < allOverseas.length; i++) {
                    tmp = allOverseas[i];
                    if (tmp.name == name || tmp.code_id == name) {
                        res = tmp;
                        break;
                    }
                }
                this[`cur${hot ? 'Hot' : ''}Oversea`] = res;
                return res
            }
        }
        return null;
    }
    getOverseas(hot = false) {
        let areas = hot ? this.allHotOverseas : this.allOverseas;
        return areas
    }
}


export default new getAllAreas();