import {List} from "@/models/dtos/List";
import {firestoreMutations} from "@/store/modules/firestoreModule";

export const namespaced = true;

export type ListState = {
    lists: List[];
}

export const state: ListState = {
    lists: []
}

export const getters = {
    lists(state: ListState) {
        return state.lists;
    },
    getListById: (state: ListState) => (id: string) => {
        return state.lists.find(item => item.id === id);
    }
}

export const mutations = firestoreMutations<ListState>("lists");

export const actions = {}

