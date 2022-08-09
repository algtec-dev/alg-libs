<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-text-field
        v-bind="$attrs"
        label="CEP"
        v-model="item.address.cep"
        required
        v-mask="['#####-###']"
        @input="cepSearch"
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="8" class="py-0">
      <v-text-field
        v-bind="$attrs"
        label="Endereço"
        v-model="item.address.streetName"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        v-bind="$attrs"
        label="Numero"
        v-model="item.address.streetNumber"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        v-bind="$attrs"
        label="Bairro"
        v-model="item.address.neighborhood"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        v-bind="$attrs"
        label="Cidade"
        v-model="item.address.city"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-autocomplete
        v-bind="$attrs"
        label="Estado"
        v-model="item.address.uf"
        required
        validate-on-blu
        :items="states"
        item-text="text"
        item-value="value"
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
import http from "@/plugins/axios.js";

export default {
  props: {
    value: Object,
  },
  created() {
    let temp = JSON.parse(JSON.stringify(this.value));
    if (temp.address == undefined) temp.address = {};
    this.item = temp;
  },
  watch: {
    item: {
      handler(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
  data: () => ({
    item: {},
    initialSearch: true,
    isSearching: false,
    states: [
      { text: "Acre", value: "AC" },
      { text: "Alagoas", value: "AL" },
      { text: "Amapá", value: "AP" },
      { text: "Amazonas", value: "AM" },
      { text: "Bahia", value: "BA" },
      { text: "Ceará", value: "CE" },
      { text: "Distrito Federal", value: "DF" },
      { text: "Espírito Santo", value: "ES" },
      { text: "Goiás", value: "GO" },
      { text: "Maranhão", value: "MA" },
      { text: "Mato Grosso", value: "MT" },
      { text: "Mato Grosso do Sul", value: "MS" },
      { text: "Minas Gerais", value: "MG" },
      { text: "Pará", value: "PA" },
      { text: "Paraíba", value: "PB" },
      { text: "Paraná", value: "PR" },
      { text: "Pernambuco", value: "PE" },
      { text: "Piauí", value: "PI" },
      { text: "Rio de Janeiro", value: "RJ" },
      { text: "Rio Grande do Norte", value: "RN" },
      { text: "Rio Grande do Sul", value: "RS" },
      { text: "Rondônia", value: "RO" },
      { text: "Roraima", value: "RR" },
      { text: "Santa Catarina", value: "SC" },
      { text: "São Paulo", value: "SP" },
      { text: "Sergipe", value: "SE" },
      { text: "Tocantins", value: "TO" },
    ],
  }),
  methods: {
    async cepSearch(el) {
      if (this.initialSearch) {
        this.initialSearch = false;
        return;
      }

      if (this.isSearching) return;

      if (el.length == 9) {
        this.isSearching = true;
        let response = await http({
          method: "GET",
          baseURL: `https://viacep.com.br/ws/${el}/json/`,
        });
        if (!response.data.erro) {
          this.item.address = {
            cep: el,
            streetName: response.data.logradouro,
            neighborhood: response.data.bairro,
            city: response.data.localidade,
            uf: response.data.uf,
          };
        }
        this.isSearching = false;
      }
    },
  },
};
</script>

