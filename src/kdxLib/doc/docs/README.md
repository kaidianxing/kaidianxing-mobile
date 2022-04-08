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

// width
$w: 100%;

// function
@function px2rpx($n) {
  @return $n * 1 + px;
}

// mixin
@mixin height($size: 0) {
  height: px2rpx($size);
  line-height: px2rpx($size);
  // set button border-radius important
  border-radius: px2rpx($size / 2) !important;
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

// Button
$btn-prefix-cls: $css-prefix + "btn";
.#{$btn-prefix-cls} {
  @include height(34);
  border-radius: px2rpx(64);
  background: $c2;
  color: $c1;
  font-size: px2rpx(16);
  font-weight: normal;
  width: 100%;
  border: 0;
  margin: 0 auto;
  &::after {
    border: 0;
  }

  &[disabled]{
    color: $c4 !important;
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
  display: flex;
  .group {
    flex: 1;
    &.kdx-btn,
    .kdx-btn {
      font-weight: 500;
      font-size: px2rpx(14);
    }

    &:not(:first-child):not(:last-child){
      &.kdx-btn,
      .kdx-btn{
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
}

// background
.bg0 {
  background: linear-gradient(132.57deg, $c2 0%, $c3 94.38%);
}

// padding
.ptb{
  padding: 0 px2rpx(15);
}

// width
.w100{
  width: px2rpx(100);
}

pre{
  color:$c1 !important;
}
</style>

# 商城样式库
## Button
### Button props
<table>
    <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>type</td>
        <td>
        按钮类型，可选值为 <em>default</em> <em>primary</em> <em>text</em> <em>success</em> <em>do</em> <em>know</em> <em>finished</em> <em>do-get</em> 
        </td>
        <td>
            String
        </td>
        <td>
            default
        </td>
    </tr>
    <tr>
        <td>ghost</td>
        <td>
        是否空心，可选值为 <em>true</em> <em>false</em>
        </td>
        <td>
            Boolean
        </td>
        <td>
            false
        </td>
    </tr>
    <tr>
        <td>size</td>
        <td>
        尺寸，可选值为 <em>small</em> <em>middle</em> <em>large</em>
        </td>
        <td>
            String
        </td>
        <td>
            small
        </td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>是否禁用</td>
      <td>
            Boolean
      </td>
      <td>
            false
      </td>
    </tr>
    <tr>
      <td>classNames</td>
      <td>尽量不用，可以传class数组覆盖内部样式 ptb 左右內边距 15内置 w100 宽度100</td>
      <td>Array</td>
      <td>[]</td>
    </tr>
    <tr>
      <td>styles</td>
      <td>style样式表</td>
      <td>
        String
      </td>
      <td>
          "" 
      </td>
    </tr>
</table>

### Demo
#### type:default
<pre>
  import Btn from "@/kdxLib/components/button";
  &lt;btn type="default"&gt;tested&lt;/btn&gt;
</pre>

<button-sqx type="default">default</button-sqx>

#### type:default ghost true
<button-sqx type="default" :ghost="true">default</button-sqx>

#### type:primary
<button-sqx type="primary">primary</button-sqx>

#### type:primary ghost true
<button-sqx type="primary" :ghost="true">primary</button-sqx>

#### type:text 注意这里不再是实心
<button-sqx type="text">text</button-sqx>

#### type:text ghost true 这里是对 text 的另一种样式
<button-sqx type="text" :ghost="true">text</button-sqx>

#### type:success
<button-sqx type="success">success</button-sqx>

#### type:success ghost true
<button-sqx type="success" :ghost="true">success</button-sqx>

#### type:do
<button-sqx type="do">do</button-sqx>

#### type:do ghost true
<button-sqx type="do" :ghost="true">do</button-sqx>

#### type:know
<button-sqx type="know">know</button-sqx>

#### type:know ghost true
<button-sqx type="know" :ghost="true">know</button-sqx>

#### type:finished
<button-sqx type="finished">finished</button-sqx>

#### type:finished ghost true
<button-sqx type="finished" :ghost="true">finished</button-sqx>

#### type:do-get 这个没有空心只是样式上区分同 text
<button-sqx type="do-get">do-get</button-sqx>

#### type:do-get ghost true 这个没有空心只是样式上区分同 text
<button-sqx type="do-get" :ghost="true">do-get</button-sqx>

#### type:default size small
<button-sqx type="default">default</button-sqx>

#### type:default size middle
<button-sqx type="default" size="middle">default</button-sqx>

#### type:default size large
<button-sqx type="default" size="large">default</button-sqx>

### Events
<table>
    <tr>
      <th>事件名</th>
      <th>说明</th>
      <th>返回值</th>
    </tr>
    <tr>
      <td>btn-click</td>
      <td>按钮点击回调</td>
      <td>event</td>
    </tr>
</table>

## Button-Group
### Button-Group props
<table>
    <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
    </tr>
    <tr>
      <td>type</td>
      <td>按钮组类型，可选值为 <em>entity</em> <em>hollow</em> </td>
      <td>String</td>
      <td>entity</td>
    </tr>
    <tr>
      <td>classNames</td>
      <td>尽量不用，可以传class数组覆盖内部样式</td>
      <td>Array</td>
      <td>[]</td>
    </tr>
</table>

### Demo
#### type:hollow 子组件的 class="group" 必须要有兼容头条！！！
<pre>
  import ButtonGroup from "@/kdxLib/components/button/ButtonGroup";
  import Btn from "@/kdxLib/components/button";

  &lt;button-group type="hollow"&gt;
    &lt;btn class="group" type="default"&gt;tested&lt;/btn&gt;
    &lt;btn class="group" type="default"&gt;tested&lt;/btn&gt;
  &lt;/button-group&gt;
</pre>
<button-group type="hollow">
    
</button-group>
