<template>
  <v-container>
    <v-card flat outlined>
      <!-- toolbar -->
      <v-row no-gutters id="table-options" class="text-right">
        <v-col cols="12" md="4" class="text-left">
          <v-container class="py-2 font-weight-bold text-uppercase" fill-height>
            <v-icon dense left>
              {{ $router.currentRoute.meta.icon }}
            </v-icon>

            {{ $router.currentRoute.name }}
          </v-container>
        </v-col>
        <v-col cols="12" md="3" class="col-border">
          <v-divider class="hidden-md-and-up"></v-divider>
          <v-text-field
            placeholder="Pesquisar"
            prepend-inner-icon="mdi-magnify"
            v-model="search"
            flat
            solo
            dense
            clearable
            hide-details
          ></v-text-field>
          <v-divider class="hidden-md-and-up"></v-divider>
        </v-col>
        <!-- action button -->
        <v-col cols="12" md="5">
          <v-item-group class="text-center text-md-right">
            <v-btn tile depressed height="40">
              <v-icon dense left> mdi-printer </v-icon>
              <span class="caption">Exportar</span>
            </v-btn>

            <v-btn
              tile
              depressed
              height="40"
              color="primary"
              @click="showCrudDialog()"
            >
              <v-icon dense left> mdi-plus </v-icon>
              <span class="caption">Adicionar</span>
            </v-btn>

            <v-btn
              tile
              depressed
              height="40"
              color="warning"
              @click="$router.back()"
            >
              <v-icon dense left> mdi-arrow-left </v-icon>
              <span class="caption">Voltar</span>
            </v-btn>
          </v-item-group>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <!-- table -->
      <v-data-table
        class="stripped-table"
        fixed-header
        :height="availableHeight + 'px'"
        :loading="isLoading"
        :search="search"
        :headers="headers"
        :items="items"
        :footer-props="{
          'items-per-page-options': [15],
        }"
        @click:row="showCrudDialog($event)"
      >
      </v-data-table>
    </v-card>
    <CrudDialog
      v-if="crudDialogState"
      :crudDialogState="crudDialogState"
      :data="item"
      :headers="data"
      :route="route"
      @close-dialog="closeCrudDialog"
      @close-get-data="closeGetData"
    />
  </v-container>
</template>

<script>
import CrudDialog from "./components/crud_dialog.vue";
import http from "@/plugins/axios.js";

export default {
  name: "AlgCrud",
  components: {
    CrudDialog,
  },
  props: {
    route: String,
    data: Array,
  },
  async created() {
    // popula o header da tabela
    this.data.forEach((el) => {
      if (el.showInTable)
        this.headers.push({
          text: el.value,
          value: el.key,
          sortable: false,
        });
    });
    await this.getData();
  },
  mounted() {
    this.availableHeight = this.getTableHeight();
  },
  data() {
    return {
      item: null,
      availableHeight: 0,
      search: "",
      crudDialogState: false,
      isLoading: false,
      headers: [],
      items: [],
    };
  },
  methods: {
    async getData() {
      this.isLoading = true;

      var response = await http.get(this.route);
      this.items = response.data.data;

      this.isLoading = false;
    },
    showCrudDialog(e) {
      if (e) this.item = e;
      this.crudDialogState = true;
    },
    async closeGetData() {
      this.closeCrudDialog();
      this.getData();
    },
    closeCrudDialog() {
      this.item = null;
      this.crudDialogState = false;
    },
    getTableHeight() {
      // calcula a altura disponivel para a tabela
      var fineAdjust = 20;
      var main = document
        .getElementsByClassName("v-main__wrap")[0]
        .getBoundingClientRect().height;
      var toolbar = document
        .getElementById("table-options")
        .getBoundingClientRect().height;
      var header = document
        .getElementsByTagName("thead")[0]
        .getBoundingClientRect().height;
      var footer = document
        .getElementsByClassName("v-data-footer")[0]
        .getBoundingClientRect().height;

      return main - toolbar - header - footer + fineAdjust;
    },
  },
};
</script>

<style>
.primary--background {
  background-color: var(--v-primary-base) !important;
  color: white;
}
.stripped-table tbody tr:nth-of-type(odd) {
  background-color: #fafafa;
}
</style>

<style scoped>
/* media query MD */
@media only screen and (min-width: 960px) {
  .col-border {
    border-left: 1px solid lightgrey;
  }
}
</style>