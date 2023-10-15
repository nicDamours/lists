<template>
  <ShareWithUserModal :title="t('shareWithUserModal.title')" @submit-click="handleSubmitClick">
    <template #default="{emailInput, updateEmailInput}">
      <ShareWithUserList :list="list"/>
      <ShareWithUserForm :header-text="t('shareWithUserModal.form.headerText')" :model-value="emailInput"
                         v-model:errors="errors"
                         @update:modelValue="updateEmailInput"/>
    </template>
  </ShareWithUserModal>
</template>

<script>
import ShareWithUserModal from "@/components/modal/ShareWithUserModal/ShareWithUserModal.vue";
import {computed, ref} from "vue";
import {toRefs} from "@vueuse/core";
import useLists from "@/composable/use-lists";
import ShareWithUserForm from "@/components/modal/ShareWithUserModal/ShareWithUserForm.vue";
import ShareWithUserList from "@/components/modal/ShareWithUserModal/ShareWithUserList.vue";
import {modalController} from "@ionic/vue";
import {useI18n} from "vue-i18n";

export default {
  name: "ShareListWithUserModal",
  components: {ShareWithUserModal, ShareWithUserList, ShareWithUserForm},
  props: {
    listId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const {t} = useI18n();
    const {listId} = toRefs(props);
    const {getListById} = useLists();
    const errors = ref([]);

    const list = computed(() => getListById(listId.value));

    const handleSubmitClick = emailInput => {
      modalController.dismiss(emailInput);
    }

    return {
      t,
      list,
      errors,
      handleSubmitClick
    }
  }
}
</script>
