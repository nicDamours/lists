import {computed, Ref} from "vue";
import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";

export default function useWeekDayModels(modelValue: Ref<WeekPlanDays>, emit: (event: string, value: any) => void) {

    const dinnerModel = computed({
        get() {
            return modelValue.value.dinner
        },
        set(value) {
            emit("day-value-change", {
                dinner: value
            })
        }
    })

    const supperModel = computed({
        get() {
            return modelValue.value.supper
        },
        set(value) {
            emit("day-value-change", {
                supper: value
            })
        }
    })

    const activitiesModel = computed({
        get() {
            return modelValue.value.activities
        },
        set(value) {
            emit("day-value-change", {
                activities: value
            })
        }
    })

    return {
        dinnerModel,
        supperModel,
        activitiesModel,
    }
}
