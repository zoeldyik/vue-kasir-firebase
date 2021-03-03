import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import router from './router'
import {fbAuth} from './firebase/config'

Vue.use(Buefy)
Vue.config.productionTip = false

let app;

fbAuth.onAuthStateChanged(()=>{
  if(!app){
    app = new Vue({
          store,
          router,
          render: h => h(App)
        }).$mount('#app')
  }
})
