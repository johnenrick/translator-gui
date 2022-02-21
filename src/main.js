import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from './router'
import {library} from "@fortawesome/fontawesome-svg-core"
import {faClone} from "@fortawesome/free-solid-svg-icons"

library.add(faClone)

createApp(App).use(router).mount('#app')
