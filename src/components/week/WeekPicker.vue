<template>
  <IonDatetime :multiple="true" :value="selectedDates" presentation="date" size="cover" @ionChange="handleDateChange"/>
</template>

<script>
import {computed, toRefs} from "vue";
import useDates from "@/composable/use-dates";
import weekPropsValidator from "@/propsValidators/weekPropsValidator";
import {IonDatetime} from "@ionic/vue";

export default {
  name: "WeekPicker",
  emits: ["update:modelValue"],
  components: {IonDatetime},
  props: {
    modelValue: {
      type: Object,
      required: true,
      validator(value) {
        return weekPropsValidator(value)
      }
    }
  },
  setup(props, {emit}) {
    const {modelValue} = toRefs(props);

    const {getDatesInWeek, format, getDateFormat, getStartOfWeek, getEndOfWeek, parse} = useDates()

    const selectedDates = computed(() => {
      const weekDates = getDatesInWeek(modelValue.value.startDate)

      return weekDates.map(date => format(date, getDateFormat()).value)
    })


    const getNewlySelectedDate = (value) => {
      for (const newDate of value) {
        if (!selectedDates.value.includes(newDate)) {
          return newDate
        }
      }

      return null;
    }

    const handleDateChange = value => {
      const newlySelectedDate = getNewlySelectedDate(value.detail.value);
      if (newlySelectedDate !== null) {
        const newValue = parse(newlySelectedDate, getDateFormat());

        const startOfWeekForSelectedDate = getStartOfWeek(newValue);
        const endOfWeekForSelectedDate = getEndOfWeek(newValue);

        emit("update:modelValue", {
          startDate: startOfWeekForSelectedDate,
          endDate: endOfWeekForSelectedDate
        })
      }
    }
    return {
      selectedDates,
      handleDateChange
    }
  }
}
</script>

