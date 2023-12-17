<template>
  <BasePageTemplate>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ currentGroup.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ currentGroup.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

    </ion-content>
  </BasePageTemplate>
</template>

<script>
import {useI18n} from "vue-i18n";
import useBillsGroups from "@/composable/bills/use-bills-groups";
import {useRoute} from "vue-router";
import {computed} from "vue";
import BasePageTemplate from "@/components/template/BasePageTemplate.vue";
import {IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/vue";

export default {
  name: "BillGroupView",
  components: {
    BasePageTemplate,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle
  },
  setup() {
    const {t} = useI18n();
    const route = useRoute();

    const {getGroupById} = useBillsGroups();

    const currentGroup = computed(() => {
      return getGroupById(route.params.id)
    })

    return {
      t,
      currentGroup
    }
  }
}
</script>
