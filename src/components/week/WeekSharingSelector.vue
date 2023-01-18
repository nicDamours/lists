<template>
  <ion-row v-if="hasWeekSharingUser" class="week-sharing-selector">
    <ion-col class="week-sharing-selector__cell" size="2">
      <ion-select v-model="model">
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

export default {
  name: "WeekSharingSelector",
  emits: ["update:modelValue"],
  components: {IonSelect, IonSelectOption, IonCol, IonRow},
  props: {
    modelValue: {
      type: [String, null],
      required: true,
    }
  },
  setup(props, {emit}) {
    const {modelValue} = toRefs(props);

    const {t} = useI18n();

    const {weekSharingUsers} = useWeekSharingUsers()

    const model = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const weekSharingUserOptions = computed(() => {
      const options = [
        {
          value: null,
          label: "Your week"
        }
      ]

      weekSharingUsers.value.forEach(user => {
        options.push({
          value: user.id,
          label: `${user.email}'s week`
        })
      })

      return options;
    })

    const hasWeekSharingUser = computed(() => {
      return weekSharingUsers.value.length > 0
    })

    return {
      model,
      weekSharingUsers,
      hasWeekSharingUser,
      weekSharingUserOptions
    }
  }
}
</script>
