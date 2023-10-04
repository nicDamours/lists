<template>
  <ion-app>
    <LoadingBar/>

    <ion-router-outlet/>

    <OrganismPreferences/>
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {defineComponent, onBeforeUnmount} from 'vue';
import useFirestoreBinding from "@/composable/use-firestore-binding";
import ListConverter from "@/models/converter/ListConverter";
import {List} from "@/models/dtos/List";
import useBindAuthentication from "@/composable/use-bind-authentication";
import {collection, query, where} from "@firebase/firestore";
import OrganismPreferences from "@/components/OrganismPreferences.vue";
import {Container} from "@/utils/Container";
import {FirebaseDatabaseService} from "@/services/FirebaseDatabaseService";
import LoadingBar from "@/components/LoadingBar.vue";
import useLoading from "@/composable/use-loading";
import {ShareRequestConverter} from "@/models/converter/ShareRequestConverter";
import WeekConverter from "@/models/converter/WeekConverter";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import ShareRequest from "@/models/dtos/ShareRequest";
import firebase from "firebase/compat";
import {WeekSharingConverter} from "@/models/converter/WeekSharingConverter";
import {WeekSharing} from "@/models/dtos/WeekSharing";
import Unsubscribe = firebase.Unsubscribe;

export default defineComponent({
  name: 'App',
  components: {
    LoadingBar,
    OrganismPreferences,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const {startLoading} = useLoading();
    const {registerBindings} = useFirestoreBinding()
    const db = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

    const unSubscribeFunctions: Unsubscribe[] = [];

    startLoading().then(() => {
      useBindAuthentication().then((user) => {
        const listUnSubscribeFunctions = registerBindings<List>("lists",
            [
              query(collection(db, "lists"), where('user', '==', user.uid)),
              query(collection(db, "lists"), where('sharedWith.' + user.uid, '!=', null)),
            ],
            {
              storePath: "lists/",
              converter: ListConverter
            });

        unSubscribeFunctions.push(...listUnSubscribeFunctions)

        const weekUnSubscribeFunctions = registerBindings<WeekPlan>("weeks",
            [
              query(collection(db, "weeks"), where('user', '==', user.uid)),
              query(collection(db, "weeks"), where('sharedWith.' + user.uid, '!=', null)),
            ],
            {
              storePath: "weeks/",
              converter: WeekConverter
            });

        unSubscribeFunctions.push(...weekUnSubscribeFunctions)

        const weekSharingUnsubscribeFunctions = registerBindings<WeekSharing>("weekSharing", [
              query(collection(db, "weekSharing"), where("targetId", '==', user.uid)),
              query(collection(db, "weekSharing"), where("authorId", '==', user.uid))
            ], {
              storePath: "weekSharing/",
              converter: WeekSharingConverter
            },
        )

        unSubscribeFunctions.push(...weekSharingUnsubscribeFunctions);

        const shareRequestUnSubscribeFunctions = registerBindings<ShareRequest>("shareRequests", [
          query(collection(db, "shareRequest"), where("targetId", '==', user.uid)),
          query(collection(db, "shareRequest"), where("authorId", '==', user.uid))
        ], {
          storePath: "shareRequests/",
          converter: ShareRequestConverter
        })

        unSubscribeFunctions.push(...shareRequestUnSubscribeFunctions);
      });
    })

    onBeforeUnmount(() => {
      unSubscribeFunctions.forEach((unSubscribeFn: Unsubscribe) => {
        unSubscribeFn();
      })
    })
  }
});
</script>
