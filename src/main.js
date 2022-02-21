import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from './router'
import {library} from "@fortawesome/fontawesome-svg-core"
import {faClone} from "@fortawesome/free-solid-svg-icons"
import {faTrashCan} from "@fortawesome/free-solid-svg-icons"
import {faArrowUp} from "@fortawesome/free-solid-svg-icons"
import {faArrowDown} from "@fortawesome/free-solid-svg-icons"

library.add(faClone)
library.add(faTrashCan)
library.add(faArrowUp)
library.add(faArrowDown)

createApp(App).use(router).mount('#app')
