<template>
  <ion-app>
    <LoadingBar />
    <ion-router-outlet/>

    <Preferences/>
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
import LoadingBar from "@/components/LoadingBar.vue";
import useLoading from "@/composable/use-loading";
import {ShareRequestConverter} from "@/models/converter/ShareRequestConverter";
import ShareRequest from "@/models/dtos/ShareRequest";

export default defineComponent({
  name: 'App',
  components: {
    LoadingBar,
    Preferences,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const { startLoading } = useLoading();
    const {registerBindings} = useFirestoreBinding()
    const db = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

    startLoading().then(() => {
      useBindAuthentication().then((user) => {
        registerBindings<List>("lists",
            [
                query(collection(db, "lists"), where('user', '==', user.uid)),
                query(collection(db, "lists"), where( 'sharedWith', 'array-contains', user.uid)),
            ],
            {
              storePath: "lists/",
              converter: ListConverter
            });

        registerBindings<ShareRequest>("shareRequests", [
            query(collection(db, "shareRequest"), where("targetId", '==', user.uid)),
            query(collection(db, "shareRequest"), where("authorId", '==', user.uid))
        ],{
          storePath: "shareRequests/",
          converter: ShareRequestConverter
        })
      });
    })
  }
});
</script>
