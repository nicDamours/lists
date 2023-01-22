<template>
  <ion-row v-if="hasWeekSharingUser" class="week-sharing-selector">
    <ion-col class="week-sharing-selector__cell" size-lg="2" size-md="4" size-sm="12">
      <ion-select v-model="model" interface="action-sheet">
        <ion-select-option v-for="(option, $index) in weekSharingUserOptions" :key="$index" :value="option.value">
          {{ option.label }}
        </ion-select-option>
      </ion-select>
    </ion-col>
  </ion-row>
</template>

<script>
import {useI18n} from "vue-i18n";
import {computed, toRefs} from "vue";
import {IonCol, IonRow, IonSelect, IonSelectOption} from "@ionic/vue";
import useWeekSharingUsers from "@/composable/use-week-sharing-users";
import {WeekSharing} from "@/models/dtos/WeekSharing";
import useCurrentUser from "@/composable/use-current-user";

export default {
  name: "WeekSharingSelector",
  emits: ["update:modelValue"],
  components: {IonSelect, IonSelectOption, IonCol, IonRow},
  props: {
    modelValue: {
      type: [Object, null],
      required: true,
      validator(value) {
        return value === null || value instanceof WeekSharing
      }
    }
  },
  setup(props, {emit}) {
    const {modelValue} = toRefs(props);

    const {t, locale} = useI18n();

    const {weekSharingUsers, getWeekSharingUserByID} = useWeekSharingUsers()

    const {currentUser} = useCurrentUser();

    const model = computed({
      get() {
        return modelValue.value?.author.id ?? "null"
      },
      set(value) {
        if (value !== null) {
          value = getWeekSharingUserByID(value);
        }
        emit('update:modelValue', value)
      }
    })

    const weekSharingForCurrentUser = computed(() => {
      return weekSharingUsers.value.filter(sharing => sharing.target.id === currentUser.value.uid);
    })

    const weekSharingUserOptions = computed(() => {
      console.log('locale', locale.value);
      const options = [
        {
          value: "null",
          label: t('shareWeekSelector.yourWeek')
        }
      ]

      for (const sharing of weekSharingForCurrentUser.value) {
        options.push({
          locale: locale.value,
          value: sharing.author.id,
          label: t('shareWeekSelector.sharedWeek', {
            email: sharing.author.email
          })
        })
      }

      return options;
    })

    const hasWeekSharingUser = computed(() => {
      return weekSharingForCurrentUser.value.length > 0
    })

    return {
      model,
      hasWeekSharingUser,
      weekSharingUserOptions,
      weekSharingForCurrentUser
    }
  }
}
</script>
