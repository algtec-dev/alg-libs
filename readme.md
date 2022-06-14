# AlgLibs
## _Componentes Vue/Vuetify_

Componentes disponiveis

- AlgCrud

## Instalação

AlgLibs necessita de algumas dependencias no seu projeto principal

- Vue
- Vuetify
- Axios

Após a devida configuração do projeto instale o AlgLibs

```sh
npm install https://github.com/algtec-dev/alg-libs
```

Em seu arquivo main.js

```sh
import AlgLibs from "alglibs";

Vue.use(AlgLibs, {
  color: '#01814B', //css colors
  apiUrl: 'http://locahost:3030/api',
})
```

## Componentes

Modo de uso dos componentes

### AlgCrud

> Tutorial aqui