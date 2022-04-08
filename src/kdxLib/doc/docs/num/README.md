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

// width
$w: 100%;

// function
@function px2rpx($n) {
  @return $n * 1 + px;
}

@mixin wh($size: 0) {
  width: px2rpx($size);
  height: px2rpx($size);
}

// mixin
@mixin height($size: 0) {
  height: px2rpx($size);
  line-height: px2rpx($size);
  // set button border-radius important
  border-radius: px2rpx($size / 2) !important;
}

$num-prefix-cls: $css-prefix + "num-wrap";
.#{$num-prefix-cls} {
  display: flex;
  align-items:center;
  .txt{
    width: px2rpx(36);
    height: px2rpx(18);
    line-height: px2rpx(18);
    background: $c11;
    border-radius: px2rpx(2);
    border:0;
    color: $c0;
    font-weight: bold;
    text-align: center;
    font-size: px2rpx(12);
  }
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
## 增加删除
### Num props
<table>
    <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>min</td>
        <td>最小值</td>
        <td>Number</td>
        <td>1</td>
    </tr>
    <tr>
        <td>max</td>
        <td>最大值</td>
        <td>Number</td>
        <td>10</td>
    </tr>
</table>

### Demo
<pre>
  import Num from "@/kdxLib/components/num";
  &lt;num&gt;
   &lt;div slot="left" class="iconfont-m- icon-m-jianhao"&gt;&lt;/div&gt;
   &lt;div slot="right" class="iconfont-m- icon-m-jiahao"&gt;&lt;/div&gt;
  &lt;num /&gt;
</pre>
<rui-num />

#### min:3 max:4
<rui-num :min="3" :max="4" />

### Events
<table>
    <tr>
      <th>事件名</th>
      <th>说明</th>
      <th>返回值</th>
    </tr>
    <tr>
      <td>on-change</td>
      <td>按钮点击回调 当前的值</td>
      <td>Number</td>
    </tr>
</table>
