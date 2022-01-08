<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Lists" href="/tabs/lists">
          <ion-icon :icon="listOutline" />
          <ion-label>{{ t('tabs.lists') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Week" href="/tabs/week">
          <ion-icon :icon="calendarOutline" />
          <ion-label>{{ t('tabs.week') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import {IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from "@ionic/vue";
import { listOutline, calendarOutline } from 'ionicons/icons';
import {useI18n} from "vue-i18n";

export default {
  name: "HomeView",
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet },
  setup() {
    const { t } = useI18n();

    return {
      t,
      listOutline,
      calendarOutline
    }
  }
}
</script>
