import {computed} from "vue";
import {useStore} from "vuex";
import {WeekSharing} from "@/models/dtos/WeekSharing";

export default function useWeekSharingUsers() {
    const store = useStore();
    const sharingUserCache: Record<string, WeekSharing> = {};

    const weekSharingUsers = computed(() => {
        return store.getters["weekSharing/weekSharingUsers"]
    });

    const getWeekSharingUserByID = (id: string) => {
        if (!(id in sharingUserCache)) {
            const sharingUser = weekSharingUsers.value.find((user: WeekSharing) => user.author.id === id);

            if (sharingUser === null) {
                throw new Error("Could not find user with id: " + id)
            }

            sharingUserCache[id] = sharingUser;
        }

        return sharingUserCache[id];
    }

    return {
        weekSharingUsers,
        getWeekSharingUserByID
    }
}
