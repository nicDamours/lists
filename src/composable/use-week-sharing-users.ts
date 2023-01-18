import {computed} from "vue";
import {useStore} from "vuex";

export default function useWeekSharingUsers() {
    const store = useStore();

    const weekSharingUsers = computed(() => {
        return store.getters["weekSharing/weekSharingUsers"]
    });

    return {
        weekSharingUsers
    }
}
