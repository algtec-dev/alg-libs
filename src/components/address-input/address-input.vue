<template>
  <v-row>
    <v-col cols="12" class="py-0">
      <v-text-field
        label="CEP"
        v-model="item.address.cep"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="8" class="py-0">
      <v-text-field
        label="Endereço"
        v-model="item.address.streetName"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        label="Numero"
        v-model="item.address.streetNumber"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        label="Bairro"
        v-model="item.address.neighborhood"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        label="Cidade"
        v-model="item.address.city"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
    <v-col cols="4" class="py-0">
      <v-text-field
        label="Cidade"
        v-model="item.address.uf"
        required
        validate-on-blur
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: Object,
  },
  created() {
    let temp = JSON.parse(JSON.stringify(this.value));
    if (temp.address == undefined) temp.address = {};
    this.item = temp;
  },
  data: () => ({
    item: {},
  }),
  watch: {
    item: {
      handler(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

