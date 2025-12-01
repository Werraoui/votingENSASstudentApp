import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {db} from "./Firebase/Config"

/*console.log("firebase is ok ",db)*/
createApp(App).use(router).mount('#app')
