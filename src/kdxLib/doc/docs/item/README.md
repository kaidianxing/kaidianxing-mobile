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
      &.r{
        margin-right: px2rpx(4);
      }
      &.d{
        background: $c17;
        color: $c10;
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
  margin: 0 auto;
  &::after {
    border: 0;
  }

  &.ghost[disabled] {
    border: 1px solid $c7;
    color: $c4 !important;
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
  padding: 0 px2rpx(15);
}

.ptd28 {
  padding: 0 px2rpx(14);
  width: auto !important;
  margin-left: px2rpx(12);
}
// width
.w100 {
  width: px2rpx(100);
}

pre{
  color:$c1 !important;
}
.wx{
  width:200px;
}
</style>
## 列表单元
### Item props info
<table>
    <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
    </tr>
    <tr>
      <td>key</td>
      <td>当前组件的唯一标示，同样也是如果操作，对外提供的id标示。</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>src</td>
      <td>图片地址</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isHot</td>
      <td>是否开启热销标志</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>isSelect</td>
      <td>是否开启可以选择商品的选择按钮</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
     <tr>
      <td>isX</td>
      <td>是否淡绿色底部</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>xTith</td>
      <td>淡绿色对应内容</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isEntity</td>
      <td>是否是蓝色底的</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>entityTith</td>
      <td>蓝色底的内容</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>emptyTith</td>
      <td>红色底的内容</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isEmpty</td>
      <td>是否红色底的</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>tith</td>
      <td>主标题内容</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>des</td>
      <td>描述 有显示没有隐藏</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>specifications</td>
      <td>规格内容，如果是''则不显示</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isMember</td>
      <td>是否显示会员标示</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>errorMsg</td>
      <td>缺少库存的错误提示，如果是''则不显示</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isAdd</td>
      <td>是否开启添加按钮</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>isSpecifications</td>
      <td>是否开启可以选择规格</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>num</td>
      <td>销售数量 x\{\{num\}\} 如果是0不显示该选项</td>
      <td>Number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>pic</td>
      <td>价格，如果是0不显示该选项</td>
      <td>Number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>isCollection</td>
      <td>是否显示收藏</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>commission</td>
      <td>佣金 如果是''不显示， + - 请前面自己实现</td>
      <td>String</td>
      <td>''</td>
    </tr>
    <tr>
      <td>isPicker</td>
      <td>是否开启计数器</td>
      <td>Boolean</td>
      <td>false</td>
    </tr>
    <tr>
      <td>min</td>
      <td>如果开启了计数器 min 最小值</td>
      <td>Number</td>
      <td>1</td>
    </tr>
    <tr>
      <td>max</td>
      <td>如果开启了计数器 max 最大值</td>
      <td>Number</td>
      <td>10</td>
    </tr>
    <tr>
      <td>warn</td>
      <td>最大限购数量 warn 0 不显示</td>
      <td>Number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>delPic</td>
      <td>划线价格，如果0不现实</td>
      <td>Number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>amount</td>
      <td>销售数量0不显示</td>
      <td>Number</td>
      <td>0</td>
    </tr>
    <tr>
      <td>btns</td>
      <td>
      <pre class="wx">
按钮组
{
name: '', // 按钮名字
perm: '', // 权限是否显示
status: 0, // 根据这个选择不同样式 0 red 1 green 2 gray
}
对应的事件在事件说明
如果是空数组不显示
      </pre>
      </td>
      <td>Array</td>
      <td>[]</td>
    </tr>
</table>

### Events
<table>
  <tr>
    <th>属性</th>
    <th>说明</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td>on-do-event</td>
    <td>如果触发了按钮组中的任何一个会触发次回调</td>
    <td>Function 返回Object</td>
    <td>
默认返回 Object
<pre class="wx">
{
name: '',
perm: '',
status: 0, // 请根据这个状态自行判断调用业务上面阐述了 0 1 2
}
</pre>
    </td>
  </tr>
  <tr>
    <td>on-change-picker</td>
    <td>如果开启了isPicker, on-change-picker 更新出发会有回调</td>
    <td>
      Function 返回 Object
    </td>
    <td>
默认返回 Object
<pre class="wx">
{
id: '',
v: 1,
}
</pre>
    </td>
  </tr>
  <tr>
    <td>on-change-collection</td>
    <td>如果开启了isCollection 会显示是否收藏</td>
    <td>Function 返回 Object</td>
    <td>
默认返回 Object
<pre class="wx">
{
id: '',
collection: false, // 是否收藏 true 是收藏 false 不收藏
}
</pre>    
    </td>
  </tr>
  <tr>
    <td>on-change-spc</td>
    <td>如果规格打开 点击这个会告诉外边点击了选择规格</td>
    <td>Function</td>
    <td>默认返回String id</td>
  </tr>
  <tr>
    <td>on-change-add</td>
    <td>如果开启了添加，点击会往外送点击了</td>
    <td>Function</td>
    <td>默认返回String id</td>
  </tr>
  <tr>
    <td>on-change-radio</td>
    <td>如果开启了可以选择，点击告诉外边是否选取获取取消</td>
    <td>Function 返回 Object</td>
    <td>
默认返回 Object
<pre class="wx">
{
id: '',
ck: false, // 选中 true 不选中 false
}
</pre>      
    </td>
  </tr>
</table>

#### demo
<pre>
    import Item from "@/kdxLib/components/goodsItem";
    &lt;Item info={} /&gt; 
</pre>
<item :info="{
  key:'fx',
  src:'http://image4.cityhouse.cn/qingdao/images/ha/large/pa0138586SHB261_1592352924323332.jpg',
  isHot:true,
  isSelect: true,
  isGroupWork: true,
  groupWork:1,
  isEntity:true,
  entityTith:'实',
  emptyTith: '多',
  isEmpty: true,
  tith: '测试标题',
  specifications: '规格',
  isMember: true,
  errorMsg: '不足',
  isAdd: true,
  isSpecifications: true,
  num: 1,
  pic: 1,
  isCollection: true,
  commission: '+1',
  isPicker: true,
  warn: 1,
  delPic: 1,
  amount: 1,
  btns:[{name:'申请售后',perm:'1',status:1}],
  isX:true,
  xTith:'虚',
  des: '描述',
  }"/>

