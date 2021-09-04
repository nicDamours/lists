<template>
  <ion-app>
    <ion-router-outlet/>

    <Preferences />
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
import Preferences from "@/components/Preferences.vue";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";

export default defineComponent({
  name: 'App',
  components: {
    Preferences,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const {registerBindings} = useFirestoreBinding<List>()
    const db = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

    useBindAuthentication().then((user) => {
      registerBindings("lists",
          query(collection(db, "lists"), where('user', '==', user.uid)),
          {
            storePath: "lists/",
            converter: ListConverter
          });
    });
  }
});
</script>
