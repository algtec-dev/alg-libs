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
            v-model="busca"
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
            <v-btn
              v-if="hasSlot('filters')"
              tile
              color="secondary"
              depressed
              height="40"
              @click="showFiltersDialog()"
            >
              <v-badge
                color="success"
                :content="filtersCount"
                :value="filtersCount"
                inline
              >
                <v-icon dense left> mdi-filter </v-icon>
                <span class="caption">Filtros</span>
              </v-badge>
            </v-btn>

            <v-btn tile depressed height="40" @click="exportItems()">
              <v-icon dense left> mdi-printer </v-icon>
              <span class="caption">Exportar</span>
            </v-btn>

            <v-btn
              v-permission="'CREATE'"
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
        :search="busca"
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItens"
        :sort-desc="null"
        :multi-sort="true"
        :footer-props="{
          'items-per-page-options': [perPage],
        }"
        :header-props="{
          'sort-icon': 'mdi-arrow-down',
        }"
        @click:row="showCrudDialog($event)"
      >
        <!-- para itens que precisem de personalização -->
        <template
          v-for="header in headers.filter((header) => header.formatter)"
          v-slot:[`item.${header.value}`]="{ value }"
        >
          {{ header.formatter(value) }}
        </template>

        <!-- para tipo icone -->
        <template v-slot:[`item.icon`]="{ item }">
          <v-icon>{{ item.icon }}</v-icon>
        </template>

        <!-- para nome social -->
        <template v-slot:[`item.name`]="{ item }">
          {{ item.socialName ? item.socialName : item.name }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-for="(btn, i) in headers.filter((h) => h.value == 'actions')[0]
              .actions"
            :key="i"
            text
            @click.stop="btn.action(item)"
            class="pa-1"
          >
            <div class="d-flex flex-column text-caption">
              <v-icon small>{{ btn.icon }}</v-icon>
              {{ btn.text }}
            </div>
          </v-btn>
        </template>

        <!-- <template
          v-for="header in headers.filter((header) => header.type == 'icon')"
          v-slot:[`item.${header.value}`]="{ value }"
        >
          <v-icon :key="header.value">{{ value }}</v-icon>
        </template> -->
      </v-data-table>
    </v-card>
    <CrudDialog
      v-if="crudDialogState"
      :crudDialogState="crudDialogState"
      :data="item"
      :headers="data"
      :route="route"
      :dialogWidth="dialogWidth"
      @close-dialog="closeCrudDialog"
      @close-get-data="closeGetData"
    >
      <template v-slot:dialog="props">
        <slot name="dialog" v-bind:data="props"> </slot>
      </template>
      <template v-slot:replace-dialog="props">
        <slot name="replace-dialog" v-bind:data="props"> </slot>
      </template>
    </CrudDialog>
    <FiltersDialog
      v-if="filtersDialogState"
      :filtersDialogState="filtersDialogState"
      v-model="filters"
      @close-dialog="closeFiltersDialog"
    >
      <template v-slot:filters="props">
        <slot name="filters" v-bind:data="props"> </slot>
      </template>
    </FiltersDialog>
  </v-container>
</template>

<script>
import CrudDialog from "./components/crud_dialog.vue";
import FiltersDialog from "./components/filters_dialog.vue";

import http from "@/plugins/axios.js";

export default {
  name: "AlgCrud",
  components: {
    CrudDialog,
    FiltersDialog,
  },
  props: {
    route: String,
    data: Array,
    customQuery: {
      default: "",
      type: String,
    },
    customParams: {
      type: Object,
    },
    dialogWidth: {
      default: 800,
      type: Number,
    },
  },
  async created() {
    // popula o header da tabela
    this.data.forEach((el) => {
      if (el.showInTable)
        this.headers.push({
          text: el.value,
          value: el.key,
          sortable: el.key != "actions",
          formatter: el.tableMask,
          actions: el.actions,
          align: el.key == "actions" ? "center" : undefined,
          // type: el.type,
        });
    });
    // await this.getData();
  },
  mounted() {
    this.availableHeight = this.getTableHeight();
  },
  computed: {
    filtersCount() {
      return Object.keys(this.filters).length;
    },
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true,
    },
    busca: function (val) {
      this.options.page = 1;
      this.abortSearch.abort();
      this.getData();
    },
    filters: {
      handler() {
        this.options.page = 1;
        this.abortSearch.abort();
        this.getData();
      },
      deep: true,
    },
  },
  data() {
    return {
      totalItens: 0,
      perPage: window.innerHeight > 800 ? 15 : 10,
      options: {},
      item: null,
      availableHeight: 0,
      busca: null,
      crudDialogState: false,
      isLoading: false,
      headers: [],
      items: [],
      abortSearch: null,
      filters: {},
      filtersDialogState: false,
    };
  },
  methods: {
    hasSlot(slot) {
      return !!this.$scopedSlots[slot];
    },
    async getData() {
      this.isLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      const filtersTemp = this.filters;

      const userQuery = this.customQuery;

      this.abortSearch = new AbortController();

      function serialize(params) {
        const qs = Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&");

        let sortString = "&";

        if (sortBy.length > 0) {
          for (const key in sortBy) {
            sortString += `$sort[${sortBy[key]}]=${sortDesc[key] ? -1 : 1}&`;
          }
        }

        let filterString = "&";

        if (filtersTemp) {
          for (const key in filtersTemp) {
            const element = filtersTemp[key];
            if (Array.isArray(element)) {
              element.forEach((item) => {
                filterString += `${key}[$in][]=${item}&`;
              });
            } else {
              if (element) filterString += `${key}=${element}&`;
            }
          }
        }

        return qs + sortString + filterString + userQuery;
      }

      let query = {
        params: {
          $limit: itemsPerPage,
          $skip: (page - 1) * itemsPerPage,
          ...this.customParams
        },
      };

      if (this.busca) {
        query.params.$search = this.busca;
      }

      try {
        var response = await http.get(this.route, {
          params: query.params,
          signal: this.abortSearch.signal,

          paramsSerializer: (params) => {
            return serialize(params);
          },
        });
        // console.log(decodeURI(response.request.responseURL));

        this.totalItens = response.data.total;
        this.items = response.data.data;
        this.isLoading = false;
      } catch (error) {
        // console.log(error);
      }
    },
    async exportItems() {
      var toExport = [];
      var response = await http.get(this.route, {
        params: {
          $paginate: false,
        },
      });

      response.data.forEach((item) => {
        let temp = {};
        this.data.forEach((element) => {
          var maintain = Object.keys(item).includes(element.key);
          if (maintain) {
            temp[element.key] = item[element.key];
          }
        });
        toExport.push(temp);
      });

      let filename = this.$router.currentRoute.name + ".csv";
      var data = [];
      var rows = toExport;
      data.push(Object.keys(rows[0]).join(";"));
      for (var i = 0; i < rows.length; i++) {
        var row = [],
          cols = rows[i];
        let values = Object.values(cols);
        for (var j = 0; j < values.length; j++) {
          row.push(values[j]);
        }
        data.push(row.join(";"));
      }
      var csv_file, download_link;
      csv_file = new Blob(["\ufeff", data.join("\n")], {
        type: "text/csv",
      });
      download_link = document.createElement("a");
      download_link.download = filename;
      download_link.href = window.URL.createObjectURL(csv_file);
      download_link.style.display = "none";
      document.body.appendChild(download_link);
      download_link.click();
    },
    showFiltersDialog() {
      this.filtersDialogState = true;
    },
    closeFiltersDialog() {
      this.filtersDialogState = false;
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
      var main = window.innerHeight;

      var appbar = document
        .getElementsByTagName("header")[0]
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

      return main - appbar - toolbar - header - footer + fineAdjust;
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
.pointer:hover {
  background: lightgrey;
  cursor: pointer;
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