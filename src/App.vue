<template>
  <ion-app>
    <ion-router-outlet/>

    <ThemeToggle />
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {defineComponent} from 'vue';
import useFirestoreBinding from "@/composable/use-firestore-binding";
import ListConverter from "@/models/converter/ListConverter";
import {List} from "@/models/dtos/List";
import useBindAuthentication from "@/composable/use-bind-authentication";
import {collection, query, where} from "@firebase/firestore";
import getDatabaseInstance from "@/db";
import ThemeToggle from "@/components/ThemeToggle.vue";

export default defineComponent({
  name: 'App',
  components: {
    ThemeToggle,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const {registerBindings} = useFirestoreBinding<List>()

    useBindAuthentication().then((user) => {
      registerBindings("lists",
          query(collection(getDatabaseInstance(), "lists"), where('user', '==', user.uid)),
          {
            storePath: "lists/",
            converter: ListConverter
          });
    });
  }
});
</script>
