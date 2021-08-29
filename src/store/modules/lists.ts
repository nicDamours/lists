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


/*

{
    ADD_NEW_LIST(state: ListState, payload: List) {
        state.lists.push(payload);
    },
    ADD_SECTION_TO_LIST(state: ListState, { section, listId }: { section: Section; listId: string }) {
        const listIndex = state.lists.findIndex(item => item.id = listId);
        if(listIndex >= 0) {
            const list = state.lists[listIndex];

            list.sections.push(section);

            state.lists[listIndex] = list;
        } else {
            throw new EntityNotFoundException("list", listId)
        }
    },
    ADD_ITEM_TO_SECTION(state: ListState, { sectionId, listId, item}: { sectionId: string; listId: string; item: Item}) {
        const listIndex = state.lists.findIndex(item => item.id = listId);
        if(listIndex >= 0) {
            const list = state.lists[listIndex];
            const sectionIndex = list.sections.findIndex(item => item.id = sectionId);
            if(sectionIndex >= 0) {
                list.sections[sectionIndex].items.push(item)

                state.lists[listIndex] = list;
            } else {
                throw new EntityNotFoundException("section", sectionId);
            }
        } else {
            throw new EntityNotFoundException("list", listId)
        }
    },
    REMOVE_ITEM_IN_SECTION(state: ListState, { listId, sectionId, itemId }: { listId: string; sectionId: string; itemId: string}) {
        const listIndex = state.lists.findIndex(item => item.id = listId);
        if(listIndex >= 0) {
            const list = state.lists[listIndex];
            const sectionIndex = list.sections.findIndex(item => item.id = sectionId);
            if(sectionIndex >= 0) {
                list.sections[sectionIndex].items = list.sections[sectionIndex].items.filter(item => item.id !== itemId);

                state.lists[listIndex] = list;
            } else {
                throw new EntityNotFoundException("section", sectionId);
            }
        } else {
            throw new EntityNotFoundException("list", listId)
        }
    },
    REMOVE_SECTION_IN_LIST(state: ListState, {sectionId, listId}: { sectionId: string; listId: string }) {
        const listIndex = state.lists.findIndex(item => item.id = listId);
        if(listIndex >= 0) {
            const list = state.lists[listIndex];

            list.sections = list.sections.filter(item => item.id !== sectionId)

            state.lists[listIndex] = list;
        } else {
            throw new EntityNotFoundException("list", listId)
        }
    },
    REMOVE_LIST(state: ListState, listId: string) {
        state.lists = state.lists.filter(item => item.id !== listId);
    }
 */
