<template>
  <ion-content>
    <ion-list>
      <ion-item button @click="handleEmptyList">
        <ion-text color="danger">{{ t('global.empty') }}</ion-text>
        <ion-icon :icon="closeCircleOutline" slot="start" color="danger"></ion-icon>
      </ion-item>
      <ion-item button @click="handleDeleteList">
        <ion-text color="danger">{{ t('global.delete') }}</ion-text>
        <ion-icon :icon="trashOutline" slot="start" color="danger"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script>
import {closeCircleOutline, settingsOutline, trashOutline} from 'ionicons/icons';
import {IonContent, IonIcon, IonItem, IonList, IonText, popoverController} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import {toRefs} from "vue";
import useConfirm from "@/composable/use-confirm";
import useListService from "@/composable/use-list-service";
import {useRouter} from "vue-router";
import {List} from "@/models/dtos/List";

export default {
  name: "ListOptionsPopOver",
  components: {IonIcon, IonContent, IonList, IonItem, IonText},
  props: {
    list: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof List
      }
    }
  },
  setup(props) {
    const {list} = toRefs(props);
    const {t} = useI18n();
    const {showConfirm, showConfirmWithInput} = useConfirm();
    const router = useRouter();
    const {deleteList, updateList} = useListService();

    const handleDeleteList = async () => {
      const results = await showConfirm(t("lists.confirmDeleteList"));

      if (results) {

        await deleteList(list.value);

        await router.push({name: "Home"})
      }
    }

    const handleEmptyList = async () => {
      let keepEmptyLists = true;
      const results = await showConfirmWithInput(t("lists.confirmEmptyList"), [
        {
          type: 'checkbox',
          label: t('lists.keepSections'),
          value: 'keepEmptyLists',
          handler: function (value) {
            keepEmptyLists = value.checked;
          },
          checked: true,
        },
      ]);

      if (results) {
        const clonedList = list.value.clone();
        if(keepEmptyLists) {
          clonedList.sections.forEach(section => {
            section.items = [];
          })
        } else {
          clonedList.sections = [];
        }

        await updateList(clonedList);

        await popoverController.dismiss();
      }
    }

    return {
      t,
      handleEmptyList,
      trashOutline,
      settingsOutline,
      closeCircleOutline,
      handleDeleteList
    }
  }
}
</script>

<style scoped>

</style>
