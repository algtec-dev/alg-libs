<template>
  <v-dialog
    v-model="dialog"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    :max-width="isOnlyDate ? 290 : 580"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="inputValue"
        v-bind="$attrs"
        v-on="$attrs.readonly ? null : on"
        @click="init"
        prepend-inner-icon="mdi-calendar"
        :clearable="!$attrs.readonly"
      >
      </v-text-field>
    </template>

    <v-card>
      <v-row no-gutters justify="space-around">
        <v-date-picker v-model="dateModel"></v-date-picker>
        <v-time-picker
          v-if="!isOnlyDate"
          v-model="hourModel"
          format="24hr"
        ></v-time-picker>
      </v-row>
      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-btn text @click="save">Salvar</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
const timeNow = Date.now();
export default {
  props: {
    value: String,
    dateType: String,
    onlyDate: Boolean,
  },
  computed: {
    isOnlyDate() {
      if (this.dateType == "date") return true;
      if (this.onlyDate) return true;
      return false;
    },
    jsDateTime() {
      let temp = new Date(new Date(timeNow).setHours(0, 0, 0, 0));

      let dateValues = this.dateModel.split("-");
      dateValues[1]--;
      temp.setFullYear(...dateValues);

      let hourValues = this.hourModel.split(":");
      temp.setHours(...hourValues);

      return temp;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    inputValue(newValue) {
      if (!newValue) {
        this.$emit("input");
      }
    },
  },
  data: () => ({
    dateModel: new Date(timeNow).toISOString().substr(0, 10),
    hourModel: "00:00",
    inputValue: "",
    dialog: false,
  }),
  methods: {
    getPreviewDate() {
      if (this.isOnlyDate) return this.jsDateTime.toLocaleDateString();
      else return this.jsDateTime.toLocaleString().substring(0, 16);
    },
    getOutputDate() {
      if (this.dateType == "date") return this.jsDateTime.toLocaleDateString();
      else return this.jsDateTime.toISOString();
    },
    init() {
      // works like a created function
      if (this.value) {
        if (this.dateType == "date") {
          const [day, month, year] = this.value.split("/");
          this.dateModel = new Date(year, month - 1, day)
            .toISOString()
            .substr(0, 10);
        } else {
          let tempDate = new Date(this.value);

          this.dateModel = tempDate.toISOString().substr(0, 10);
          this.hourModel = tempDate.toTimeString().substring(0, 4);
        }
        this.inputValue = this.getPreviewDate();
      }
    },
    save() {
      this.inputValue = this.getPreviewDate();
      this.$emit("input", this.getOutputDate());
      this.closeDialog();
    },
    closeDialog() {
      this.dateModel = new Date(timeNow).toISOString().substr(0, 10);
      this.hourModel = "00:00";
      this.dialog = false;
    },
  },
};
</script>

<style >
.v-date-picker-title {
  height: 70px;
}
</style>