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
    border-right-width: 1px;
}

.van-hairline--bottom:after {
    border-width:  0 0 1px 0;
}

.van-hairline--top-bottom:after {
    border-width: 1px 0;
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
    border-radius: px2rpx(6);
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

// num group
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

// item group
$item-prefix-cls: $css-prefix + "item-wrap";
.#{$item-prefix-cls}{
  background: $c1;
  padding: px2rpx(8) px2rpx(12);
  display: flex;
  

  &.notptb{
    padding-bottom: 0;
  }

  .hot{
    position: absolute;
    background: $c2;
    color: $c1;
    text-align: center;
    @include allResize(28,6,12,0.875);
    border-bottom-left-radius: px2rpx(20);
    border-bottom-right-radius: px2rpx(20);
    left: px2rpx(0);
  }

  .select-gp{
    padding-right:px2rpx(13);
    display: flex;
    align-items: center;
    color: $c4;
    font-size:px2rpx(18);
    .icon-m-yes{
      color: $c2;
    }
  }

  .kdx-img-box{
    margin-right: px2rpx(12);
  }
  .gp-types,
  .gp-work{
    vertical-align: middle;
    display:inline-block;
  }

  .gp-types{
    margin-top: - px2rpx(2);
    text-align: center;
    .item{
      display: inline-block;
      @include allResize(18, 2, 12, 1);
      &.x{
        background: $c12;
        color: $c2;
      }
      &.d{
        background: $c17;
        color: $c10;
      }
      &.r{
        margin-right: px2rpx(4);
      }
      &.s{
        background: $c14;
        color: $c13;
      }
    }
  }

  .tith{
    margin-bottom: px2rpx(9);
    font-size:px2rpx(12);
    font-weight: 500;
    color:$c0;
    .gp-work{
      width: px2rpx(28);
      height: px2rpx(14);
      line-height: px2rpx(14);
      text-align:center;
      color: $c1;
      border-radius: px2rpx(2);
      font-size:px2rpx(12);
      .span{
        display:inline-block;
        transform:scale(0.75);
        white-space: nowrap;
        margin-left: - px2rpx(2);
      }
      background: linear-gradient(114.57deg, #FF8A00 19.05%, #FF4C14 87.67%);
    }
  }

  .p{
    margin-bottom: px2rpx(9);
    font-weight: 500;
    font-size:px2rpx(12);
    color: $c15;
    background:$c11;
    border-radius: px2rpx(4);
    padding: 0 px2rpx(8);
    &.des{
     background:$c5;
     padding:0; 
    }
  }

  .member{
    margin-bottom: px2rpx(9);
    text-align: center;
    @include allResize(30, 2, 8, 2);
    background: $c16;
    color: $c2;
    border: 1px solid $c2;
    *{
      @include lt12(2,0.6666666);
    }
  }

  .gp{
    display: flex;
    align-items: center;
    margin-bottom: px2rpx(9);
    &.lst{
      margin:0;
      padding:0;
    }
    &.notlast{
      margin-top: - px2rpx(9);
    }
    .mp{
      color: $c2;
      flex: 1;
      font-weight: 500;
      .pic{
        font-size: px2rpx(16);
      }
      .ut{
        font-size: px2rpx(12);
        margin-right: px2rpx(2);
      }
    }
    .rt{
      text-align: right;
      flex: 1;
      .error{
        color: $c2;
        font-size: px2rpx(10);
        *{
          @include lt12(2,0.8333333)
        }
      }
      .add{
        font-size: px2rpx(17.5);
        color: $c2;
      }
      .specifications{
        display:inline-block;
        text-align:center;
        @include allResize(45, 28, 11, 2.6);
        background: $c2;
        color: $c1;
      }
      .nums{
        font-size: px2rpx(12);
        color:$c15;
      }
      .collection{
        font-size: px2rpx(18);
        color:$c15;
        &.ac{
          color: $c2;
        }
      }
      .num-picker{
        display:inline-block;
        text-align:center;
      }
      .warn{
        color: $c2;
        font-size: px2rpx(10);
        *{
          @include lt12(2,0.8333333)
        }
      }
      .estimate{
        font-size: px2rpx(12);
        font-weight: 500;
        .lb{
          color:$c0;
        }
        .pic{
          color:$c2;
        }
      }
    }

    .l{
      font-size: px2rpx(12);
      font-weight: 500;
      text-decoration:line-through;
      color:$c15;
      flex:1;
    }
    .r{
      text-align: right;
      font-size: px2rpx(10);
      *{
        @include lt12(2,0.8333333)
      }
      color:$c15;
      flex:1;
    }

    .btns{
      flex:1;
      display:flex;
      justify-content:flex-end;
      .kdx-btn{
        margin-left: px2rpx(12);
         @include allResize(76, 14, 12, 2.7);
         display: inline-block;
         // #ifdef H5
         line-height: 27px;
         // #endif
      }
      .success{
        .kdx-btn{
          color: $c10;
          border-color: $c10;
        }
      }
      .err{
        .kdx-btn{
          color: $c2;
          border-color: $c2;
        }
      }
    }
  }
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

// background
.bg0 {
  background: linear-gradient(132.57deg, $c2 0%, $c3 94.38%);
}

// padding
.ptb {
  padding: 0 px2rpx(15) !important;
  width: auto !important;
}

.ptd28 {
  padding: 0 px2rpx(14);
  width: auto !important;
  margin-left: px2rpx(12);
}

// width
.w100 {
  width: px2rpx(100);
  margin: 0 auto;
}
// cell
$cell-wrap:$css-prefix + 'cell-wrap';
.#{$cell-wrap}{
  background: rgba(255,255,255,1);
  
  font-size: px2rpx(14);
  color: $c0;
  font-weight: 500;

  padding-left: px2rpx(12);

  .van-hairline--bottom::after {
    border-bottom-color: $c7;
    border-style: solid;
  }
  .van-hairline--bottom{
    min-height: px2rpx(48);
    &.more-line{
      min-height: px2rpx(68);
    }
    box-sizing: border-box;
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding: px2rpx(12) px2rpx(12) px2rpx(12) 0;
  }
  
  .m-wp,
  .icon-wp{
    display:flex;
    align-items: center;
  }
  .content{
    color: $c15;
    text-align: right;
  }
  .icon-m-right{
    font-size: px2rpx(20);
  }
  .icon-m-zhifubao1{
    // color:$c18;
  }
  .left-icon{
    font-size:px2rpx(24);
    padding-right: px2rpx(8);
  }
  &.more-line{
    .left-icon{
      font-size:px2rpx(32);
      padding-right: px2rpx(12);
    }
  }
  .kdx-btn{
    width: px2rpx(76);
    font-weight: 500 !important;
  }
  .main-content-wrap{
    flex: 1;
  }
  .status{
    margin-left: px2rpx(8);
    @include height(16);
    padding:0 px2rpx(8);
    background: $c16;
    color: $c2;
    div{
      @include lt12(2,0.8333333);
      font-size:px2rpx(12);
      font-weight: 600;
    }
  }
  .abstract-content,
  .main-abstract{
    font-size:px2rpx(12);
    color: $c15;
    font-weight: normal;
  }
}
// field
$field-wrap: $css-prefix + 'field-wrap';
.#{$field-wrap} {
  background-color: #ffffff;
  padding-left: 12px;
  .field-box {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: px2rpx(16) px2rpx(12) px2rpx(16) 0;
    position: relative;
    &:after {
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
    &.bottom-border {
      &:after {
        border-bottom-color: #e6e7eb;
        border-style: solid;
        border-width: 0 0 1px 0;
      }
    }
  }
  .left-icon {
    font-size: px2rpx(24);
    padding-right: px2rpx(8);
  }
  .label {
    font-size: px2rpx(14);
    line-height: px2rpx(16);
    padding-right: px2rpx(12);
    font-weight: 500;
    width: px2rpx(86);
    color: $c0;
    flex-shrink: 0;
  }
  .field-body {
    flex: 1;

  }
  .field-textarea,
  .field-input {
     font-size: px2rpx(14);
     font-weight: 500;
     line-height: px2rpx(16);
     color: $c0;
    &.left {
      text-align: left;
    }
    &.right {
      text-align: right;
    }
    .input-placeholder, .uni-input-placeholder {
      color: $c15;
    }
   }
  .readonly {
    font-size: px2rpx(14);
    font-weight: 500;
    line-height: px2rpx(16);
    color: $c0;
  }
  .field-textarea {
    height: px2rpx(20);
    width: auto;
  }
  .right-icon {
    font-size: px2rpx(20);
    color: $c0;
  }
  .field-disabled {
    .label {
      color: $c4;
    }
    .field-textarea,
    .field-input {
      .input-placeholder, .uni-input-placeholder {
        color: $c4;
      }
    }
  }
  .field-align {
    align-items: flex-start;
  }
}

// shadow
.shadow-wrap{
  background:$c19;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0.7;
}

// default diglog
$default-dialog-wrap: $css-prefix + 'default-dialog-wrap';
.#{$default-dialog-wrap}{
    &.small{
        .ct-wrap{
            top:px2rpx(367);
        }
    }
  .ct-wrap{
    position: absolute;
    top: px2rpx(137);
    bottom:0;
    left:0;
    right:0;
    display:flex;
    background:$c1;
    border-radius: px2rpx(10) px2rpx(10) 0px 0px;
    flex-direction:column;
    .tith{
      padding: px2rpx(16);
      text-align: center;
      display:flex;
      align-items:center;
      .th{
        color: $c0;
        font-size: px2rpx(16);
        font-weight: bold;
        flex:1;
      }
      .close{
        position: absolute;
        right: px2rpx(16);
        width:px2rpx(24);
        height:px2rpx(24);
        // background:red;
        overflow:hidden;
        div{
          font-size: px2rpx(24);
          vertical-align: top;
        }
      }
    }
    .main{
      flex:1;
      padding:0 px2rpx(16);
      overflow: hidden;
    }
    .sub{
      border-top:1px solid $c7;
      padding: px2rpx(7) px2rpx(12);
    }
  }
}


