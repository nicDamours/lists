<template>
  <div class="o-bill-balances-summary">

    <ion-text :class="balanceTextClass" class="o-bill-balances-summary__text">
      <h1>{{ balanceText }}</h1>
    </ion-text>
  </div>
</template>

<script>
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import {computed, toRefs} from "vue";
import BillUtils from "@/utils/Bill/BillUtils";
import {useI18n} from "vue-i18n";
import {IonText} from "@ionic/vue";

export default {
  name: "BillBalanceSummary",
  components: {
    IonText,
  },
  props: {
    balances: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(val => val instanceof BillParticipantBalance)
      }
    }
  },
  setup(props) {
    const {balances} = toRefs(props);
    const {t} = useI18n();

    const balancesAmount = computed(() => {
      return BillUtils.getAmountForBalances(balances.value);
    })

    const balanceText = computed(() => {
      if (balances.value.length === 0 || balancesAmount.value === 0) {
        return t("billBalancesSummary.settledUp");
      }

      return balancesAmount.value
    })

    const balanceTextClass = computed(() => {
      if (balancesAmount.value > 0) {
        return "--positive"
      }

      if (balancesAmount.value < 0) {
        return "--negative";
      }

      return "--neutral";
    })

    return {
      balanceText,
      balanceTextClass
    };
  }
}
</script>
