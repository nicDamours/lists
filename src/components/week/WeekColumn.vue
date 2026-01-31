<template>
  <ion-col class="ion-no-padding">
    <div :class="{'--today': isToday }"
         class="week-column ion-justify-content-center">
      <div class="week-column__title">
        <ion-text class="week-column__title-text">
          <div>{{ dayTitle }}</div>
        </ion-text>
      </div>
      <WeekCell
          v-for="(model, $name) in models"
          :key="$name"
          :content="model.value"
          :placeholder="getPlaceholderForCell($name)"
          @change="value => model.value = value"
          @focus="handleCellFocus($name)"
          @keydown="clearCurrentTimeout"
      />
    </div>
  </ion-col>
</template>

<script>
import {IonCol, IonText} from "@ionic/vue";
import WeekCell from "./WeekCell";
import useDates from "@/composable/use-dates";
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import {computed, ref, toRefs} from "vue";
import useWeekDayModels from "@/composable/use-week-day-models";

export default {
  name: "WeekColumn",
  emits: ["day-value-change"],
  components: {WeekCell, IonText, IonCol},
  props: {
    day: {
      type: Object,
      required: true,
      validator(value) {
        return value instanceof WeekPlanDays
      }
    },
    previousDay: {
      type: [Object, null],
      required: false,
      default() {
        return null
      },
      validator(value) {
        return value === null || value instanceof WeekPlanDays
      }
    }
  },
  setup(props, {emit}) {
    const PLACEHOLDER_TIMEOUT = 500

    const {day, previousDay} = toRefs(props);

    const models = useWeekDayModels(day, emit)

    const {isSameDay, formatDateForDayOfWeek} = useDates();

    const isToday = computed(() => {
      return day.value.date && isSameDay(day.value.date, new Date());
    });

    const dayTitle = computed(() => {
      return formatDateForDayOfWeek(day.value.date)
    })

    const currentPlaceholder = ref(undefined);
    const currentPlaceholderTimeout = ref(0);

    const getPlaceholderForCell = (name) => {
      if (name === 'dinnerModel') {
        return currentPlaceholder.value
      }

      return null
    }

    const handleCellFocus = (name) => {
      if (name !== "dinnerModel") {
        if (currentPlaceholderTimeout.value) {
          clearTimeout(currentPlaceholderTimeout.value)
        }

        return
      }

      if (previousDay.value === null) {
        return
      }

      currentPlaceholderTimeout.value = setTimeout(() => {
        currentPlaceholder.value = previousDay.value.supper ?? '';
        currentPlaceholderTimeout.value = undefined;
      }, PLACEHOLDER_TIMEOUT)
    }

    const clearCurrentTimeout = () => {
      clearTimeout(currentPlaceholderTimeout.value)
    }

    return {
      models,
      isToday,
      dayTitle,
      handleCellFocus,
      clearCurrentTimeout,
      getPlaceholderForCell
    }
  }
}
</script>

<style scoped lang="scss">
.week {
  &-column {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: solid 1px lightgray;
    min-height: 100px;
    border-left: solid 1px lightgray;

    &__title {
      border-bottom: solid 1px lightgray;
      padding: 8px;

      &-text {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    &.--today {
      background-color: var(--ion-color-step-150);
    }
  }
}
</style>
