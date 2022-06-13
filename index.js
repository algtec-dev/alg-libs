import AlgCrud from './src/alg-crud/alg-crud.vue'
import AlgLogin from './src/alg-login/alg-login.vue'

function install(Vue, options = {}) {
    if (!options.color) console.warn('ALGLIBS: Informe um color');
    if (!options.baseUrl) throw "Informe a Url da API";


    Vue.prototype.$primaryColor = options.color ?? 'grey'
    Vue.prototype.$baseUrl = options.baseUrl ?? ''


    Vue.component('AlgCrud', AlgCrud)
    Vue.component('AlgLogin', AlgLogin)
}

export default {
    install
}
