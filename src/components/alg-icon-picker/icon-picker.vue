<template>
  <v-autocomplete
    v-bind="$attrs"
    v-model="selectedIcon"
    :items="icons"
    label="Ícone"
    @change="$emit('input', selectedIcon)"
  >
    <template v-slot:selection="{ item }">
      <v-icon v-text="item"></v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-icon left v-text="item"></v-icon>
      <v-list-item-title class="text-caption" v-text="item"></v-list-item-title>
    </template>
  </v-autocomplete>
</template>

<script>
import icons from "./icons.min.js";

export default {
  props: {
    value: String,
  },
  data: () => ({
    icons,
    selectedIcon: null,
  }),
};
</script>

