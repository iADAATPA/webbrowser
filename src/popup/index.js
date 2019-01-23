import Vue from 'vue'
import root from './root.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/element-theme/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({ // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
})
