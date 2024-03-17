<template>
  <BasePageTemplate class="v-bill-group-view">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title v-if="currentGroup"> {{ currentGroup.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title v-if="currentGroup" size="large">{{ currentGroup.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="v-bill-group-view__content ion-text-sm-capitalize">
        <BillBalanceSummary :balances="currentParticipantBalances"/>
        <BillTransactionList :transactions="currentGroupTransactions" @page-change="handlePageChange"/>
      </div>
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
import BillBalanceSummary from "@/components/Bills/BillBalanceSummary.vue";
import useAuthentication from "@/composable/use-authentication";
import BillTransactionList from "@/components/Bills/BillTransactionList.vue";

export default {
  name: "BillGroupView",
  components: {
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
    const route = useRoute();

    const {getGroupById, fetchTransactions} = useBillsGroups();
    const {currentUser} = useAuthentication();

    const currentGroup = computed(() => {
      return getGroupById(route.params.id)
    })

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

    return {
      t,
      currentGroup,
      handlePageChange,
      currentGroupTransactions,
      currentParticipantBalances
    }
  }
}
</script>
