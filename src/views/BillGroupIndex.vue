<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title> {{ t('pages.bills.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ t('pages.bills.title') }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <BillGroupItem v-for="billGroup in billGroups" :key="billGroup.id" :group="billGroup"
                       @click="openBillGroup(billGroup)"/>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {ref} from "vue";
import {IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import BillGroupItem from "@/components/Bills/BillGroupItem.vue";
import {useI18n} from "vue-i18n";

export default {
  name: "BillGroupIndex",
  components: {
    IonContent,
    IonHeader,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    BillGroupItem
  },
  setup() {
    const {t} = useI18n();

    const testBill = new BillGroup("irrelevent");
    testBill.name = "test bill group";

    const billGroups = ref([
      testBill
    ])

    const openBillGroup = (bill) => {
      console.log(bill)
    }

    return {t, billGroups, openBillGroup}
  }
}
</script>
