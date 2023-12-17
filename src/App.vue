<template>
  <ion-app>
    <LoadingBar/>

    <ion-router-outlet/>

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
import {SharedWeekConverter} from "@/models/converter/SharedWeekConverter";
import {SharedWeek} from "@/models/dtos/WeekPlan/SharedWeek";
import useAuthentication from "@/composable/use-authentication";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {BillGroupConverter} from "@/models/converter/Bill/BillGroupConverter";
import Unsubscribe = firebase.Unsubscribe;

export default defineComponent({
  name: 'App',
  components: {
    LoadingBar,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const {startLoading} = useLoading();
    const {registerBindings} = useFirestoreBinding()
    const {defineCurrentUser} = useAuthentication();
    const db = Container.get<FirebaseDatabaseService>('FirebaseDatabaseService').db

    const unSubscribeFunctions: Unsubscribe[] = [];

    startLoading().then(() => {
      useBindAuthentication().then((user) => {
        defineCurrentUser(user);
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
            ],
            {
              storePath: "weeks/",
              converter: WeekConverter
            });

        const sharedWeekUnSubscribeFunctions = registerBindings<SharedWeek>("sharedWeeks",
            [
              query(collection(db, "weeks"), where('sharedWith.' + user.uid, '!=', null)),
            ],
            {
              storePath: "sharedWeeks/",
              converter: SharedWeekConverter
            });

        unSubscribeFunctions.push(...weekUnSubscribeFunctions)
        unSubscribeFunctions.push(...sharedWeekUnSubscribeFunctions)

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

        const billingGroupUnsubscribeFunction = registerBindings<BillGroup>("groups", [
          query(collection(db, "billGroups"), where("participants_uids", "array-contains", user.uid))
        ], {
          storePath: "bills/",
          converter: BillGroupConverter
        })

        unSubscribeFunctions.push(...billingGroupUnsubscribeFunction);
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
