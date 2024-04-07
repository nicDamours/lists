<template>
  <ion-item>
    <font-awesome-icon slot="start" :icon="['fal', 'divide']"
                       class="o-bill-transaction-split-type-selector__icon fa-lg"/>
    <ion-select v-model="splitTypeModel">
      <ion-select-option v-for="option in billSplitTypeOptions" :key="option.value" :value="option.value">
        {{ option.text }}
      </ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script>
import {IonItem, IonSelect, IonSelectOption} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {computed, toRefs} from "vue";
import {BillSplitType} from "@/models/enums/BillSplitType";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import useCurrentUser from "@/composable/use-current-user";
import useBillsGroups from "@/composable/bills/use-bills-groups";

export default {
  name: "BillTransactionSplitTypeSelector",
  components: {
    IonItem,
    FontAwesomeIcon,
    IonSelect,
    IonSelectOption,
  },
  props: {
    splitType: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(BillSplitType).includes(value)
      }
    },
    payer: {
      type: [BillParticipant],
      required: true,
    }
  },
  emits: ["update:splitType", "update:payer"],
  setup(props, {emit}) {
    const {t} = useI18n();

    const {splitType} = toRefs(props);

    const {currentUser} = useCurrentUser();
    const {currentGroup} = useBillsGroups();


    const splitTypeModel = computed({
      get() {
        return splitType.value
      },
      set(value) {
        const payer = getPayerForValue(value)
        console.log('payer', payer);

        emit("update:splitType", value);
        emit("update:payer", payer)
      }
    })

    const otherParticipant = computed(() => {
      return currentGroup.value.participants.filter(participant => participant.uid !== currentUser.value.uid)[0];
    })

    const currentParticipant = computed(() => {
      return currentGroup.value.participants.filter(participant => participant.uid === currentUser.value.uid)[0];
    })

    const billSplitTypeOptions = computed(() => {
      return [BillSplitType.PAID_BY_YOU_SPLIT_EQUALS, BillSplitType.PAID_BY_OTHER_SPLIT_EQUALS, BillSplitType.FULLY_OWED, BillSplitType.OWE_FULLY].map(val => {
        return {
          value: val,
          text: t(`billSplitType.${val}`, {
            name: otherParticipant.value.display_name
          })
        }
      })
    })

    const getPayerForValue = (value) => {
      switch (value) {
        case BillSplitType.PAID_BY_OTHER_SPLIT_EQUALS:
        case BillSplitType.OWE_FULLY:
          return otherParticipant.value;
        case BillSplitType.PAID_BY_YOU_SPLIT_EQUALS:
        case BillSplitType.FULLY_OWED:
          return currentParticipant.value
        default:
          return currentParticipant.value;
      }
    }
    return {
      t,
      splitTypeModel,
      billSplitTypeOptions
    };
  }
};
</script>
