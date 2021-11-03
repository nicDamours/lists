<template>
  <ion-item button @click="handleEmptyList">
    <ion-text color="danger">{{ t('global.empty') }}</ion-text>
    <ion-icon :icon="closeCircleOutline" slot="start" color="danger"></ion-icon>
  </ion-item>
</template>

<script>
import {IonIcon, IonItem, IonText, popoverController} from "@ionic/vue";
import {closeCircleOutline} from "ionicons/icons";
import {useI18n} from "vue-i18n";
import useConfirm from "../composable/use-confirm";
import useListService from "../composable/use-list-service";
import {List} from "../models/dtos/List";
import {toRefs} from "vue";

export default {
  name: "ListOptionsEmpty",
  components: { IonItem, IonText, IonIcon },
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
    const { t } = useI18n();

    const  { list } = toRefs(props);

    const { showConfirmWithInput } = useConfirm();

    const  { updateList } = useListService();

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
      closeCircleOutline
    }
  }
}
</script>

<style scoped>

</style>
