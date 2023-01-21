import {computed, Ref} from "vue";
import {useStore} from "vuex";
import {WeekSharing} from "@/models/dtos/WeekSharing";

export default function useWeekSharing(selectedSharing: Ref<WeekSharing>, selectedDate: Ref<Date>) {
    const store = useStore();

    const currentSharedWeekForUser = computed(() => {
        return store.getters["sharedWeeks/currentSharedWeekForUser"](selectedSharing.value.author.id, selectedDate.value)
    })

    return {
        currentSharedWeekForUser
    }
}
