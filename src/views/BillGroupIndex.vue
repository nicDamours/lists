<template>
  <BasePageTemplate>
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
                       @click="() => handleGroupClick(billGroup)" @delete="() => handleGroupDelete(billGroup)"/>
        <ion-item v-if="!billGroups.length" class="v-bill-group-index__empty">
          <ion-text class="v-bill-group-index__empty-text">{{ t('billGroups.empty') }}</ion-text>
        </ion-item>
      </ion-list>
    </ion-content>
    <NewBillGroupFabButton @create-group="handleGroupCreate"/>
  </BasePageTemplate>
</template>

<script>
import {IonContent, IonHeader, IonItem, IonList, IonText, IonTitle, IonToolbar} from "@ionic/vue";
import BillGroupItem from "@/components/Bills/BillGroupItem.vue";
import {useI18n} from "vue-i18n";
import useBillsGroups from "@/composable/bills/use-bills-groups";
import {useRouter} from "vue-router";
import useConfirm from "@/composable/use-confirm";
import NewBillGroupFabButton from "@/components/Bills/NewBillGroupFabButton.vue";
import BasePageTemplate from "@/components/template/BasePageTemplate.vue";

export default {
  name: "BillGroupIndex",
  components: {
    BasePageTemplate,
    IonContent,
    IonHeader,
    IonList,
    IonTitle,
    IonItem,
    IonText,
    IonToolbar,
    BillGroupItem,
    NewBillGroupFabButton
  },
  setup() {
    const {t} = useI18n();
    const router = useRouter();

    const {billGroups, createGroup, deleteGroup} = useBillsGroups();

    console.log('billGroups', billGroups.value);
    const {showConfirm} = useConfirm();

    const handleGroupClick = async (bill) => {
      await router.push({
        name: "BillGroupView",
        params: {
          id: bill.id
        }
      })
    }

    const handleGroupCreate = async newGroup => {
      await createGroup(newGroup)
    }

    const handleGroupDelete = async (group) => {
      const confirmResponse = await showConfirm(t("billGroups.deleteConfirm"));

      if (confirmResponse) {
        await deleteGroup(group);
      }
    }

    return {t, billGroups, handleGroupClick, handleGroupCreate, handleGroupDelete}
  }
}
</script>
