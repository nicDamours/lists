<template>
  <ion-page v-if="list">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">{{ list.name }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/lists"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="handleDeleteList" color="danger">
            {{ t('global.delete') }}
            <ion-icon :icon="trashOutline" slot="end"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ list.name }}</ion-title>
          <ion-buttons slot="end">

          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-list v-for="(section, sectionIndex) in list.sections" :key="section.id">
        <ion-list-header lines="full">
            <ion-label>{{ section.name }}</ion-label>
            <ion-button color="danger" @click="deleteSection(section.id)">
              <ion-icon :icon="removeOutline" slot="icon-only"></ion-icon>
            </ion-button>
        </ion-list-header>

        <ion-item-sliding v-for="(item, itemIndex) in section.items" :key="item.id" class="o-list__item">
          <ion-item-options side="start">
            <ion-item-option @click="deleteItem(sectionIndex, item.id)" color="danger">
              {{ t('global.remove') }}
              <ion-icon :icon="trashOutline" slot="end"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item class="o-form__group-input" v-if="item.editing" @blur.capture="(event) => handleItemBlur(item, event)">
              <ion-input type="text" v-model="item.name" :ref="el => refs[item.id] = el"/>

              <ion-button slot="end" color="success" fill="clear" class="o-form__update-save-button" @click="() => handleEditingSaveClick(item, itemIndex, sectionIndex)">
                {{ t("global.save") }}
                <ion-icon :icon="checkmarkOutline" slot="end"></ion-icon>
              </ion-button>
          </ion-item>
          <ion-item button detail="false" @click.self="event => toggleItemDone(sectionIndex, itemIndex, !item.done, event)" v-if="!item.editing">
            <ion-text @click.self="toggleItem(item)">{{ item.name }}</ion-text>
            <ion-text class="o-list__item__quantity"
                      @click="event => showQuantityChange(sectionIndex, itemIndex, event)"> x {{ item.quantity }}
            </ion-text>
            <ion-checkbox :checked="item.done" slot="end"/>
          </ion-item>
        </ion-item-sliding>
        <NewItemForm @form-submit="value => createNewItem(sectionIndex, value)" text="items.addNewItem"/>
      </ion-list>

      <ion-list>
        <NewItemForm @form-submit="createNewSection" text="sections.addNewSection"/>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {addOutline, removeOutline, trashOutline, checkmarkOutline} from 'ionicons/icons';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon, IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding, IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {Item} from "@/models/dtos/Item";
import UUID from "@/utils/UUID";
import {Section} from "@/models/dtos/Section";
import NewItemForm from "@/components/NewItemForm";
import useConfirm from "@/composable/use-confirm";
import useAlert from "@/composable/use-alerts";
import {useI18n} from "vue-i18n";
import useInputFocus from "@/composable/use-input-focus";
import useListService from "@/composable/use-list-service";

export default {
  name: "ListView",
  components: {
    IonPage,
    IonContent,
    IonList,
    IonIcon,
    IonListHeader,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonItemOption,
    IonItemOptions,
    IonText,
    IonItem,
    IonCheckbox,
    IonItemSliding,
    IonButton,
    IonInput,
    NewItemForm,
    IonBackButton,
    IonButtons,
    IonLabel,
  },
  setup() {
    const route = useRoute();
    const store = useStore()
    const router = useRouter();
    const { t } = useI18n();
    const refs = ref({});
    const { updateList, deleteList } = useListService();

    const currentListId = computed(() => route.params.id)

    const {showNumberAlert} = useAlert();
    const { showConfirm } = useConfirm();
    const { defineInputFocus } = useInputFocus(refs);

    const newSectionName = ref("");

    const list = computed(() => store.getters['lists/getListById'](currentListId.value));

    const toggleItemDone = async (sectionIndex, itemIndex, value, $event) => {
      const target = $event.target;
      if (!target.classList.contains("o-list__item__quantity")) {
        const copiedList = list.value.clone();
        copiedList.sections[sectionIndex].items[itemIndex].done = value;

        await updateList(copiedList)
      }
    }

    const createNewItem = async (sectionIndex, value) => {
      const newItem = new Item(UUID.uuidv4(), value);

      const copiedList = list.value.clone();
      copiedList.sections[sectionIndex].items.push(newItem);

      await updateList(copiedList);
    }

    const createNewSection = async (value) => {
      const newSection = new Section(UUID.uuidv4());

      newSection.name = value

      const copiedList = list.value.clone();
      copiedList.sections.push(newSection)

      await updateList(copiedList);
    }

    const deleteSection = async (sectionId) => {
      const results = await showConfirm(t("sections.confirmDeleteSection"));

      if (results) {
        const copiedList = list.value.clone();

        copiedList.sections = copiedList.sections.filter(item => item.id !== sectionId)

        await updateList(copiedList);
      }
    }

    const deleteItem = async (sectionIndex, itemId) => {
      const results = await showConfirm(t("items.confirmDeleteItem"));

      if (results) {
        const copiedList = list.value.clone();
        copiedList.sections[sectionIndex].items = copiedList.sections[sectionIndex].items.filter(item => item.id !== itemId);

        await updateList(copiedList);
      }
    }

    const handleDeleteList = async () => {
      const results = await showConfirm(t("lists.confirmDeleteList"));

      if (results) {

        await deleteList(list.value);

        await router.push({name: "Home"})
      }
    }

    const showQuantityChange = async (sectionIndex, itemIndex, event) => {
      const target = event.target
      if (target.classList.contains("o-list__item__quantity")) {
        const copiedList = list.value.clone();
        const currentItem = copiedList.sections[sectionIndex].items[itemIndex];

        const results = await showNumberAlert(t("global.enterQuantity"), currentItem.quantity);

        if (results !== false) {
          copiedList.sections[sectionIndex].items[itemIndex].quantity = results;

          await updateList(copiedList)
        }
      }
    }

    const toggleItem = async item => {
      item.editing = true;
      await defineInputFocus(item.id, true)
    }

    const handleItemBlur = async (item, event) => {
      if(event.relatedTarget && !event.relatedTarget.classList.contains('o-form__update-save-button')) {
        item.editing = false;
        await defineInputFocus(item.id, false);
      }
    }

    const handleEditingSaveClick = async (item, index, sectionIndex) => {
      const copiedList = list.value.clone();
      copiedList.sections[sectionIndex].items[index] = item;

      await updateList(copiedList)
      await defineInputFocus(item.id, false);
    }

    return {
      t,
      addOutline,
      removeOutline,
      trashOutline,
      checkmarkOutline,
      list,
      refs,
      toggleItem,
      deleteItem,
      deleteSection,
      createNewItem,
      newSectionName,
      handleItemBlur,
      toggleItemDone,
      handleDeleteList,
      createNewSection,
      showQuantityChange,
      handleEditingSaveClick
    }
  }
}
</script>
