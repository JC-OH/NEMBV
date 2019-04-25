// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
// moment: 시간관련
import moment from 'moment';
// sweetalert: alert 모양변경
import swal from 'sweetalert';
// vue-awesome: font-awesome
import Icon from 'vue-awesome/components/Icon';
// vue2-google-maps: 구글맵 사용
import * as VueGoogleMaps from 'vue2-google-maps';
import VueCookie from 'vue-cookie';


import App from './App'
import router from './router'

// [axios 추가]
// 일반적으로 jquery사용할때 $(ajax)를 많이 이용했었다.
// vue에 jquery를 깔아도 되지만.. pure하게 vue를 즐겨야 되기 때문에(사실 부트스트랩에 의존요소로 미니jquery가 깔려있긴하다) fe에 xhr 요청을 하기 위한 axios를 추가해본다.
import axios from 'axios'; // add


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-awesome/icons';

import fam from 'fontawesome-markers/fontawesome-markers.json';
import cfg from '../static/cfg';

// moment 표현 한글로 변경
moment.locale('ko');

// process.env.NODE_ENV 가 ‘production’ 면 npm run build ‘development’ 면 npm run dev
if (process.env.NODE_ENV === 'development') cfg.path.api = 'http://localhost:3000/api/';

// [axios의 모든 응답은 이곳을 거친다.]
const token = VueCookie.get('token');
// cookie를 가져와서 있다면 공용헤더 인증에 넣어준다.
if (token) axios.defaults.headers.common.Authorization = VueCookie.get('token');

axios.interceptors.response.use((res) => {
  // sign.vue에서 요청을 할 경우 응답에 토큰이 있으니, cookie에 저장하고 공용헤더 인증에 넣어준다.
  if (res.data.token) {
    // 쿠키 만료시간도 역시 2분으로 주었다. 1년으로 준다 하더라도 api에서 리젝당하니 별 의미는 없다.
    VueCookie.set('token', res.data.token, { expires: '2m' });
    axios.defaults.headers.common.Authorization = VueCookie.get('token');
  }
  return Promise.resolve(res);
}, (err) => {
  // 다른 페이지 요청시 응답에러에 401이 있을 경우 로그인 페이지로 이동 시킨다.
  if (err.response.status === 401) {
    location.href = '/#/sign';
    return;
  }
  return Promise.reject(err);
});

// [전역으로 쓰기 위한 prototype 구성]
// axios는 이제 모든 페이지서 사용될 것이기 때문에 전역 선언을 한다.
// 이제 다른 페이지(컴포넌트)에서 this.$axios로 어디서든 사용 가능하다.
Vue.prototype.$axios = axios; // add
Vue.prototype.$cfg = cfg;
Vue.prototype.$moment = moment;
Vue.prototype.$swal = swal;
Vue.prototype.$fam = fam;
Vue.use(BootstrapVue);

// 회사 위치를 표현하기 위한 googlemap init 해당 라이브러리 예제에 있는 키인데 테스트 되길래 쓰고 있다. 가지고 있는 키가 있다면 변경해서 쓰면된다
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
  // installComponents: true,
});

// 하위 템플릿에서 icon 태그 쓰기 위해 등록
Vue.component('icon', Icon);

Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
