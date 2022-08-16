<template>
  <v-dialog
    v-model="dialog"
    @click:outside="cancel"
    @keydown.esc="cancel"
    width="400"
  >
    <v-card>
      <v-card-title
        class="text-h6 primary--background"
        style="background-color: red !important"
      >
        <v-icon dense left color="white">
          {{ $router.currentRoute.meta.icon }}
        </v-icon>
        <span>Confirmação de Exclusão</span>
      </v-card-title>

      <v-card-title>Deseja remover esse item?</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" depressed @click="cancel">Não</v-btn>
        <v-btn color="primary" depressed @click="agree">Sim</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "delete-confirmation",
  data: () => ({
    dialog: false,
    resolve: null,
  }),

  methods: {
    open() {
      this.dialog = true;
      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>