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
// import 'babel-polyfill'
import Vue from "vue";
import App from "./App";
import { localStorage, sessionStorage } from "mp-storage";
import store from "./store";
import api from "@/api";
import {router,RouterMount} from "./router";
import * as utils from "./common/util.js";
import GlobalMixin from "./common/GlobalMixin.js";
import PageBox from "./components/decorate/PageBox.vue";
import graceLoading from "./components/graceLoading.vue";
import decorator from "@/common/decorator";
import LoadingFun from "@/common/LoadingBox/loading";
import LoadingBox from "@/common/LoadingBox";
import ThemeContent from "@/components/theme/ThemeContent";

// 样式库
import StyleLib from "@/kdxLib";
Vue.use(StyleLib);
// 挂载类库组件到全局
import Btn from "@/kdxLib/components/button";
import ButtonGroup from "@/kdxLib/components/button/ButtonGroup";
import RuiImg from "@/kdxLib/components/img";
import Num from "@/kdxLib/components/num";
import Item from "@/kdxLib/components/goodsItem";
import Cell from "@/kdxLib/components/cell";
import DefaultDialog from "@/kdxLib/components/dialog";
import Field from '@/kdxLib/components/field';
import Toast from '@/kdxLib/components/toast';
import Modal from '@/kdxLib/components/modal';
import DefaultPage from '@/kdxLib/components/defaultPage';


Vue.component("Btn", Btn);
Vue.component("ButtonGroup", ButtonGroup);
Vue.component("RuiImg", RuiImg);
Vue.component("Num", Num);
Vue.component("Item", Item);
Vue.component("Cell", Cell);
Vue.component('Field', Field);
Vue.component("DefaultDialog", DefaultDialog);
Vue.component("Toast",  Toast);
Vue.component("Modal",  Modal);
Vue.component("DefaultPage",  DefaultPage);

// 注册路由
Vue.use(router)
// import Worker from './common/worker.js'
/**
 * 图标库
 */
//#ifndef H5
// 商城-移动端
import "./assets/css/iconfont.css";
// 商城-自定义
import './assets/css/iconfont1.css'
import './assets/css/remixicon.css'
// 商城-装修官方
import './assets/css/iconfontDecorate.css'
// 商城-remixicon 新
import './assets/css/remixiconNew.css'
//#endif

import { graceLazyload } from "@/common/util.js";
import rrModal from "./components/picker/Modal";
// #ifdef H5
import clipboard from "./assets/jsTools/ican-clipBoard.js";
import "@/assets/jsTools/clamp.min.js"; //多行省略插件
import Vconsole from "vconsole";
const vConsole = new Vconsole();
Vue.use(vConsole);
//  #endif

// 全局注册组件
Vue.component("page-box", PageBox);
Vue.component("LoadingBox", LoadingBox);
Vue.component("page-loading", graceLoading);
Vue.component("rrModal", rrModal);
Vue.component('theme-content', ThemeContent)
Vue.config.productionTip = false;
/**
 * 全局混入
 */
Vue.mixin(GlobalMixin);
Vue.prototype.$store = store;
Vue.prototype.$isPC = false;
Vue.prototype.$utils = utils;
Vue.prototype.$api = api;
Vue.prototype.localStorage = localStorage;
Vue.prototype.sessionStorage = sessionStorage;
Vue.prototype.graceLazyload = graceLazyload;
// Vue.prototype.$worker=new Worker()
Vue.prototype.$decorator = decorator;
// loading
Vue.prototype.$loading = LoadingFun;

App.mpType = "app";

Vue.prototype.process = { env: Object.assign({}, process.env) };
const app = new Vue({
  store,
  ...App,
});
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app,router, "#app");
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
