<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="model"
    :items="items"
    :loading="isLoading"
    :search-input.sync="search"
    hide-no-data
    placeholder="Pesquisar"
    @change="$emit('input', model)"
    no-filter
    cache-items
  >
    <!-- <template v-if="listShowValues" v-slot:selection="data">
      <div v-for="(k, i) in listShowValues" :key="i">
        <span v-if="i == 0" v-html="data.item[k]" />
        <span v-else-if="data.item[k]" v-html="', ' + data.item[k]" />
      </div>
    </template> -->
    <template v-if="listShowValues" v-slot:item="data">
      <v-list-item-content>
        <div v-for="(k, i) in listShowValues" :key="i">
          <v-list-item-title v-if="i == 0" v-html="data.item[k]" />
          <v-list-item-subtitle v-else v-html="data.item[k]" />
        </div>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import http from "@/plugins/axios.js";

export default {
  props: ["value", "url", "listShowValues"],
  created() {
    if (this.value) this.getInitial();
    this.model = this.value;
  },

  data: () => ({
    model: null,
    isLoading: false,
    search: null,
    items: [],
    abortSearch: null,
  }),
  watch: {
    search(val) {
      if (!val) return;

      if (this.abortSearch) this.abortSearch.abort();

      this.getData();
    },
  },
  methods: {
    async getInitial() {
      this.isLoading = true;
      try {
        if (this.value instanceof Array) {
          var data = await Promise.all(
            this.value.map((val) => http.get(this.url + "/" + val))
          );

          for (const key in data) {
            this.items.push(data[key].data);
          }
        } else {
          var response = await http.get(this.url + "/" + this.value);

          this.items.push(response.data);
        }

        this.isLoading = false;
      } catch (error) {
        // console.log(error);
      }
    },
    async getData() {
      this.abortSearch = new AbortController();

      let query = {
        params: {},
      };

      if (this.search) {
        // console.log("search", this.search);
        query.params.$search = this.search;
      }

      try {
        var response = await http.get(this.url, {
          params: query.params,
          signal: this.abortSearch.signal,
        });

        this.items = response.data.data;
        // console.log(this.items);
        this.isLoading = false;
      } catch (error) {
        // console.log(error);
      }
    },
  },
};
</script>

