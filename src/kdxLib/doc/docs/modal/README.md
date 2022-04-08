
<style lang="scss">
// Prefix
$css-prefix: kdx-;

// variable
$c0: #212121;
$c1: #ffffff;
$c2: #ff3c29;
$c3: #ff6f29;
$c4: #cccccc;
$c5: transparent;
$c6: #ffd600;
$c7: #e6e7eb;
$c8: #379fff;
$c9: #2f82ff;
$c10: #09c15f;
$c11: #F5F5F5;
$c12:#FFEFE6;
$c13:#2D8CF0;
$c14:#F0FAFF;
$c15:#969696;
$c16:#FFF3F5;
$c17:#E6FFF9;
$c18:#00A0EE;
$c19:#000000;

// width
$w: 100%;

// inline-block
.ib{
  display: inline-block;
}

.flex {
  display: flex;
}

// function
@function px2rpx($n) {
  @return $n * 1 + px;
}

// mixin
@mixin height($size: 0) {
  height: px2rpx($size);
  line-height: px2rpx($size);
  // #ifdef H5
  line-height: px2rpx($size - 3);
  // #endif
  // set button border-radius important
  border-radius: px2rpx($size / 2) !important;
}

@mixin lh($size: 0) {
  height: px2rpx($size);
  line-height: px2rpx($size);
}

@mixin wh($size: 0) {
  width: px2rpx($size);
  height: px2rpx($size);
}

@mixin allResize($size, $br, $fsize, $b) {
  width: px2rpx($size);
  height: px2rpx($size/$b);
  line-height: px2rpx($size/$b);
  border-radius: px2rpx($br);
  font-size: px2rpx($fsize);
}

@mixin lt12($size, $b){
  transform:scale($b);
  display:inline-block;
  white-space:nowrap;
  margin-left:- px2rpx($size);
}

// resize
.h32 {
  @include height(32);
}
.h34 {
  @include height(34);
}
.h40 {
  @include height(40);
}
// plv
.plv{
    position: relative;
}

// icon
.icon{
  font-size: px2rpx(12);
  // color: $c15;
}



/* --------uni.scss移入---------- */

.van-hairline, 
.van-hairline--bottom,
.van-hairline--left,
.van-hairline--right,
.van-hairline--surround,
.van-hairline--top,
.van-hairline--top-bottom {
    position: relative;
}

// 一像素边框
.van-hairline--bottom:after,
.van-hairline--left:after,
.van-hairline--right:after,
.van-hairline--surround:after,
.van-hairline--top-bottom:after,
.van-hairline--top:after,
.van-hairline:after {
    content: ' ';
    position: absolute;
    pointer-events: none;
    box-sizing: border-box;
    -webkit-transform-origin: center;
    transform-origin: center;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
}

.van-hairline--top:after {
    border-width: 1px 0 0 0;
}

.van-hairline--left:after {
    border-width: 0 0 0 1px;
}

.van-hairline--right:after {
    border-width: 0 1px 0 0;
}

.van-hairline--bottom:after {
    border-width:  0 0 1px 0;
}

