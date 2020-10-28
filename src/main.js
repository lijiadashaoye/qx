// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import promise from 'es6-promise'
promise.polyfill();
import Vue from 'vue'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
var options = {
  closeEl: true,
  captionEl: true,
  zoomEl: false,
  shareEl: false,
  counterEl: false,
  arrowEl: false,
  preloaderEl: true,
  fullscreenEl: false //关闭全屏按钮
}
Vue.use(preview, options)
import App from './App'
import router from './routes'
import 'assets/css/common.css';
import 'assets/icon/iconfont.css'
import 'assets/font/index.scss'
import store from './store/index.js';
import langdata from "./assets/langData/langData.js";
import VueI18n from 'vue-i18n';
import "filter/date"
import "filter/string"
import md5 from 'js-md5'
import {
  base
} from './utils/base.js';
Vue.use(base);
import Element from 'element-ui'

import './assets/css/element-varuablse.scss'
import * as svgicon from 'vue-svgicon';
// import 'utils/canvas-toBlob'



Vue.use(VueI18n);

// 添加
// const Vue = require('vue')
// const Element = require('element-ui')
Vue.use(Element)

Vue.use(svgicon, {
  tagName: 'svgicon'
});

import VueDragResize from 'vue-drag-resize'

Vue.component('vue-drag-resize', VueDragResize)
// Vue.prototype.$echarts = echarts

Vue.directive('enterNumber2', {
  inserted: function (el) {
    el.addEventListener("keypress", function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if (charcode == 46) {
        if (el.value.includes('.')) {
          e.preventDefault();
        }
        return;
      } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});

var messages = langdata;
var i18n = new VueI18n({
  locale: 'zh',
  messages: messages
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.$md5 = md5;
new Vue({
  i18n,
  router,
  store,
  el: "#app",
  render: h => h(App)
})
