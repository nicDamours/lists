<template>
  <ion-list-header>{{ getTitleForDay(day) }}</ion-list-header>
  <ion-item>
    <ion-icon slot="start" src="img/svgs/burger-soda.svg"></ion-icon>
    <ion-input v-model="dinnerModel" :placeholder="previousDaySupper" class="lunch-input"
               debounce="500" @keydown="shouldDisablePlaceholder" @keydown.tab="autoFillPreviousSupper"
               @ion-focus="handleFocus"/>
  </ion-item>
  <ion-item>
    <ion-icon slot="start" src="img/svgs/utensils.svg"></ion-icon>
    <ion-input v-model="supperModel" class="supper-input" debounce="500"/>
  </ion-item>
  <ion-item>
    <ion-icon slot="start" src="img/svgs/biking.svg"></ion-icon>
    <ion-input v-model="activitiesModel" class="activities-input" debounce="500"/>
  </ion-item>
</template>

<script>
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import {IonIcon, IonInput, IonItem, IonListHeader} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import useDates from "@/composable/use-dates";
import {computed, ref, toRefs} from "vue";
import useWeekDayModels from "@/composable/use-week-day-models";

export default {
  name: "WeekDayListGroup",
  emits: ["day-value-change"],
  components: {
    IonInput,
    IonItem,
    IonIcon,
    IonListHeader
  },
  props: {
    day: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof WeekPlanDays
      }
    },
    index: {
      type: Number,
      required: true,
      validator(value) {
        return value >= 0
      }
    },
    previousDay: {
      type: [Object, null],
      required: true,
      validator(value) {
        return value === null || value instanceof WeekPlanDays
      }
    }
  },
  setup(props, { emit }) {
    const {day, previousDay} = toRefs(props);
    const { t } = useI18n();

    const { formatDateForDayOfWeek } = useDates();

    const getTitleForDay = day => {
      return formatDateForDayOfWeek(day.date);
    }

    const previousDaySupper = computed(() => {
      return previousDay.value?.supper ?? undefined;
    })

    const models = useWeekDayModels(day, emit);
    const {dinnerModel} = models;

    const isPlaceholderDisabled = ref(false);

    const shouldAutofillPreviousSupper = computed(() => {
      if (isPlaceholderDisabled.value) {
        return false
      }

      if (previousDaySupper.value === undefined) {
        return false;
      }

      if (dinnerModel.value === "") {
        return true;
      }

      return previousDaySupper.value.startsWith(dinnerModel.value);
    })

    const autoFillPreviousSupper = () => {
      if (shouldAutofillPreviousSupper.value) {
        dinnerModel.value = previousDaySupper.value;
      }
    }

    const shouldDisablePlaceholder = (event) => {
      if (event.key !== 'tab') {
        isPlaceholderDisabled.value = true;
      }
    }

    const handleFocus = () => {
      isPlaceholderDisabled.value = false
      emit('focus')
    }

    return {
      t,
      handleFocus,
      getTitleForDay,
      previousDaySupper,
      autoFillPreviousSupper,
      shouldDisablePlaceholder,
      ...models
    }
  }
}
</script>

<style scoped>

</style>
