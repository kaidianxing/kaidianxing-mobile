<!--
 * @Description: 列表组
 * @Autor: 青岛开店星信息技术有限公司
-->
<template>
  <div :class="classes" :style="style" :key="info.key">
    <!--选择组-->
    <div class="select-gp" v-if="info.isSelect">
      <div :class="rClass" @click="ch(info.key)"></div>
    </div>

    <div class="plv">
      <!--热卖absolute-->
      <div v-if="info.isHot" class="hot">热卖</div>

      <!--图片组-->
      <rui-img
        :src="info.src"
      />
    </div>

    <!--内容区域-->
    <div class="mp">
      <!--列表主标题-->
      <div class="tith">
        <div class="gp-types" v-if="info.isEntity || info.isEmpty || info.isX">
          <div class="item s r" v-if="info.isEntity">{{ info.entityTith }}</div>
          <div class="item x r" v-if="info.isEmpty">{{ info.emptyTith }}</div>
          <div class="item d r" v-if="info.xTith">{{ info.xTith }}</div>
        </div>
        {{ info.tith }}
      </div>
      <!--规格-->
      <div class="p" v-if="info.specifications">
        {{ info.specifications }}
      </div>
      <!--描述-->
      <div v-if="info.des" class="p des">
      {{info.des}}
      </div>
      <!--会员标示-->
      <div v-if="info.isMember" class="member"><span>会员价</span></div>
      <!--价格组-->
      <div class="gp">
        <div class="mp" v-if="info.pic">
          <span class="ut">¥</span><span class="pic">{{ info.pic }}</span>
        </div>
        <div class="rt">
          <!--库存-->
          <div class="error" v-if="info.errorMsg">
            <span>{{ info.errorMsg }}</span>
          </div>
          <!--加号-->
          <div
            v-if="info.isAdd"
            @click="addItem(info.key)"
            class="add iconfont-m- icon-m-buy1"
          ></div>
          <!--规格-->
          <div
            v-if="info.isSpecifications"
            @click="selectItem(info.key)"
            class="specifications"
          >
            选规格
          </div>
          <!--数量-->
          <div v-if="info.num" class="nums">x{{ info.num }}</div>
          <!--收藏-->
          <div
            v-if="info.isCollection"
            :class="collectionClass"
            @click="addCollection(info.key)"
          ></div>
          <!--预计佣金-->
          <div v-if="info.commission" class="estimate">
            <span class="lb">预计佣金：</span
            ><span class="pic">{{ info.commission }}元</span>
          </div>
          <!--数量选择器-->
          <div v-if="info.isPicker" class="num-picker">
            <rui-num @on-change="pickerChange" :min="info.min" :max="info.max">
              <div slot="left" class="iconfont-m- icon-m-jianhao"></div>
              <div slot="right" class="iconfont-m- icon-m-jiahao"></div>
            </rui-num>
            <span v-if="info.warn" class="warn"
              ><span>限购{{ info.warn }}件</span></span
            >
          </div>
        </div>
      </div>
      <!--划线组-->
      <div v-if="info.delPic || info.amount" class="gp">
        <div v-if="info.delPic" class="l">¥{{ info.delPic }}</div>
        <div v-if="info.amount" class="r">
          <span>销量{{ info.amount }}</span>
        </div>
      </div>
      <!--按钮组-->
      <div class="gp lst" :class="{notlast:!(info.btns && info.btns.length)}">
        <div></div>
        <div class="btns" v-if="info.btns && info.btns.length">
          <div
            :class="{ err: item.status == 0, success: item.status == 1 }"
            v-for="item in info.btns"
          >
            <button-sqx
              :key="item.name"
              v-if="item.perm"
              @btn-click="doEvent(item, info.key)"
              type="text"
              :ghost="true"
              >{{ item.name }}</button-sqx
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 工具
import PublicMixin from "../../lib/PublicMixin.js";

const NAME = "Item";

export default {
  name: NAME,
  mixins: [PublicMixin],
  data() {
    return {
      ck: false,
      collection: false,
    };
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        key: "", // id
        src: "", // 图片地址
        isHot: false, // 是否热卖
        isSelect: false, // 是否开启选择
        isEntity: false, // 是否实体
        entityTith: "",
        emptyTith: "",
        isEmpty: false, // 是否多
        xTith: "",
        isX: false,
        tith: "", // 主标题
        specifications: "", // 规格
        isMember: false, // 是否会员
        errorMsg: "", // 错误内容
        isAdd: false, // 是否可以添加
        isSpecifications: false, // 是否开启可以选择规格
        num: 0, // 数量
        pic: 0, // 价格
        isCollection: false, // 是否收藏
        commission: "", // 佣金
        isPicker: false, // 是否开启数量计数容
        min: 1, // 计数最小1
        max: 10, // 最大 10
        warn: 0, // 限购数量
        delPic: 0, // 划线价
        amount: 0, // 销售量
        des: "", // 描述
        btns: [
          // {
          //   name: "申请售后",
          //   perm: "1",
          //   status: 1,
          // },
          // {
          //   name: "申请售后",
          //   perm: "1",
          //   status: 2,
          // },
        ], // 底部按钮组
      }),
    },
  },
  methods: {
    doEvent(perm, id) {
      console.log(
        {
          ...perm,
          id,
        },
        "--->>>"
      );
      this.$emit("on-do-event", {
        ...perm,
        id,
      });
    },
    pickerChange(v) {
      console.log({
        id: this.info.key,
        v,
      });
      this.$emit("on-change-picker", {
        id: this.info.key,
        v,
      });
    },
    addCollection(id) {
      this.collection = !this.collection;
      console.log({
        id,
        collection: this.collection,
      });
      // events
      this.$emit("on-change-collection", {
        id,
        collection: this.collection,
      });
    },
    selectItem(id) {
      console.log(id, "sel--->>>>");
      // events
      this.$emit("on-change-spc", id);
    },
    addItem(id) {
      console.log(id, "--->>>>");
      // events
      this.$emit("on-change-add", id);
    },
    ch(id) {
      this.ck = !this.ck;
      console.log({
        id,
        ck: this.ck,
      });
      // events
      this.$emit("on-change-radio", {
        id,
        ck: this.ck,
      });
    },
  },
  computed: {
    collectionClass() {
      return `collection iconfont-m- icon-m-xingxingkongxin ${this.collection &&
        "ac"}`;
    },
    rClass() {
      return "iconfont-m- " + (this.ck ? "icon-m-yes" : "icon-m-no");
    },
    // 样式计算
    classes() {
      return ["kdx-item-wrap", ...this.classNames].join(" ");
    },
    style() {
      return `${this.styles}`;
    },
  },
};
</script>