.van-hairline--top-bottom:after {
    border-width: 1px 0;
}
// Button
$btn-prefix-cls: $css-prefix + "btn";
.#{$btn-prefix-cls} {
  &:focus{
    outline: none;
  }
  @include height(34);
  border-radius: px2rpx(64);
  background: $c2;
  color: $c1;
  font-size: px2rpx(16);
  font-weight: normal;
  width: 100%;
  border: 0;
  // margin: 0 auto;
  &::after {
    border: 0;
  }

  &.ghost[disabled] {
    border: 1px solid $c7;
    color: $c4 !important;
    background: $c5 !important;
  }
  &[disabled] {
    background: $c4 !important;
    color: $c1 !important;
  }

  // type 控制颜色
  &.primary.ghost,
  &.default.ghost {
    background: $c5;
    border: 1px solid $c2;
    color: $c2;
  }

  &.primary {
    border-radius: px2rpx(20);
    font-size: px2rpx(14);
  }

  &.do {
    background: linear-gradient(132.57deg, $c2 0%, $c3 94.38%);
    font-size: px2rpx(14);
    font-weight: 500;
    &.ghost {
      background: $c5;
      border: 1px solid $c2;
      color: $c2;
    }
  }

  &.know {
    border-radius: px2rpx(20);
    background: $c6;
    color: $c2;
    font-weight: 500;
    &.ghost {
      border: 1px solid $c2;
      background: $c5;
      color: $c6;
    }
  }

  &.finished {
    border-radius: px2rpx(20);
    background: $c4;
    font-size: px2rpx(14);
    font-weight: 500;
    color: $c1;
  }

  &.do-get {
    border-radius: px2rpx(80);
    background: linear-gradient(132.57deg, $c2 0%, $c3 94.38%);
    font-size: px2rpx(12);
    color: $c1;
    &.ghost {
      background: linear-gradient(309.84deg, $c8 7.21%, $c9 92.67%);
    }
  }

  &.text {
    border-radius: px2rpx(11);
    background: $c5;
    border: 1px solid $c2;
    font-size: px2rpx(12);
    color: $c2;
    &.ghost {
      border: 1px solid $c7;
      background: $c5;
      color: $c0;
    }
  }

  &.success {
    background: $c10;
    border-radius: px2rpx(14);
    font-size: px2rpx(12);
    color: $c1;
    &.ghost {
      background: $c5;
      border: 1px solid $c10;
      color: $c10;
    }
  }

  &.small {
    @include height(28);
    // by Houqiang update
    font-size: px2rpx(12) !important;
    font-weight: normal !important;
  }
  &.middle {
    @include height(38);
    // by Houqiang update
    font-size: px2rpx(14) !important;
    font-weight: 500 !important;
  }
  &.large {
    @include height(40);
  }

  // theme
  &.hollow {
    border-radius: px2rpx(20);
    background: $c5;
    box-sizing: border-box;
    border: 1px solid $c2;
    color: $c2;
    font-size: px2rpx(14);
    font-weight: 600;
  }
  &.theme0 {
    border-radius: px2rpx(20);
    background: $c6;
    color: $c2;
    border: 0;
    font-size: px2rpx(16);
    font-weight: 500;
  }
  &.theme1 {
    border-radius: px2rpx(20);
    background: $c4;
    color: #ffffff;
    font-size: px2rpx(14);
  }
  &.theme2 {
    border-radius: px2rpx(20);
    color: #ffffff;
    font-size: px2rpx(14);
  }
}

// ButtonGroup
$btn-group-prefix-cls: $css-prefix + "button-group";
.#{$btn-group-prefix-cls} {
  width: 100%;
  display: flex;
  .group {
    flex: 1;
    &.kdx-btn,
    .kdx-btn {
      font-weight: 500;
      font-size: px2rpx(14);
    }

    &:not(:first-child):not(:last-child) {
      &.kdx-btn,
      .kdx-btn {
        border-radius: 0 !important;
      }
    }

    &:first-child {
      &.kdx-btn,
      .kdx-btn {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }
    }
    &:last-child {
      &.kdx-btn,
      .kdx-btn {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
  }
  &.entity,
  &.hollow {
    .group {
      &:first-child {
        &.kdx-btn,
        .kdx-btn {
          background: $c1;
          border: 1px solid $c7;
          border-right: 0;
          box-sizing: border-box;
          color: $c0;
        }
      }
    }
  }
  &.entity {
    .group {
      &.kdx-btn,
      .kdx-btn {
        // font-weight: normal;
      }
      &:first-child {
        &.kdx-btn,
        .kdx-btn {
          background: $c0;
          border: 0;
          color: $c1;
        }
      }
    }
  }
  &.simple.entity {
    .group {
      &.kdx-btn,
      .kdx-btn {
        background: linear-gradient(132.57deg, $c2 0%, $c3 94.38%);
        &.small {
          @include height(28);
        }

        &.middle {
          @include height(38);
        }
      }
    }
  }
}

// modal
$modal-wrap: $css-prefix + 'modal-wrap';
.#{$modal-wrap} {
  flex-direction: column;
  width: px2rpx(245);
  min-height: px2rpx(137);
  max-height: px2rpx(400);
  background-color: $c1;
  border-radius: px2rpx(6);
  .modal-main {
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: px2rpx(16);
    overflow: hidden;
    .title {
      margin-bottom: px2rpx(8);
      line-height: px2rpx(22);
      color: $c0;
      font-size: px2rpx(16);
      font-weight: 600;
    }
    .content {
      line-height: px2rpx(17);
      font-size: px2rpx(12);
      color: $c15;
      text-align: center;
      overflow: auto;
    }
  }
  .footer {
    flex-shrink: 0;
    height: px2rpx(40);
    &.default {
      align-items: center;
      &.van-hairline--top::after {
        border-top-color: $c7;
        border-style: solid;
      }
    }
    &.radius {
      justify-content: center;
      padding: 0 px2rpx(16);
      height: px2rpx(46);
      .kdx-btn.cancel-btn{
        margin-right: px2rpx(13);
      }
    }
    .btn-text {
      flex: 1;
      @include lh(40);
      font-size: px2rpx(14);
      color: $c0;
      text-align: center;
      &.van-hairline--right::after {
        border-right-color: $c7;
        border-style: solid;
      }
      &.ok {
        color: $c2;
      }
    }
  }
}
</style>

