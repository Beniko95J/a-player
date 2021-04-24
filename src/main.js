import Vue from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import Icon from '@/base/a-icon/a-icon'

import '@/styles/index.less'

Vue.config.productionTip = false

Vue.component(Icon.name, Icon)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