pre{
  color:$c1 !important;
}
.wx{
  width:200px;
}
</style>

## 弹窗

### DefaultDialog props

<table>
  <tr>
      <th>属性</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
  </tr>
  <tr>
      <td>tith</td>
      <td>主标题</td>
      <td>String</td>
      <td>""</td>
  </tr>
  <tr>
      <td>isShowButton</td>
      <td>是否显示按钮</td>
      <td>Boolean</td>
      <td>false</td>
  </tr>
  <tr>
      <td>isShowDialog</td>
      <td>是否显示dialog</td>
      <td>Boolean</td>
      <td>false</td>
  </tr>
</table>

<div style="width:320px;height:500px;position:relative;">
<default-dialog  :isShowDialog="true" tith="标题" :isShowButton="true">
    <div slot="close" style="color:#e6e7eb" class="iconfont-m- icon-m-fucengguanbi2"></div>
    <div slot="main"> 内容 </div>
</default-dialog>
</div>

<div style="width:320px;height:500px;position:relative;">
<default-dialog :classNames="['small']"  :isShowDialog="true" tith="标题" :isShowButton="true">
    <div slot="close" style="color:#e6e7eb" class="iconfont-m- icon-m-fucengguanbi2"></div>
    <div slot="main"> 内容 </div>
</default-dialog>
</div>
<pre>
&lt;default-dialog  :isShowDialog="true" tith="标题" :isShowButton="true"&gt;
    &lt;div slot="close" class="iconfont-m- icon-m-fucengguanbi2"&gt;&lt;/div&gt;
    &lt;div slot="main"&gt; content &lt;/div&gt;
&lt;/default-dialog&gt;
</pre>

### Events

<table>
    <tr>
      <th>事件名</th>
      <th>说明</th>
      <th>返回值</th>
    </tr>
    <tr>
      <td>on-close</td>
      <td>关闭回调，对外需要通过isShowDialog控制关闭</td>
      <td>Boolean</td>
    </tr>
</table>

### Slot

<table>
    <tr>
      <th>名字</th>
      <th>说明</th>
    </tr>
    <tr>
        <td>close</td>
        <td>关闭自定义</td>
    </tr>
    <tr>
        <td>main</td>
        <td>主内容自定义滚动自己加</td>
    </tr>
</table>
