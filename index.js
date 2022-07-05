import AlgCrud from './src/components/alg-crud/alg-crud.vue'
import AlgLogin from './src/components/alg-login/alg-login.vue'
import AlgToast from './src/components/alg-toast/alg-toast.vue'
import AlgIconPicker from './src/components/alg-icon-picker/icon-picker.vue'


import { VueMaskDirective } from 'v-mask'


function install(Vue, router, options = {}) {
    // testes de props
    if (!options.color) console.warn('ALGLIBS: Informe um color');
    if (!options.apiUrl) throw "ALGLIBS: Informe a Url da API";

    Vue.directive('permission', {
        bind: function (el, binding, vnode) {
            let modules = JSON.parse(localStorage.getItem('modules'))

            const currentService = router.currentRoute.path.toUpperCase().substring(1)

            let service;

            for (const key in modules) {
                service = modules[key].services.find(element => element.route == currentService)
                if (service) break
            }

            if (!service) return

            if (!service.permissions.includes(binding.value))
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
}

export default {
    install
}