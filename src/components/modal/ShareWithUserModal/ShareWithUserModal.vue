<template>
  <BaseModal :title="t('shareWithUserModal.title')">
    <template #default>
      <div class="o-share-with-user-model__content">
        <ShareWithUserList :list="list" />
        <ShareWithUserForm v-model="emailInput"/>
      </div>
    </template>
    <template #buttons>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="danger" slot="start" @click="() => dismiss(null)">
            {{ t('global.cancel') }}
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button color="primary" slot="end" @click="() => dismiss(emailInput)">
            {{ t('global.submit') }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from "../BaseModal";
import {useI18n} from "vue-i18n";
import {IonButton, IonButtons, IonToolbar, modalController} from "@ionic/vue";
import ShareWithUserForm from "@/components/modal/ShareWithUserModal/ShareWithUserForm";
import {computed, ref} from "vue";
import ShareWithUserList from "@/components/modal/ShareWithUserModal/ShareWithUserList";
import useLists from "@/composable/use-lists";
import {toRefs} from "@vueuse/core";

export default {
  name: "ShareWithUserModal",
  components: {ShareWithUserList, ShareWithUserForm, BaseModal, IonButton, IonToolbar, IonButtons },
  props: {
    listId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const { listId } = toRefs(props);
    const emailInput = ref("");
    const { getListById } = useLists();

    const dismiss = (value) => {
      modalController.dismiss(value);
    }

    const list = computed(() => getListById(listId.value))

    return {
      t,
      list,
      dismiss,
      emailInput
    }
  }
}
</script>
