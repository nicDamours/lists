<template>
  <BasePageTemplate class="v-bill-group-view">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title v-if="currentGroup"> {{ currentGroup.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title v-if="currentGroup" size="large">{{ currentGroup.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="v-bill-group-view__content ion-text-sm-capitalize">
        <BillBalanceSummary :balances="currentParticipantBalances"/>
        <BillTransactionList :transactions="currentGroupTransactions" @page-change="handlePageChange"/>
      </div>
      <NewBillTransactionFabButton @save="handleNewBillTransactionSave"/>
    </ion-content>
  </BasePageTemplate>
</template>

<script>
import {useI18n} from "vue-i18n";
import useBillsGroups from "@/composable/bills/use-bills-groups";
import {computed} from "vue";
import BasePageTemplate from "@/components/template/BasePageTemplate.vue";
import {IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/vue";
import BillBalanceSummary from "@/components/Bills/BillBalanceSummary.vue";
import useAuthentication from "@/composable/use-authentication";
import BillTransactionList from "@/components/Bills/BillTransactionList.vue";
import NewBillTransactionFabButton from "@/components/Bills/NewBillTransactionFabButton.vue";
import useBillTransactions from "@/composable/bills/use-bill-transactions";

export default {
  name: "BillGroupView",
  components: {
    NewBillTransactionFabButton,
    BasePageTemplate,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    BillTransactionList,
    BillBalanceSummary
  },
  setup() {
    const {t} = useI18n();

    const {currentGroup, fetchTransactions} = useBillsGroups();
    const {createTransaction} = useBillTransactions();
    const {currentUser} = useAuthentication();

    const currentParticipantBalances = computed(() => {
      if (!currentGroup.value) {
        return [];
      }

      return currentGroup.value.getBalanceObjectsForParticipant(currentUser.value.uid)
    })

    const currentGroupTransactions = computed(() => {
      if (!currentGroup.value) {
        return []
      }

      return currentGroup.value.transactions;
    })

    const handlePageChange = async () => {
      await fetchTransactions();
    }

    const handleNewBillTransactionSave = async (newBillTransaction) => {
      await createTransaction(currentGroup.value, newBillTransaction)
    }

    return {
      t,
      currentGroup,
      handlePageChange,
      currentGroupTransactions,
      currentParticipantBalances,
      handleNewBillTransactionSave
    }
  }
}
</script>
