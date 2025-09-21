<template>
  <ion-list-header>{{ getTitleForDay(day) }}</ion-list-header>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'burger-soda']"  slot="start"/>
    <ion-input v-model="dinnerModel" :placeholder="previousDaySupper" :tabindex="index * 3 + 1" class="lunch-input"
               debounce="500" @keyup.tab="autoFillPreviousSupper"/>
  </ion-item>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'utensils']"  slot="start"/>
    <ion-input v-model="supperModel" :tabindex="index * 3 + 2" class="supper-input" debounce="500"/>
  </ion-item>
  <ion-item>
    <font-awesome-icon :icon="['fal', 'biking']" slot="start"/>
    <ion-input v-model="activitiesModel" :tabindex="index * 3 + 3" class="activities-input" debounce="500"/>
  </ion-item>
</template>

<script>
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import {IonInput, IonItem, IonListHeader} from "@ionic/vue";
import {useI18n} from "vue-i18n";
import useDates from "@/composable/use-dates";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computed, toRefs} from "vue";
import useWeekDayModels from "@/composable/use-week-day-models";

export default {
  name: "WeekDayListGroup",
  emits: ["day-value-change"],
  components: {
    FontAwesomeIcon,
    IonInput,
    IonItem,
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
      type: Object,
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

    const shouldAutofillPreviousSupper = computed(() => {
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

    return {
      t,
      getTitleForDay,
      previousDaySupper,
      autoFillPreviousSupper,
      ...models
    }
  }
}
</script>

<style scoped>

</style>
