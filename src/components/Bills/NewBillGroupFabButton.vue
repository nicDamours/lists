<template>
  <ion-fab slot="fixed" horizontal="end" vertical="bottom">
    <ion-fab-button @click="newGroupButtonClick">
      <ion-icon :icon="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import {add} from "ionicons/icons";
import {IonFab, IonFabButton, IonIcon} from "@ionic/vue";
import useConfirm from "@/composable/use-confirm";
import {useI18n} from "vue-i18n";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import useAuthentication from "@/composable/use-authentication";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

export default {
  name: "NewBillGroupFabButton",
  components: {
    IonIcon,
    IonFab,
    IonFabButton,
  },
  emits: ["create-group"],
  setup(_, {emit}) {
    const {t} = useI18n();
    const {showConfirmWithInput} = useConfirm();
    const {currentUser} = useAuthentication();
    const newGroupButtonClick = async () => {
      let newGroupName = "";
      const response = await showConfirmWithInput(t("billGroups.newPrompt.namePrompt"), [
        {
          type: 'text',
          label: t('billGroups.newPrompt.placeholder'),
          value: '',
          tabindex: 1,
          handler: function (value) {
            newGroupName = value.value;
          },
        },
      ]);

      if (!response) {
        return;
      }

      const newGroup = new BillGroup(null);
      newGroup.name = newGroupName;
      newGroup.participants = [new BillParticipant(currentUser.value.id, currentUser.value.email)]

      emit("create-group", newGroup)
    }


    return {
      add,
      newGroupButtonClick
    }
  }
}
</script>
