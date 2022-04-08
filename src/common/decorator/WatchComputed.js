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
// 实现类似vue的 watch computed
import {deepCompare,deepCopy} from '@/common/objectTools'
export function watch(ctx, obj) {
  if(!obj){
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(ctx, key, ctx.data[key], function(value) {
      obj[key].call(ctx, value)
      // ctx.setData([key])
    })
  })
}
 
export function computed(ctx, obj) {
  if(ctx.data){
    let dataKeys = Object.keys(ctx.data)

    dataKeys.forEach(dataKey => {
      defineReactive(ctx, dataKey, ctx.data[dataKey],function(value){
        ctx.watch?.[dataKey]?.call(ctx,value)
        // ctx.setData([dataKey])
      })
    })
  }
  if(obj){
    let keys = Object.keys(obj)
    let firstComputedObj = keys.reduce((prev, next) => {
      ctx.$target = function() {
        ctx.setData&&ctx.setData({ [next]: obj[next].call(ctx) })
      }
      // obj[next].call(ctx) 执行的时候会触发该函数执行，函数内部的this.data相关属性的调用会触发defineReactive.get
      prev[next] = obj[next].call(ctx)
      ctx.$target = null
      return prev
    }, {})
    // ctx.setData&&ctx.setData(firstComputedObj);
  }
}
 
export function defineReactive(data, key, val, fn) {
  let subs = data['$' + key] || []
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function() {
      if (data.$target) {
        subs.push(data.$target)
        data['$' + key] = subs
      } 
      //val 形成局部作用域保存在函数内部，set的时候会改变该值，所以一直能返回对应的属性值
      return val
    },
    set: function(newVal) {
      // === 不适用判断复杂类型，所以这里引用lodash中的 isEqual 方法
      if (deepCompare(newVal,val)) return
      // console.log('触发set',newVal, new Date().getTime())
      // 经过试验，这里的触发要早于setData的回调
      // fn && fn(newVal) // 可能setData异步 还没及时完成，newVal 是新的，但是this.data里还是旧的
      //这样watch 里去调用对应的方法，可能取的this.data就不是新的
      // 如果fn取的是函数形参，那么可以不用setTimeout，但如果是函数里取得this.data就需要
      setTimeout(() => {
        // 这时候已经完成了setData，fn里取this.data就是最新的
        fn && fn(newVal)
      }, 0)
      if (subs.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
        // 涉及到微任务，宏任务
        setTimeout(() => {
          subs.forEach(sub => sub())
        }, 0)
        // 跟上面那个setTimeout一样，如果函数里用到了this.data,就需要加setTimeout
      }
      val = newVal
    },
  })
} 