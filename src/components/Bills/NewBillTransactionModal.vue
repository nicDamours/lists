<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button color="medium" @click="cancel">{{ t('global.cancel') }}</ion-button>
      </ion-buttons>
      <ion-title>{{ t('newBillTransaction.addTransaction') }}</ion-title>
      <ion-buttons slot="end">
        <ion-button :strong="true" @click="confirm">{{ t('global.confirm') }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-item>
        <ion-input v-model="model.description" :placeholder="t('newBillTransaction.enterADescription')">
          <div slot="label">
            <ion-icon slot="start" :icon="list" aria-hidden="true"/>
          </div>
        </ion-input>
      </ion-item>
      <ion-item>
        <ion-input v-model="model.amount" placeholder="0.00" step="1.00" type="number">
          <div slot="label">
            <ion-icon slot="start" :icon="logoUsd" aria-hidden="true"/>
          </div>
        </ion-input>
      </ion-item>
      <ion-item>
        <ion-icon slot="start" :icon="calendar" aria-hidden="true"/>
        <ion-datetime-button v-model="dateTimePickerModel" :locale="dateTimePickerLocal" datetime="datetime"
                             presentation="date"/>

        <ion-modal :keep-contents-mounted="true">
          <ion-datetime id="datetime" v-model="dateTimePickerModel" :locale="dateTimePickerLocal" presentation="date"/>
        </ion-modal>
      </ion-item>
      <BillTransactionSplitTypeSelector v-model:payer="model.payer" v-model:splitType="model.splitType"/>
    </ion-list>
  </ion-content>
</template>

<script>
import {computed, ref} from "vue";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  modalController
} from "@ionic/vue";
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {useI18n} from "vue-i18n";
import {calendar, list, logoUsd} from "ionicons/icons";
import {formatISO, parseISO} from "date-fns";
import useLocale from "@/composable/use-locale";
import BillTransactionSplitTypeSelector from "@/components/Bills/BillTransactionSplitTypeSelector.vue";

export default {
  name: "NewBillTransactionModal",
  components: {
    IonHeader,
    IonButtons,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonList,
    IonDatetimeButton,
    IonDatetime,
    IonToolbar,
    IonModal,
    BillTransactionSplitTypeSelector
  },
  setup() {
    const {t} = useI18n();

    const {preferredLocale} = useLocale();

    const model = ref(new BillTransaction("irrelevent"));

    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => modalController.dismiss(model.value, 'confirm');

    const dateTimePickerModel = computed({
      get() {
        return formatISO(model.value.date);
      },
      set(value) {
        model.value.date = parseISO(value);
      }
    })

    const dateTimePickerLocal = computed(() => {
      return preferredLocale.value === "en" ? "en-US" : "fr-CA"
    })

    return {
      t,
      model,
      list,
      logoUsd,
      calendar,
      cancel,
      confirm,
      dateTimePickerModel,
      dateTimePickerLocal
    };
  }
};
</script>
