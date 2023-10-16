import AlgCrud from './src/components/alg-crud/alg-crud.vue'
import AlgLogin from './src/components/alg-login/alg-login.vue'
import AlgToast from './src/components/alg-toast/alg-toast.vue'
import AlgIconPicker from './src/components/alg-icon-picker/icon-picker.vue'
import DatePicker from './src/components/alg-crud/components/date_picker.vue'
import MoneyInput from './src/components/money-input/money-input.vue'
import SearchInput from './src/components/search-input/search-input.vue'

import { VueMaskDirective } from 'v-mask'


function install(Vue, options = {}) {
    // testes de props
    if (!options.color) console.warn('ALGLIBS: Informe um color');
    if (!options.apiUrl) throw "ALGLIBS: Informe a Url da API";

    Vue.directive('permission', {
        bind: function (el, binding, vnode) {

            if (!binding.value) return;

            const currentService = options.router.currentRoute.path.substring(1)

            if (!options.store.state.permissions[currentService].includes(binding.value))
                vnode.elm.style.display = "none";
        }
    })


    Vue.directive('mask', VueMaskDirective);

    // define a variavel css global
    var r = document.querySelector(":root");
    r.style.setProperty("--v-primary-base", options.color ?? 'grey');

    // atribui a variavel global da url da api
    Vue.prototype.$apiUrl = options.apiUrl ?? ''

    Vue.component('AlgCrud', AlgCrud)
    Vue.component('AlgLogin', AlgLogin)
    Vue.component('AlgToast', AlgToast)
    Vue.component('AlgIconPicker', AlgIconPicker)
    Vue.component('DatePicker', DatePicker)
    Vue.component('MoneyInput', MoneyInput)
    Vue.component('SearchInput', SearchInput)

}

export default {
    install
}