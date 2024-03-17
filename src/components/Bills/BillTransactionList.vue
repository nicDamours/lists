<template>
  <div class="o-bill-transactions-list">
    <ion-list>
      <BillTransactionListItem v-for="transaction in transactions" :key="transaction.id" :transaction="transaction"/>
      <PaginationTrigger v-if="shouldShowPaginationTrigger" @page-change="$emit('page-change')"/>
    </ion-list>
  </div>
</template>

<script>
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import BillTransactionListItem from "@/components/Bills/BillTransactionListItem.vue";
import {IonList} from "@ionic/vue";
import {computed, toRefs} from "vue";
import PaginationTrigger from "@/components/PaginationTrigger.vue";

export default {
  name: "BillTransactionList",
  components: {BillTransactionListItem, IonList, PaginationTrigger},
  props: {
    transactions: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(val => val instanceof BillTransaction)
      }
    }
  },
  emits: ["page-change"],
  setup(props) {
    const {transactions} = toRefs(props);
    const givenPaginationThreshold = 30;


    const shouldShowPaginationTrigger = computed(() => {
      return transactions.value.length >= givenPaginationThreshold;
    })
    return {
      shouldShowPaginationTrigger
    };
  }
};
</script>
