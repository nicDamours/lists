<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import useFirestoreBinding from "@/composable/use-firestore-binding";
import ListConverter from "@/models/converter/ListConverter";
import {List} from "@/models/dtos/List";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    useFirestoreBinding<List>("lists", {
      storePath: "lists/",
      converter: ListConverter
    });
  }
});
</script>
