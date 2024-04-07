import {computed} from "vue";
import {useStore} from "vuex";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import useLoading from "@/composable/use-loading";
import {BillGroupService} from "@/services/bills/BillGroupService";
import {useRoute} from "vue-router";

export default function useBillsGroups() {
    const store = useStore();
    const route = useRoute();
    const {callAsync} = useLoading();

    const billGroups = computed(() => {
        return store.getters["bills/groups"]
    });

    const getGroupById = (groupId: string) => {
        return store.getters["bills/getGroupById"](groupId)
    };

    const currentGroup = computed(() => {
        return getGroupById(route.params.id as string)
    });

    const createGroup = async (group: BillGroup) => {
        await callAsync(BillGroupService.addNewBillGroup, group)
    }

    const deleteGroup = async (group: BillGroup) => {
        await callAsync(BillGroupService.deleteGroup, group);
    }

    return {
        getGroupById,
        currentGroup,
        billGroups,
        createGroup,
        deleteGroup,
    };
}
