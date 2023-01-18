import {firestoreMutations} from "@/store/modules/firestoreModule";
import {WeekSharing} from "@/models/dtos/WeekPlan/WeekSharing";
import {SharedUser} from "@/models/dtos/SharedUser";
import {addDays, startOfWeek} from "date-fns";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";

export const namespaced = true;

export type WeekSharingState = {
    weekSharing: WeekSharing[];
}

export const state: WeekSharingState = {
    weekSharing: [],
}

export const getters = {
    weekSharingUsers(state: WeekSharingState) {
        const uniqueSharingUsers: Record<string, SharedUser> = {}
        for (const sharing of state.weekSharing) {
            if (!(sharing.weekAuthor.id in uniqueSharingUsers)) {
                uniqueSharingUsers[sharing.weekAuthor.id] = sharing.weekAuthor;
            }
        }

        return Object.values(uniqueSharingUsers);
    },
    sharedWeeksForUser: (state: WeekSharingState) => (id: string) => {
        return state.weekSharing.filter(sharing => sharing.weekAuthor.id === id).map(sharing => sharing.week);
    },
    currentSharedWeekForUser: (state: WeekSharingState) => (id: string, date: Date) => {
        const startOfCurrentWeek = startOfWeek(date);
        const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

        let givenSharing = state.weekSharing.find(sharing => {
            return sharing.week.startDate.getTime() === startOfCurrentWeek.getTime()
                && sharing.week.endDate.getTime() === endOfCurrentWeek.getTime()
                && sharing.weekAuthor.id === id
        });

        if (!givenSharing) {
            const givenSharingWeekPlan = new WeekPlan("", startOfCurrentWeek, endOfCurrentWeek);
            let givenSharingAuthor = state.weekSharing.find(sharing => sharing.weekAuthor.id === id)?.weekAuthor;

            if (!givenSharingAuthor) {
                givenSharingAuthor = new SharedUser("", "");
            }
            givenSharing = new WeekSharing("", givenSharingAuthor, givenSharingWeekPlan)
        }

        return givenSharing.week
    }
}

export const mutations = {
    ...firestoreMutations<WeekSharingState>("weekSharing"),
};


export const actions = {}

