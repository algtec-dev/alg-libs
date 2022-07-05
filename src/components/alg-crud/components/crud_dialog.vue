<template>
  <v-dialog
    v-model="crudDialogState"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    max-width="600"
  >
    <v-card>
      <v-card-title class="text-h6 primary--background">
        <v-icon dense left color="white">
          {{ $router.currentRoute.meta.icon }}
        </v-icon>
        <span v-if="!this.data">Adicionar</span>
        <span v-if="this.data && !isEditing">Visualizar</span>
        <span v-if="this.data && isEditing">Editar</span>
        <span class="ml-1">{{ $router.currentRoute.name }}</span>
      </v-card-title>

      <v-card-text class="pa-3 overflow-y-auto" style="max-height: 60vh">
        <v-container>
          <v-form ref="form">
            <v-row>
              <v-col
                class="py-0"
                cols="12"
                :md="el.size ? el.size : 12"
                v-for="el in headers"
                :key="el.key"
              >
                <v-text-field
                  v-if="el.type == 'text' || el.type == 'number'"
                  v-model="item[el.key]"
                  :type="el.type"
                  :label="el.value"
                  v-mask="el.mask"
                  required
                  :rules="
                    el.rules != undefined
                      ? el.rules
                      : [(v) => !!v || 'Campo Obrigatório']
                  "
                  :readonly="isLoading || (data && !isEditing)"
                  validate-on-blur
                ></v-text-field>
                <DatePicker
                  v-if="el.type == 'date'"
                  v-model="item[el.key]"
                  :title="el.value"
                  :disable="isLoading || (data && !isEditing)"
                />
                <AlgIconPicker
                  v-if="el.type == 'icon'"
                  v-model="item[el.key]"
                  :label="el.value"
                  hide-details
                  required
                  :rules="
                    el.rules != undefined
                      ? el.rules
                      : [(v) => !!v || 'Campo Obrigatório']
                  "
                  :readonly="isLoading || (data && !isEditing)"
                  validate-on-blur
                ></AlgIconPicker>
                <v-autocomplete
                  v-if="el.type == 'select'"
                  v-model="item[el.key]"
                  :label="el.value"
                  v-mask="el.mask"
                  :items="el.options"
                  item-text="text"
                  item-value="value"
                  required
                  :rules="
                    el.rules != undefined
                      ? el.rules
                      : [(v) => !!v || 'Campo Obrigatório']
                  "
                  :readonly="isLoading || (data && !isEditing)"
                  validate-on-blur
                ></v-autocomplete>
              </v-col>
            </v-row>
            <slot
              name="dialog"
              v-bind:isEditing="isEditing"
              v-bind:isLoading="isLoading"
              v-bind:isNew="isNew"
              v-bind:item="item"
            ></slot>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-permission="'DELETE'"
          v-if="this.data && !isEditing"
          color="error"
          depressed
          :disabled="isLoading"
          @click="deleteItem"
        >
          Excluir
        </v-btn>

        <v-btn
          v-permission="'UPDATE'"
          v-if="this.data && !isEditing"
          color="secondary"
          depressed
          :disabled="isLoading"
          @click="isEditing = !isEditing"
        >
          Editar
        </v-btn>
        <v-btn
          color="warning"
          depressed
          :disabled="isLoading"
          @click="closeDialog()"
        >
          Fechar
        </v-btn>
        <v-btn
          v-if="isEditing || !data"
          color="primary"
          depressed
          :loading="isLoading"
          @click="save"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import http from "@/plugins/axios.js";
import DatePicker from "./date_picker.vue";
import AlgIconPicker from "../../alg-icon-picker/icon-picker.vue";

export default {
  props: {
    crudDialogState: Boolean,
    data: Object,
    headers: Array,
    route: String,
  },
  components: {
    DatePicker,
    AlgIconPicker,
  },
  created() {
    if (this.data) {
      this.item = JSON.parse(JSON.stringify(this.data)); //pra perder o vinculo da variavel
    } else {
      let temp = {};

      this.headers.forEach((element) => {
        if (element.default) temp[element.key] = element.value;
      });

      this.item = JSON.parse(JSON.stringify(temp));
      this.isNew = true;
    }
  },
  data: () => ({
    isNew: false,
    item: {},
    isEditing: false,
    isLoading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.isLoading = true;
        if (!this.data) {
          await this.createItem();
        } else {
          await this.updateItem();
        }
        this.isLoading = false;
      }
    },
    async createItem() {
      var errors;

      await http.post(this.route, this.item).catch(function (error) {
        console.log(error);
        errors = true;
      });

      if (!errors) {
        this.$root.notify.showSuccessToast("Item Adicionado");
        this.closeDialog(true);
      } else {
        this.$root.notify.showErrorToast("Erro");
      }
    },
    async updateItem() {
      if (JSON.stringify(this.item) == JSON.stringify(this.data)) {
        // this.$root.vtoast.show({ message: "Sem Alterações", color: "warning" });
        return;
      }

      var errors;

      await http
        .patch(this.route + "/" + this.item._id, this.item)
        .catch(function (error) {
          console.log(error);
          errors = true;
        });

      if (!errors) {
        this.$root.notify.showSuccessToast("Dados Alterados");
        this.closeDialog(true);
      } else {
        this.$root.notify.showErrorToast("Erro");
      }
    },
    async deleteItem() {
      this.isLoading = true;
      var errors;

      await http
        .delete(this.route + "/" + this.item._id)
        .catch(function (error) {
          console.log(error);
          errors = true;
        });

      if (!errors) {
        this.$root.notify.showSuccessToast("Item excluído");

        this.closeDialog(true);
      } else {
        this.$root.notify.showErrorToast("Erro");
        this.isLoading = false;
      }
    },
    closeDialog(getData) {
      if (getData) this.$emit("close-get-data");
      else this.$emit("close-dialog");
    },
  },
};
</script>

<style>
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