### demo1
<item :info="{
  key:'fx',
  src:'http://image4.cityhouse.cn/qingdao/images/ha/large/pa0138586SHB261_1592352924323332.jpg',
  isHot:true,
  tith: 'Huawei/华为 P30全面屏超感光徕卡三摄变焦双景录像980芯片',
  des: '4000万超感光徕卡三摄',
  pic: 9999,
  isAdd:true,
  delPic: 9999,
  amount: 20,
}"/>

### demo2
<item :info="{
  key:'fx',
  src:'http://image4.cityhouse.cn/qingdao/images/ha/large/pa0138586SHB261_1592352924323332.jpg',
  isMember:true,
  tith: 'Huawei/华为 P30全面屏超感光徕卡三摄变焦双景录像980芯片',
  pic: 9999,
  isAdd:true,
  delPic: 9999,
  amount: 20,
}"/>

### deom3
<item :info="{
  key:'fx',
  src:'http://image4.cityhouse.cn/qingdao/images/ha/large/pa0138586SHB261_1592352924323332.jpg',
  isMember:true,
  tith: 'Huawei/华为 P30全面屏超感光徕卡三摄变焦双景录像980芯片',
  pic: 9999,
  errorMsg:'当前库存不足',
  delPic: 9999,
  amount: 20,
}"/>

### demo4
<item :info="{
  key:'fx',
  src:'http://image4.cityhouse.cn/qingdao/images/ha/large/pa0138586SHB261_1592352924323332.jpg',
  isMember:true,
  tith: 'Huawei/华为 P30全面屏超感光徕卡三摄变焦双景录像980芯片',
  pic: 9999,
  isSpecifications: true,
  delPic: 9999,
  amount: 20,
}"/>

###### 剩下的不放了页面太卡了参照figma