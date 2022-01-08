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
          <ion-button fill="clear" color="dark" @click="openDateTimeModal">{{ formattedModelValue }}</ion-button>
          <ion-popover :is-open="dateTimeModalOpen" :event="popOverEvent" @didDismiss="closeDateTimeModal">
            <div class="grid">
              <div class="grid-item">
                <ion-datetime
                    presentation="date"
                    :value="model"
                    :locale="preferredLocaleCode"
                    @ionChange="handleDateChange"></ion-datetime>
              </div>
            </div>
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
import {computed, ref, toRefs} from "vue";
import useDates from "../../composable/use-dates";
import useLocale from "@/composable/use-locale";

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

    const dateTimeModalOpen = ref(false);
    const popOverEvent = ref(null);
    const { preferredDateLocale } = useLocale();

    const { subDays, addDays, format, getStartOfWeek, getEndOfWeek, toISO, parseISO} = useDates();


    const model = computed({
      get() {
        return toISO(modelValue.value)
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const formattedModelValue = computed(() => {
      const startOfGivenWeek = format(getStartOfWeek(modelValue.value), 'ccc d MMM yyyy').value;
      const endOfGivenWeek = format(getEndOfWeek(modelValue.value), 'ccc d MMM yyyy').value;

      return `${startOfGivenWeek} - ${endOfGivenWeek}`;
    })

    const handlePreviousWeekClick = () => {
      model.value = subDays(modelValue.value, 7);
    }

    const handleNextWeekClick = () => {
      model.value = addDays(modelValue.value, 7);
    }

    const handleDateChange = (event) => {
      const selectedDate = event.target.value;
      model.value = parseISO(selectedDate);
      dateTimeModalOpen.value = false;
    }

    const openDateTimeModal = ($event) => {
      popOverEvent.value = $event
      dateTimeModalOpen.value = true;
    }

    const closeDateTimeModal = () => {
      dateTimeModalOpen.value = false;
    }

    const preferredLocaleCode = computed(() => {
      console.log(preferredDateLocale.value.code);
      return preferredDateLocale.value.code;
    })

    return {
      model,
      popOverEvent,
      handleDateChange,
      openDateTimeModal,
      dateTimeModalOpen,
      closeDateTimeModal,
      chevronBackOutline,
      formattedModelValue,
      preferredLocaleCode,
      handleNextWeekClick,
      chevronForwardOutline,
      handlePreviousWeekClick
    }
  }
}
</script>
