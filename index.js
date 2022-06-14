import AlgCrud from './src/components/alg-crud/alg-crud.vue'
import AlgLogin from './src/components/alg-login/alg-login.vue'

function install(Vue, options = {}) {
    // testes de props
    if (!options.color) console.warn('ALGLIBS: Informe um color');
    if (!options.apiUrl) throw "ALGLIBS: Informe a Url da API";

    // define a variavel css global
    var r = document.querySelector(":root");
    r.style.setProperty("--v-primary-base", options.color ?? 'grey');

    // atribui a variavel global da url da api
    Vue.prototype.$apiUrl = options.apiUrl ?? ''

    Vue.component('AlgCrud', AlgCrud)
    Vue.component('AlgLogin', AlgLogin)
}

export default {
    install
}