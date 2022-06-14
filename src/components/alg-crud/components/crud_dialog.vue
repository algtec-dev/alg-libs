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
        <span class="ml-1">{{ title }}</span>
      </v-card-title>

      <v-card-text class="pa-3">
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
                  v-model="item[el.key]"
                  :type="el.type"
                  :label="el.value"
                  required
                  :rules="[(v) => !!v || 'Campo Obrigatório']"
                  :readonly="isLoading || (data && !isEditing)"
                  validate-on-blur
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="this.data && !isEditing"
          color="error"
          depressed
          :disabled="isLoading"
          @click="deleteItem"
        >
          Excluir
        </v-btn>

        <v-btn
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
          v-if="isEditing || !this.data"
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

export default {
  props: {
    crudDialogState: Boolean,
    data: Object,
    headers: Array,
    title: String,
    route: String,
  },
  created() {
    console.log(this.data);
    if (this.data) {
      this.item = JSON.parse(JSON.stringify(this.data)); //pra perder o vinculo da variavel
    }
  },
  data: () => ({
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
        errors = error.response.data.errors;
      });

      if (!errors) {
        // this.$root.vtoast.show({ message: "Item Adicionado" });
        this.closeDialog(true);
      } else {
        // this.$root.vtoast.show({ message: errors[0], color: "error" });
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
          errors = error.response.data.errors;
        });

      if (!errors) {
        // this.$root.vtoast.show({ message: "Dados Alterados" });
        this.closeDialog(true);
      } else {
        // this.$root.vtoast.show({ message: errors[0], color: "error" });
      }
    },
    async deleteItem() {
      this.isLoading = true;
      var errors;

      await http
        .delete(this.route + "/" + this.item._id)
        .catch(function (error) {
          errors = error.response.data.errors;
        });

      if (!errors) {
        // this.$root.vtoast.show({ message: "Item excluído" });
        this.closeDialog(true);
      } else {
        // this.$root.vtoast.show({ message: errors[0], color: "error" });
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