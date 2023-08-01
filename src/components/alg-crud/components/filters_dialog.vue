<template>
  <v-dialog
    v-model="filtersDialogState"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    max-width="960"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card class="flexcard">
      <v-form>
        <v-card-title class="text-h6 primary--background">
          <v-icon dense left color="white">mdi-filter </v-icon>
          <span>Filtros</span>
        </v-card-title>

        <v-card-text class="grow">
          <slot name="filters" v-bind:data="item"></slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" depressed @click="clean()">
            Limpar Filtros
          </v-btn>
          <v-btn color="primary" depressed @click="closeDialog()">
            Salvar
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Object,
    filtersDialogState: Boolean,
  },
  created() {
    this.item = JSON.parse(JSON.stringify(this.value));
  },
  data: () => ({
    item: {},
  }),
  methods: {
    clean() {
      this.item = {};
      this.$emit("input", {});
      this.$emit("close-dialog");
    },
    closeDialog() {
      this.$emit("input", JSON.parse(JSON.stringify(this.item)));
      this.$emit("close-dialog");
    },
  },
};
</script>

<style>
.flexcard {
  display: flex;
  flex-direction: column;
}

.v-input--is-readonly > .v-input__control > .v-input__slot:before {
  border-style: none !important;
}

.v-input--is-readonly > .v-input__control > .v-input__slot:after {
  border-style: none !important;
}
.v-input--is-readonly label.v-label.v-label--active {
  color: var(--v-primary-base) !important;
}
</style>