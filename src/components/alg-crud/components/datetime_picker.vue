<template>
  <div>
    <v-datetime-picker
      v-bind="$attrs"
      v-model="date"
      dateFormat="dd/MM/yyyy"
      clearText="Sair"
      okText="Salvar"
      :datePickerProps="{ 'no-title': true }"
      :timePickerProps="{ 'ampm-in-title': true, format: '24hr' }"
      :textFieldProps="{
        rules: [(value) => !!value || 'Required.'],
        'hide-details': true,
      }"
    >
      <template v-slot:dateIcon>
        <v-icon left> mdi-calendar </v-icon>
        Data
      </template>
      <template v-slot:timeIcon>
        <v-icon left> mdi-clock-outline </v-icon>
        Hora
      </template>
    </v-datetime-picker>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: ["value"],
  created() {
    if (this.value) {
      this.date = new Date(this.value);
    }
  },
  watch: {
    date: function (val) {
      this.$emit("input", this.date);
    },
  },
  data: () => ({
    date: "",
  }),
};
</script>

