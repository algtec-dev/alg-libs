<template>
  <v-text-field v-bind="$attrs" v-model="cmpValue" prefix="R$"></v-text-field>
</template>

<script>
export default {
  props: ["value"],
  computed: {
    cmpValue: {
      get: function () {
        if (!this.value) return;
        if (parseInt(this.value) == NaN) return "";

        try {
          return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          })
            .format(this.value / 100)
            .replaceAll("R$", "")
            .trim();
        } catch (error) {
          return this.value;
        }
      },
      set: function (newValue) {
        var toEmit = newValue
          .replaceAll("R$", "")
          .replaceAll(".", "")
          .replaceAll(",", "")
          .trim();
        this.$emit("input", parseInt(toEmit));
      },
    },
  },
};
</script>

