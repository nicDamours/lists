<template>
  <div class="o-week-selector">
    <ion-grid class="ion-justify-content-center">
      <ion-row>
        <ion-col size="2" class="ion-align-self-center --col--end">
          <ion-button fill="clear" color="dark"  @click="handlePreviousWeekClick">
            <ion-icon slot="icon-only" :icon="chevronBackOutline"/>
          </ion-button>
        </ion-col>
        <ion-col size="8" class="ion-align-self-center --col--center">
          <ion-button id="open-date-input" fill="clear" color="dark">{{ formattedModelValue }}</ion-button>
          <ion-popover trigger="open-date-input" :show-backdrop="false">
            <ion-datetime
                :model-value="modelValue"
                presentation="date"

                @ionChange="handleDateChange"
            />
          </ion-popover>
        </ion-col>
        <ion-col size="2" class="ion-align-self-center --col--start">
          <ion-button fill="clear" color="dark" @click="handleNextWeekClick" >
            <ion-icon slot="icon-only" :icon="chevronForwardOutline" />
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script>
import {IonButton, IonCol, IonDatetime, IonGrid, IonIcon, IonPopover, IonRow} from "@ionic/vue";
import {chevronBackOutline, chevronForwardOutline} from 'ionicons/icons';
import {computed, toRefs} from "vue";
import useDates from "../../composable/use-dates";

export default {
  name: "WeekSelector",
  emits: ["update:modelValue"],
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonPopover,
    IonDatetime,
    IonButton
  },
  props: {
    modelValue: {
      type: Date,
      required: false,
      default() {
        return new Date();
      }
    }
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const { subDays, addDays, parse, format, getStartOfWeek, getEndOfWeek} = useDates();

    const formattedModelValue = computed(() => {
      const startOfGivenWeek = format(getStartOfWeek(modelValue.value), 'ccc d MMM yyyy');
      const endOfGivenWeek = format(getEndOfWeek(modelValue.value), 'ccc d MMM yyyy');

      return `${startOfGivenWeek} - ${endOfGivenWeek}`;
    })

    const handlePreviousWeekClick = () => {
      const updatedDate = subDays(modelValue.value, 7);

      emit("update:modelValue", updatedDate);
    }

    const handleNextWeekClick = () => {
      const updatedDate = addDays(modelValue.value, 7);

      console.log('new date', updatedDate);

      emit("update:modelValue", updatedDate);
    }

    const handleDateChange = (selectedDate) => {
      const updatedDate = parse(selectedDate, 'yyyy-MM-dd');

      emit("update:modelValue", updatedDate);
    }

    return {
      handleDateChange,
      handlePreviousWeekClick,
      handleNextWeekClick,
      formattedModelValue,
      chevronBackOutline,
      chevronForwardOutline
    }
  }
}
</script>
