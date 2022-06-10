import AlgCrud from './src/alg-crud/alg-crud.vue'
import AlgLogin from './src/alg-login/alg-login.vue'

function install(Vue, options = {}) {
    if (!options.color) console.warn('ALGLIBS: Informe um color');

    Vue.prototype.$primaryColor = options.color ?? 'grey'

    Vue.component('AlgCrud', AlgCrud)
    Vue.component('AlgLogin', AlgLogin)
}

export default {
    install
}
