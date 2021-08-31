<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Lists</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="logOutCurrentUser">LOG OUT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inbox</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item v-for="list in lists" :key="list.id" @click="openList(list)" button>
          <ion-text>{{ list.name }}</ion-text>
        </ion-item>

        <NewItemForm @form-submit="handleNewListSubmit" name="list" />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {computed} from 'vue';
import {useStore} from "vuex";
import {List} from "@/models/dtos/List";
import {useRouter} from "vue-router";
import NewItemForm from "@/components/NewItemForm.vue";
import ListService from "@/services/ListService";
import { signOut } from "firebase/auth"
import getAuthInstance from "@/auth";

export default {
  name: 'Home',
  components: {
    NewItemForm,
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    IonText,
    IonItem,
    IonButtons,
    IonButton
  },
  setup () {
    const store = useStore();
    const router = useRouter();
    const lists = computed(() => store.getters['lists/lists']);

    const openList = async (list) => {
      await router.push({
        name: "ListView",
        params: {
          id: list.id
        }
      })
    }

    const handleNewListSubmit = async (value) => {
      const dto = new List("irrelevent", value)

      await ListService.addList(dto);

    }

    const logOutCurrentUser = async () => {
      await signOut(getAuthInstance())
    }

    return {
      lists,
      openList,
      logOutCurrentUser,
      handleNewListSubmit
    }
  }
}
</script>
