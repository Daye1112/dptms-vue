import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'default-passive-events'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/router/permission'
import common from "@/assets/js/common"

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);
Vue.use(common);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// 全局自定义指令
// Vue.directive('focus', {
//   inserted: function(el) {
//     el.focus()
//   }
// })

/* Vue.directive('spin', {
  update: functioin(el, binding) {
    const {value} = binding;
    if(value){

    }
  }
})
 */
