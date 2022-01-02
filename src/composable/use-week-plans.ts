import {useStore} from "vuex";
import {computed, Ref} from "vue";

export default function useWeeKPlans(viewDate: Ref<Date>) {
    const store = useStore();

    const weekPlans = computed(() => store.getters['weeks/weeks']);

    const currentWeekPlan = computed(() => store.getters['weeks/currentWeek'](viewDate.value));

    return {
        weekPlans,
        currentWeekPlan
    }
}
