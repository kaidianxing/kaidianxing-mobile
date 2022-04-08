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

// default-page
$default-page-wrap: $css-prefix + 'default-page-wrap';
.#{$default-page-wrap} {
  width: 100%;
  .container {
    margin: 0 auto;
    width: px2rpx(200);
    text-align: center;
    overflow: hidden;
  }
  .img {
    margin: 0 auto;
    width: px2rpx(90);
    height: px2rpx(90);
    text-align: center;
    .default-img {
      width: px2rpx(90);
      height: px2rpx(90);
    }
    .icon {
      font-size: px2rpx(90);
    }
  }
  .title {
    margin-top: px2rpx(16);
    line-height: px2rpx(22);
    font-size: px2rpx(16);
    color: $c0;
    font-weight: 600;
  }
  .desc {
    margin: px2rpx(8) 0 px2rpx(16);
    line-height: px2rpx(20);
    font-size: px2rpx(14);
    color: $c15;
  }
  >.default {
    padding: px2rpx(166) 0 0;
    height: 100vh;
    background-color: $c1;
  }
  .custom {
    padding: px2rpx(24) 0;
    background-color: $c1;
  }
}

</style>

## Default Page

### 普通缺省图
+ 默认普通缺省图
```
<default-page></default-page>
```
#### 示例
&nbsp;
<div style="width:375px;height:650px;">
    <default-page></default-page>
</div>



### 自定义缺省图
+ 底部可自定义内容
```
<default-page type="custom">
    <template>自定义</template>
</default-page>
```
#### 示例
&nbsp;
<div style="width:375px;height:650px;background-color: #f5f5f5;">
    <default-page type="custom">
        <template> 
            <div style="color: #969696;font-size: 14px;text-align: center;margin-top: 140px;">自定义</div>
        </template>
    </default-page>
</div>


### props
| 属性   | 说明    |  类型  | 默认值|
| ------ | ------| ------ | ------ |
| type | 缺省图默认类型，default-默认 custom-自定义 | string | default |
| imgUrl | 缺省图图片地址 | String | - |
| title | 标题 | String | - |
| desc | 简介 | String | - |
| btn | 按钮文字 | String | - |


### events 
| 事件 | 说明 | 回调参数      |
| ------ | ------ | ------ |
| btnClick | 点击按钮的回调 | - |
