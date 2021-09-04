<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('global.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="logOutCurrentUser">
            {{ t('global.logout') }}
            <ion-icon :icon="logOutOutline" slot="end"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('global.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item v-for="list in lists" :key="list.id" @click="openList(list)" button>
          <ion-text>{{ list.name }}</ion-text>
        </ion-item>

        <NewItemForm @form-submit="handleNewListSubmit" text="lists.addNewList"/>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon,
  IonItem,
  IonList,
  IonPage,
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
import {signOut} from "firebase/auth"
import {logOutOutline, arrowForwardOutline} from 'ionicons/icons';
import {useI18n} from "vue-i18n";
import {Container} from "@/utils/Container";
import {FirebaseAuthService} from "@/services/FirebaseAuthService";

export default {
  name: 'Home',
  components: {
    NewItemForm,
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonText,
    IonItem,
    IonButtons,
    IonButton
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const lists = computed(() => store.getters['lists/lists']);
    const {t} = useI18n();

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
      const auth = Container.get('FirebaseAuthService').auth;
      await signOut(auth)
    }

    return {
      t,
      arrowForwardOutline,
      logOutOutline,
      lists,
      openList,
      logOutCurrentUser,
      handleNewListSubmit
    }
  }
}
</script>
