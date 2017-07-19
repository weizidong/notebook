import Vue from 'vue'
import App from './components/App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
const app = new Vue({
  router,
  ...App
})
export {app, router}
