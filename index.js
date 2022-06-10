import AlgCrud from './src/alg-crud/alg-crud.vue'
import AlgLogin from './src/alg-login/alg-login.vue'

function install(Vue, options = {}) {
    Vue.prototype.$primaryColor = options.color ?? 'grey'

    Vue.component('AlgCrud', AlgCrud)
    Vue.component('AlgLogin', AlgLogin)
}

export default {
    install
}
