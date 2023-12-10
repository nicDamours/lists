<template>
  <BasePageTemplate>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('pages.lists.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="showAboutModal">
            <ion-icon slot="icon-only" :icon="informationCircleOutline"></ion-icon>
          </ion-button>
          <FloatingBadge :value="shareRequestCount" v-if="hasShareRequest">
            <ion-button fill="clear" @click="showRequestModal">
              <ion-icon slot="icon-only" :icon="peopleOutline"></ion-icon>
            </ion-button>
          </FloatingBadge>
          <ion-button fill="clear" @click="logOutCurrentUser">
            <span class="ion-hide-sm-down">{{ t('global.logout') }}</span>
            <ion-icon :icon="logOutOutline" :slot="isSmallScreen ? 'end' : 'icon-only'"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('pages.lists.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item v-for="list in lists" :key="list.id" @click="openList(list)" button>
          <ion-text>{{ list.name }}</ion-text>
          <ion-icon slot="end" :icon="peopleOutline" v-if="list.isSharedWithCurrentUser"></ion-icon>
        </ion-item>

        <NewItemForm @form-submit="handleNewListSubmit" text="lists.addNewList"/>
      </ion-list>
    </ion-content>
  </BasePageTemplate>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import {computed} from 'vue';
import {useStore} from "vuex";
import {List} from "@/models/dtos/List";
import {useRouter} from "vue-router";
import NewItemForm from "@/components/NewItemForm.vue";
import {signOut} from "firebase/auth"
import {arrowForwardOutline, informationCircleOutline, logOutOutline, peopleOutline} from 'ionicons/icons';
import {useI18n} from "vue-i18n";
import {Container} from "@/utils/Container";
import useListService from "@/composable/use-list-service";
import useShareRequests from "@/composable/use-share-requests";
import FloatingBadge from "@/components/FloatingBadge";
import {useMediaQuery} from "@vueuse/core";
import ShareRequestModal from "@/components/modal/ShareRequestModal";
import useLists from "@/composable/use-lists";
import AboutModal from "@/components/modal/AboutModal.vue";
import BasePageTemplate from "@/components/template/BasePageTemplate.vue";

export default {
  name: 'ListsIndex',
  components: {
    BasePageTemplate,
    FloatingBadge,
    NewItemForm,
    IonContent,
    IonHeader,
    IonList,
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
    const { addList } = useListService();
    const { removeAllLists } = useLists();
    const { shareRequests, emptyShareRequest } = useShareRequests();

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
      const auth = Container.get('FirebaseAuthService').auth;

      dto.originalAuthor = auth.currentUser.uid;

      await addList(dto);
    }

    const logOutCurrentUser = async () => {
      const auth = Container.get('FirebaseAuthService').auth;

      await Promise.all([removeAllLists(), emptyShareRequest()]);

      await signOut(auth)
    }

    const hasShareRequest = computed(() => !!shareRequests.value.length )
    const shareRequestCount = computed(() => shareRequests.value.length )

    const isSmallScreen = useMediaQuery('(min-width: 576px)')

    const showRequestModal = async () => {
      const modal = await modalController.create({
        component: ShareRequestModal
      })

      await modal.present();
    }

    const showAboutModal = async () => {
      const modal = await modalController.create({
        component: AboutModal
      })

      await modal.present();
    }
    return {
      t,
      arrowForwardOutline,
      informationCircleOutline,
      logOutOutline,
      peopleOutline,
      lists,
      hasShareRequest,
      shareRequestCount,
      showRequestModal,
      openList,
      showAboutModal,
      isSmallScreen,
      logOutCurrentUser,
      handleNewListSubmit
    }
  }
}
</script>
