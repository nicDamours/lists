<template>
  <ion-item>
    <div class="transaction-date">
      {{ formattedTransactionDate }}
    </div>
    <div class="transaction-description">
      {{ transaction.description }}
    </div>
  </ion-item>
</template>

<script>
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {IonItem} from "@ionic/vue";
import {computed, toRefs} from "vue";
import {format} from "date-fns";

export default {
  name: "BillTransactionListItem",
  components: {IonItem},
  props: {
    transaction: {
      type: BillTransaction,
      required: true
    }
  },
  setup(props) {
    const {transaction} = toRefs(props);

    const formattedTransactionDate = computed(() => {
      return format(transaction.value.date, 'MMM d');
    })

    return {
      formattedTransactionDate
    };
  }
};
</script>
