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

// img
$img-prefix-cls: $css-prefix + "img-box";
.#{$img-prefix-cls} {
  overflow: hidden;
  display: flex;
  .img {
    flex: 1;
  }
  &.small-1 {
    @include wh(60);
    border-radius: px2rpx(4);
  }
  &.small-2 {
    @include wh(70);
    border-radius: px2rpx(6);
  }
  &.middle-1 {
    @include wh(80);
    border-radius: px2rpx(6);
  }
  &.middle-2 {
    @include wh(90);
    border-radius: px2rpx(6);
  }
  &.large-1 {
    @include wh(100);
    border-radius: px2rpx(6);
  }
  &.large-2 {
    @include wh(110);
    border-radius: px2rpx(6);
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
## 图片
### RuiImg props
<table>
    <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>size</td>
        <td>控制容器的大小 取值 <em>small-1</em> <em>small-2</em> <em>middle-1</em> <em>middle-2</em> <em>large-1</em> <em>large-2</em></td>
        <td>String</td>
        <td>small-1</td>
    </tr>
</table>

### Demo
#### size:small-1
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src=""/&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" />

#### size:small-2
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src="" size="small-2" /&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" size="small-2" />

#### size:middle-1
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src="" size="middle-1" /&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" size="middle-1" />

#### size:middle-2
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src="" size="middle-2" /&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" size="middle-2" />

#### size:large-1
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src="" size="large-1" /&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" size="large-1" />

#### size:large-2
<pre>
  import RuiImg from "@/kdxLib/components/img";
  &lt;rui-img src="" size="large-2" /&gt;
</pre>
<rui-img src="http://image4.cityhouse.cn/qingdao/images/ha/large/pa0110768CHY423_1456192827388554.jpg" size="large-2" />