import {firestoreMutations} from "@/store/modules/firestoreModule";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";

export const namespaced = true;

export type ListState = {
    groups: BillGroup[];
}

export const state: ListState = {
    groups: []
}

export const getters = {
    groups(state: ListState) {
        return state.groups;
    },
    getGroupById: (state: ListState) => (id: string) => {
        return state.groups.find(item => item.id === id);
    }
}

export const mutations = {
    ...firestoreMutations<ListState>("groups"),
};

