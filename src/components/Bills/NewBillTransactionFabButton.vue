<template>
  <div class="o-new-bill-transaction-button">
    <ion-fab horizontal="end" vertical="bottom">
      <ion-fab-button @click="openModal">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </div>
</template>

<script>
import {IonFab, IonFabButton, IonIcon, modalController} from "@ionic/vue";
import {add} from "ionicons/icons";
import NewBillTransactionModal from "@/components/Bills/NewBillTransactionModal.vue";

export default {
  name: "NewBillTransactionFabButton",
  components: {IonIcon, IonFab, IonFabButton},
  emits: ["save"],
  setup(_, {emit}) {
    const openModal = async () => {
      const modal = await modalController.create({
        component: NewBillTransactionModal,
      });

      await modal.present();

      const {data, role} = await modal.onWillDismiss();

      if (role === 'confirm') {
        emit('save', data);
      }
    }
    return {
      add,
      openModal
    };
  }
};
</script>
