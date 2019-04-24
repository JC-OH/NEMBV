// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import router from './router'

// [axios 추가]
// 일반적으로 jquery사용할때 $(ajax)를 많이 이용했었다.
// vue에 jquery를 깔아도 되지만.. pure하게 vue를 즐겨야 되기 때문에(사실 부트스트랩에 의존요소로 미니jquery가 깔려있긴하다) fe에 xhr 요청을 하기 위한 axios를 추가해본다.
import axios from 'axios'; // add


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// axios는 이제 모든 페이지서 사용될 것이기 때문에 전역 선언을 한다.
// 이제 다른 페이지(컴포넌트)에서 this.$axios로 어디서든 사용 가능하다.
Vue.prototype.$axios = axios; // add
Vue.use(BootstrapVue)
Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
