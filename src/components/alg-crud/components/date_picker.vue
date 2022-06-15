<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :disabled="disable"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        readonly
        :loading="!disable"
        v-model="fieldDate"
        :label="title"
        prepend-inner-icon="mdi-calendar"
        v-on="on"
      >
        <template v-slot:progress>
          <!-- pra simular a barra inferior quando está clicavel -->
          <v-progress-linear
            absolute
            background-color="grey"
            height="1"
          ></v-progress-linear>
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      color="primary"
      no-title
      v-model="pickerDate"
      @click:date="selectDate()"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    title: String,
    value: String,
    disable: Boolean,
  },
  created() {
    this.pickerDate = this.parseDate(this.value);
    this.fieldDate = this.value;
  },
  data: () => ({
    menu: false,
    pickerDate: "",
    fieldDate: "",
  }),
  methods: {
    selectDate() {
      this.menu = false;
      this.fieldDate = this.formatDate(this.pickerDate);
      this.$emit("input", this.fieldDate);
    },
    formatDate(date) {
      // return DD/MM/YYYY format
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      // return YYYY-MM-DD format
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
};
</script>

