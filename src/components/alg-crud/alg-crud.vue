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
          v-for="(slot, i) in data"
          v-slot:[`item.${slot.key}`]="{ item }"
        >
          <div :key="i">
            <slot
              v-if="hasSlot(slot.key)"
              :name="slot.key"
              v-bind:data="item[slot.key]"
            />
            <span v-else v-html="item[slot.key]" />
          </div>
        </template>
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
    >
      <template v-slot:dialog="props">
        <slot name="dialog" v-bind:data="props"> </slot>
      </template>
    </CrudDialog>
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
          sortable: true,
        });
    });
    // await this.getData();
  },
  mounted() {
    this.availableHeight = this.getTableHeight();
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
    };
  },
  methods: {
    hasSlot(slot) {
      return !!this.$scopedSlots[slot];
    },
    async getData() {
      this.isLoading = true;
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

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

        return qs + sortString;
      }

      let query = {
        params: {
          $limit: itemsPerPage,
          $skip: (page - 1) * itemsPerPage,
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