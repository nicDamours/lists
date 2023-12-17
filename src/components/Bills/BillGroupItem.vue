<template>
  <ion-item-sliding class="m-bill-group-item">
    <ion-item-options side="start">
      <ion-item-option color="danger" @click="$emit('delete')">{{ t("global.delete") }}</ion-item-option>
    </ion-item-options>

    <ion-item>
      <ion-text>{{ group.name }}</ion-text>
      <ion-text slot="end" :class="balanceClass" class="m-bill-group-item__balance">{{ formattedBalance }}</ion-text>
    </ion-item>
  </ion-item-sliding>
</template>

<script>
import {IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonText} from "@ionic/vue";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {computed, toRefs} from "vue";
import useAuthentication from "@/composable/use-authentication";
import {useI18n} from "vue-i18n";

export default {
  name: "BillGroupItem",
  components: {
    IonItem,
    IonText,
    IonItemSliding,
    IonItemOption,
    IonItemOptions
  },
  props: {
    group: {
      type: BillGroup,
      required: true
    }
  },
  setup(props) {
    const {t} = useI18n();
    const {group} = toRefs(props);
    const {currentUser} = useAuthentication();

    const groupBalance = computed(() => {
      if (!group.value.participants.length) {
        return null;
      }

      return group.value.getBalanceForParticipant(currentUser.value.id);
    })

    const balanceClass = computed(() => {
      if (!groupBalance.value || groupBalance.value === 0) {
        return 'neutral'
      }
      return groupBalance.value > 0 ? '--positive' : '--negative'
    })

    const formattedBalance = computed(() => {
      if (!groupBalance.value) {
        return "-"
      }

      return Intl.NumberFormat("fr-CA", {style: 'currency', currency: 'cad'}).format(groupBalance.value)
    })

    return {
      t,
      balanceClass,
      formattedBalance
    }
  }
}
</script>
