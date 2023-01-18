import {computed, Ref} from "vue";
import {useStore} from "vuex";

export default function useWeekSharing(selectedId: Ref<string>, selectedDate: Ref<Date>) {
    const store = useStore();

    const currentSharedWeekForUser = computed(() => {
        return store.getters["weekSharing/currentSharedWeekForUser"](selectedId.value, selectedDate.value)
    })

    return {
        currentSharedWeekForUser
    }
}