## Modal框

### 基础用法
+ 最简单的使用方式，通过控制属性value显示/隐藏
+ 使用 v-model 实现双向绑定
```
<Modal v-model="isShowModal"
       title="标题"
       content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容">
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' title="标题" content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容"></modal>
    </div>
</div>

### 自定义标题-只显示标题-弹窗
+ title 标题 默认为空，不传不显示标题
```
<Modal v-model="isShowModal"
       title="确定取消吗？">
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' title="确定取消吗？"></modal>
    </div>
</div>


### 自定义内容-只显示内容-弹窗
+ content 内容 默认为空，不传不显示内容
```
<Modal v-model="isShowModal"
       content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容">
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容"></modal>
    </div>
</div>

### 提示弹窗-隐藏按钮
+ hiddenCancel-隐藏取消按钮-默认为false
```
<Modal v-model="isShowModal"
       title="标题"
       content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
       hiddenCancel>
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' title="标题" content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容" hiddenCancel></modal>
    </div>
</div>


### 自定义按钮文字
+ cancelText-自定义设置取消按钮文字，默认为取消
+ okText-自定义设置确定按钮文字，默认为确定
```
<Modal v-model="isShowModal"
       title="标题"
       content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容"
       cancelText='关闭' 
       okText='知道了'>
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' title="标题" content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容" cancelText='关闭' okText='知道了'></modal>
    </div>
</div>


### 按钮圆角样式
+ type：radius // 圆角按钮，不传type，默认文字按钮
+ 相关自定义内容同上一致
```
<Modal v-model="isShowModal"
       type="radius"
       title="标题"
       content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容">
</Modal>
```
#### 示例
&nbsp;
<div style="width:320px;height:400px;position:relative;margin: 0 auto;background-color: rgba(0,0,0,.7);border-radius: 6px;">
    <div style="position:absolute; left: 50%;top: 100px; transform: translateX(-50%)">
        <modal :value='true' type="radius" title="标题" content="内容内容内容内容内容内容内容内容内容内容内容内容内容内容"></modal>
    </div>
</div>


### props
| 属性   | 说明    |  类型  | 默认值|
| ------ | ------| ------ | ------ |
| value | modal框是否显示，使用 v-modal双向绑定 | Boolean | false |
| type | 样式类型，default/radius 按钮圆角 | string | default |
| title | 标题 | String | - |
| content | 显示内容 | String | - |
| okText | 确定按钮文字 | String | 确定 |
| cancelText | 取消按钮文字 | String | 取消 |
| hiddenCancel | 是否隐藏取消按钮 | Boolean | false |


### events 
| 事件 | 说明 | 回调参数      |
| ------ | ------ | ------ |
| onCancel | 点击取消的回调 | - |
| onOk | 点击确定的回调 | - |