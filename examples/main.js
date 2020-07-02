import Vue from 'vue'
import App from './App.vue'
import './assets/css/common.css';
import vPrinceTab from "../packages/index";
Vue.use(vPrinceTab)
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
