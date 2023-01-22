<template>
  <div class="share-week-selector ion-padding">
    <ion-list>
      <ion-radio-group :value="shareAllWeeksModel" @ionChange="handleShareAllWeekChange">
        <ion-item>
          <ion-label>{{ t('shareWeekSelector.shareAllWeeks') }}</ion-label>
          <ion-radio slot="end" :value="true"></ion-radio>
        </ion-item>
        <ion-item>
          <ion-label>{{ t('shareWeekSelector.shareSpecificWeek') }}</ion-label>
          <ion-radio slot="end" :value="false"></ion-radio>
        </ion-item>
      </ion-radio-group>
    </ion-list>
    <div v-if="!shareAllWeeksModel" class="share-week-selector__selector">
      <WeekPicker v-model="model"/>
    </div>
  </div>
</template>

<script>
import weekPropsValidator from "@/propsValidators/weekPropsValidator";
import WeekPicker from "@/components/week/WeekPicker.vue";
import {computed, toRefs} from "vue";
import {useI18n} from "vue-i18n";
import {IonItem, IonLabel, IonList, IonRadio, IonRadioGroup} from "@ionic/vue";

export default {
  name: "ShareWeekSelector",
  components: {WeekPicker, IonList, IonItem, IonLabel, IonRadio, IonRadioGroup},
  props: {
    modelValue: {
      type: Object,
      required: true,
      validator(value) {
        return weekPropsValidator(value)
      }
    },
    shareAllWeeks: {
      type: Boolean,
      required: false,
      default() {
        return false
      }
    }
  },
  setup(props, {emit}) {
    const {modelValue, shareAllWeeks} = toRefs(props);

    const {t} = useI18n();

    const model = computed({
      get() {
        return modelValue.value
      },
      set(value) {
        emit("update:modelValue", value);
      }
    })

    const shareAllWeeksModel = computed({
      get() {
        return shareAllWeeks.value
      },
      set(value) {
        emit("update:shareAllWeeks", value)
      }
    })

    const handleShareAllWeekChange = (value) => {
      shareAllWeeksModel.value = value.detail.value;
    }

    return {
      t,
      model,
      shareAllWeeksModel,
      handleShareAllWeekChange
    }
  }
}
</script>
