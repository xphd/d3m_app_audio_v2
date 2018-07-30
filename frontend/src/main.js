// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

import VueSocketio from "vue-socket.io";
import { store } from "./store/store";

import Vuetify from "vuetify";

Vue.config.productionTip = false;

var url = "http://127.0.0.1:3000/";
Vue.use(VueSocketio, url); //这里的url是后台提供的socket的地址

Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  components: { App },
  template: "<App/>"
});
