import {firestoreMutations} from "@/store/modules/firestoreModule";
import {SharedWeek} from "@/models/dtos/WeekPlan/SharedWeek";

export const namespaced = true;

export type WeekSharingState = {
    weekSharing: SharedWeek[];
}

export const state: WeekSharingState = {
    weekSharing: [],
}

export const getters = {
    weekSharingUsers(state: WeekSharingState) {
        return state.weekSharing;
    }
}

export const mutations = {
    ...firestoreMutations<WeekSharingState>("weekSharing"),
};


export const actions = {}

