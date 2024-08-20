<template>
  <ion-item-sliding></ion-item-sliding>
</template>

<script>
import {Item} from "@/models/dtos/Item";
import {IonItemSliding} from "@ionic/vue";

export default {
  name: "ListItem",
  components: {IonItemSliding},
  props: {
    item: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof Item
      }
    }
  },
  setup() {
    return {};
  }
};
</script>
