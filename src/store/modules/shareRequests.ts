import {firestoreMutations} from "@/store/modules/firestoreModule";
import ShareRequest from "@/models/dtos/ShareRequest";

export const namespaced = true;

export type ShareRequestState = {
    shareRequests: ShareRequest[];
}

export const state: ShareRequestState = {
    shareRequests: []
}

export const getters = {
    shareRequests(state: ShareRequestState) {
        return state.shareRequests;
    },
    getRequestById: (state: ShareRequestState) => (id: string) => {
        return state.shareRequests.find(item => item.id === id);
    }
}

export const mutations = firestoreMutations<ShareRequestState>("shareRequests");

export const actions = {}
