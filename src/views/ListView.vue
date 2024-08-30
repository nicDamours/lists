<template>
  <ion-page v-if="list">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title size="large">{{ list.name }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/lists"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="showShareInfoModal" v-if="list.isSharedWithCurrentUser && !isReorderActive">
            <ion-icon :icon="peopleOutline" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="openPopover" v-if="!isReorderActive">
            <ion-icon :icon="settingsOutline" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button @click="disableReorder" v-if="isReorderActive">
            <ion-icon :icon="checkmarkOutline" slot="icon-only"></ion-icon>
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

      <ion-list>
        <ion-reorder-group :disabled="!isReorderActive" @ionItemReorder="handleReorder($event)">
          <template v-for="(section, sectionIndex) in list.sections" :key="section.id">
            <ion-list-header v-if="!section.isDefault" data-reorder-before="false" lines="full">
              <ion-label>{{ section.name }}</ion-label>
              <ion-button color="danger" @click="deleteSection(section.id)">
                <ion-icon :icon="removeOutline" slot="icon-only"></ion-icon>
              </ion-button>
            </ion-list-header>
            <ion-item-sliding v-for="(item, itemIndex) in section.items" :key="item.id" class="o-list__item">
              <ion-item-options side="start" @ionSwipe="deleteItemWithoutConfirm(sectionIndex, item.id)">
                <ion-item-option color="danger" expandable @click="deleteItem(sectionIndex, item.id)">
                  {{ t('global.remove') }}
                  <ion-icon :icon="trashOutline" slot="end"></ion-icon>
                </ion-item-option>
              </ion-item-options>


              <form v-if="item.editing" @submit.prevent="() => handleEditingSaveClick(item, itemIndex, sectionIndex)">
                <ion-item class="o-form__group-input"
                          @blur.capture="(event) => handleItemBlur(item, event)">
                  <ion-input :ref="el => refs[item.id] = el" v-model="item.name" type="text"/>
                  <ion-button slot="end" class="o-form__update-save-button" color="success" fill="clear" type="submit">
                    {{ t("global.save") }}
                    <ion-icon slot="end" :icon="checkmarkOutline"></ion-icon>
                  </ion-button>
                </ion-item>
              </form>
              <ion-item button detail="false"
                        v-long-press="handleItemLongPress"
                        @click.self="toggleUsingItem(sectionIndex, itemIndex, !item.done, $event)"
                        v-if="!item.editing">
                <ion-reorder slot="start"/>
                <ion-text :class="{'--strike-through': item.done}" @click.self="toggleItem(item)">{{
                    item.name
                  }}
                </ion-text>
                <ion-text class="o-list__item__quantity"
                          @click="event => showQuantityChange(sectionIndex, itemIndex, event)"> x {{ item.quantity }}
                </ion-text>
                <ion-checkbox :checked="item.done" slot="end"/>
              </ion-item>
            </ion-item-sliding>
            <NewItemForm :ref="el => sectionElementRef[sectionIndex] = el"
                         :data-test-id="`new-item-form-${sectionIndex}`"
                         text="items.addNewItem" @form-submit="value => createNewItem(sectionIndex, value)"/>
          </template>
        </ion-reorder-group>
      </ion-list>
      <ion-list>
        <NewItemForm ref="newSectionFormRef" data-test-id="new-section-form" text="sections.addNewSection"
                     @form-submit="createNewSection"/>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import {computed, nextTick, ref} from "vue";
import {
  addOutline,
  checkmarkOutline,
  peopleOutline,
  removeOutline,
  settingsOutline,
  trashOutline
} from 'ionicons/icons';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonText,
  IonTitle,
  IonToolbar,
  popoverController
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
import ListOptionsPopOver from "@/components/ListOptionsPopOver";
import SharedListOptionsPopOver from "@/components/SharedListOptionsPopOver";
import useReorderItems from "@/composable/use-reorder-items";

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
    IonReorder,
    IonReorderGroup,
  },
  setup() {
    const route = useRoute();
    const store = useStore()
    const {t} = useI18n();
    const refs = ref({});
    const {updateList} = useListService();

    const currentListId = computed(() => route.params.id)

    const {showNumberAlert, showInfoAlert} = useAlert();
    const {showConfirm} = useConfirm();
    const {defineInputFocus} = useInputFocus(refs);
    const isReorderActive = ref(false);

    const newSectionFormRef = ref(null)
    const currentlyFocusElementRef = ref(null);
    const sectionElementRef = ref([])

    const newSectionName = ref("");

    const list = computed(() => store.getters['lists/getListById'](currentListId.value));

    const {reorderItemsInList} = useReorderItems(list);


    const parseValue = (value) => {
      const regexp = /(.+)\s+[xX*]\s*(\d+)/
      const matches = value.match(regexp);

      if (!matches || matches.length === 0) {
        return [value, 1]
      }

      return [matches[1], parseInt(matches[2])];
    }

    const defocusCurrentForm = () => {
      if (currentlyFocusElementRef.value) {
        currentlyFocusElementRef.value.defocus();
      }

      if (newSectionFormRef.value) {
        newSectionFormRef.value.defocus();
      }
    }

    const focusSectionNewItemForm = (sectionIndex) => {
      defocusCurrentForm();

      if (sectionElementRef.value.length >= sectionIndex + 1) {
        sectionElementRef.value[sectionIndex].focus()

        currentlyFocusElementRef.value = sectionElementRef.value[sectionIndex];
      }
    }

    const toggleItemDone = async (sectionIndex, itemIndex, value, $event) => {
      const target = $event.target;
      if (!target.classList.contains("o-list__item__quantity")) {
        const copiedList = list.value.clone();
        copiedList.sections[sectionIndex].items[itemIndex].done = value;

        await updateList(copiedList)
      }
    }

    const createNewItem = async (sectionIndex, value) => {
      const [name, quantity] = parseValue(value);

      const newItem = new Item(UUID.uuidv4(), name);
      newItem.quantity = quantity;

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

      await nextTick();

      focusSectionNewItemForm(copiedList.sections.length - 1);
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
        await deleteItemWithoutConfirm(sectionIndex, itemId)
      }
    }

    const deleteItemWithoutConfirm = async (sectionIndex, itemId) => {
      const copiedList = list.value.clone();
      copiedList.sections[sectionIndex].items = copiedList.sections[sectionIndex].items.filter(item => item.id !== itemId);

      await updateList(copiedList);
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
      if (event.relatedTarget && !event.relatedTarget.classList.contains('o-form__update-save-button')) {
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

    const openPopover = async (ev) => {
      const popoverComponent = list.value.isSharedWithCurrentUser ? SharedListOptionsPopOver : ListOptionsPopOver
      const popover = await popoverController
          .create({
            component: popoverComponent,
            componentProps: {
              list: list.value
            },
            cssClass: 'my-custom-class',
            event: ev,
            translucent: true
          })
      await popover.present();

      await popover.onDidDismiss();
    }

    const showShareInfoModal = async () => {
      await showInfoAlert(t('modals.shareInfo.message', {
        author: list.value.originalAuthorEmail
      }), t('modals.shareInfo.title'))
    }
    const toggleUsingItem = async (sectionIndex, itemIndex, done, event) => {
      if (!isReorderActive.value) {
        await toggleItemDone(sectionIndex, itemIndex, done, event)
      }
    }

    const handleItemLongPress = () => {
      isReorderActive.value = true;
    }

    const disableReorder = () => {
      isReorderActive.value = false;
    }

    const saveUpdatedList = async (newIndex, oldIndex) => {
      const updatedList = reorderItemsInList(newIndex, oldIndex);

      if (updatedList !== null) {
        await updateList(updatedList);
      }
    }

    const handleReorder = async (event) => {
      const changingIndex = event.detail.to;

      const reorderGroupChildren = event.target.querySelectorAll('ion-item, ion-list-header');

      let shouldCompleteReorder = true;

      const replacedWithItem = reorderGroupChildren[changingIndex];

      const changeDirection = event.detail.to < event.detail.from ? 'reorderBefore' : 'reorderAfter';

      if (changeDirection in replacedWithItem.dataset && replacedWithItem.dataset[changeDirection] === 'false') {
        shouldCompleteReorder = false;
      }

      if (shouldCompleteReorder) {
        event.detail.complete(true);
        await saveUpdatedList(event.detail.to, event.detail.from);
      } else {
        event.detail.complete(false);
      }
    }

    return {
      t,
      toggleUsingItem,
      addOutline,
      removeOutline,
      trashOutline,
      checkmarkOutline,
      settingsOutline,
      peopleOutline,
      list,
      refs,
      openPopover,
      toggleItem,
      deleteItem,
      deleteSection,
      createNewItem,
      newSectionName,
      handleItemBlur,
      toggleItemDone,
      disableReorder,
      createNewSection,
      isReorderActive,
      showShareInfoModal,
      showQuantityChange,
      handleItemLongPress,
      handleReorder,
      sectionElementRef,
      newSectionFormRef,
      handleEditingSaveClick,
      deleteItemWithoutConfirm
    }
  }
}
</script>
