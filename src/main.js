// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate from 'vee-validate';
import zhTW_Validate from 'vee-validate/dist/locale/zh_TW';

import App from './App';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';


axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);
Vue.use(VeeValidate, {
  events: 'input|blur',
});
VeeValidate.Validator.localize('zh_TW', zhTW_Validate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
router.beforeEach((to, from, next) => {
  console.log('to', to, 'form', from, 'next', next);
  if (to.meta.requiresAuth) {
    const api = `${process.env.API_PATH}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login'
        });
      }
    });
  } else {
    next();
  }

}) 
