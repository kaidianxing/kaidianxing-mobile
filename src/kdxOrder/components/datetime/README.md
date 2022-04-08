# 说明
本组件是日期加时间的选择组件，可以同时选中日期和时间
# 引入说明
```javascript
import DateTime from '@/kdxOrder/components/datetime/index.vue'
export default {
    components: {DateTime}
}
```
# 属性说明
| 属性名称 | 类型 | 默认值 | 说明 |
|------ | ------ | ------ | ------ |
| date | String | | 当前选中和展示的数据 |
| start | String | 2000-01-01 00:00 | 默认展示的最早时间，时间选择器从这里开始 |
| end | String | 2099-12-31 23:59 | 默认展示的最晚时间，时间选择器时间到这里终止 |
| default | String | start | 选择器打开默认展示的是开始的时间还是终止的时间 |  
| placeholder | String |  | 和input的placeholder一样 |
# event
| 事件名称 | 说明 | 返回参数 |
| ------ | ------ | ------ |
| on-ok | 点击确定执行的函数 | date 当前选中的时间 |
# tips
准对苹果机中出现的时间格式要求比较严格的问题，在年份中使用 2020/01/01 代替2020-01-01 ，虽然代码中增加了数据校正，但是防止意外，还是修正下比较好
