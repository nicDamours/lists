<template>
  <ion-item>
    <ion-text>{{ group.name }}</ion-text>
    <ion-text slot="end" :class="balanceClass" class="m-group-item__balance">{{ formattedBalance }}</ion-text>
  </ion-item>
</template>

<script>
import {IonItem, IonText} from "@ionic/vue";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {computed, toRefs} from "vue";
import useAuthentication from "@/composable/use-authentication";

export default {
  name: "BillGroupItem",
  components: {
    IonItem,
    IonText
  },
  props: {
    group: {
      type: BillGroup,
      required: true
    }
  },
  setup(props) {
    const {group} = toRefs(props);
    const {currentUser} = useAuthentication();

    console.log(currentUser.value);

    const groupBalance = computed(() => {
      return group.value.getBalanceForParticipant(currentUser.value.id);
    })

    const balanceClass = computed(() => {
      if (groupBalance.value === 0) {
        return 'neutral'
      }
      return groupBalance.value > 0 ? 'positive' : 'negative'
    })

    const formattedBalance = computed(() => {
      return Intl.NumberFormat("fr-CA", {style: 'currency', currency: 'cad'}).format(groupBalance.value)
    })

    return {
      balanceClass,
      formattedBalance
    }
  }
}
</script>
