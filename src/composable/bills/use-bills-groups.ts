import {computed} from "vue";
import {useStore} from "vuex";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import useLoading from "@/composable/use-loading";
import {BillGroupService} from "@/services/bills/BillGroupService";

export default function useBillsGroups() {
    const store = useStore();
    const {callAsync} = useLoading();

    const billGroups = computed(() => {
        return store.getters["bills/groups"]
    });

    const getGroupById = (groupId: string) => {
        return store.getters["bills/getGroupById"](groupId)
    };

    const createGroup = async (group: BillGroup) => {
        await callAsync(BillGroupService.addNewBillGroup, group)
    }

    const deleteGroup = async (group: BillGroup) => {
        await callAsync(BillGroupService.deleteGroup, group);
    }

    return {
        getGroupById,
        billGroups,
        createGroup,
        deleteGroup
    };
}
