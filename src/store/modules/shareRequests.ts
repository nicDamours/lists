import {firestoreMutations} from "@/store/modules/firestoreModule";
import ShareRequest from "@/models/dtos/ShareRequest";
import {VuexFunction} from "@/store";

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

export const mutations = {
    ...firestoreMutations<ShareRequestState>("shareRequests"),
    EMPTY_SHARE_REQUEST(state: ShareRequestState) {
        state.shareRequests = [];
    }
};

export const actions = {
    emptyShareRequest({ commit }: VuexFunction<typeof mutations>) {
        commit("EMPTY_SHARE_REQUEST")
    }
}
