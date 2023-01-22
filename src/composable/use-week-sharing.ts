import {computed, Ref} from "vue";
import {useStore} from "vuex";
import {WeekSharing} from "@/models/dtos/WeekSharing";

export default function useWeekSharing(selectedSharing: Ref<WeekSharing>, selectedDate: Ref<Date>) {
    const store = useStore();

    const currentSharedWeekForUser = computed(() => {
        if (selectedSharing.value !== null) {
            return store.getters["sharedWeeks/currentSharedWeekForUser"](selectedSharing.value.author.id, selectedDate.value)
        }

        return null;
    })

    return {
        currentSharedWeekForUser
    }
}
