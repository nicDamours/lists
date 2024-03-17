import {firestoreMutations} from "@/store/modules/firestoreModule";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";

export const namespaced = true;

export type GroupsState = {
    groups: BillGroup[];
}

export const state: GroupsState = {
    groups: []
}

export const getters = {
    groups(state: GroupsState) {
        return state.groups;
    },
    getGroupById: (state: GroupsState) => (id: string) => {
        return state.groups.find(item => item.id === id);
    }
}

export const mutations = {
    ...firestoreMutations<GroupsState>("groups"),
};

