import {firestoreMutations} from "@/store/modules/firestoreModule";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {addDays, startOfWeek} from "date-fns";
import {SharedUser} from "@/models/dtos/SharedUser";
import {SharedWeek} from "@/models/dtos/WeekPlan/SharedWeek";

export const namespaced = true;

export type SharedWeeksState = {
    sharedWeeks: SharedWeek[];
}

export const state: SharedWeeksState = {
    sharedWeeks: [],
}

export const getters = {
    weeks(state: SharedWeeksState) {
        return state.sharedWeeks;
    },
    sharedWeeksForUser: (state: SharedWeeksState) => (id: string) => {
        return state.sharedWeeks.filter(sharing => sharing.weekAuthor.id === id).map(sharing => sharing.week);
    },
    currentSharedWeekForUser: (state: SharedWeeksState) => (id: string | null, date: Date) => {
        if (id === null) {
            return null;
        }

        const startOfCurrentWeek = startOfWeek(date);
        const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

        let givenSharing = state.sharedWeeks.find(sharing => {
            return sharing.week.startDate.getTime() === startOfCurrentWeek.getTime()
                && sharing.week.endDate.getTime() === endOfCurrentWeek.getTime()
                && sharing.weekAuthor.id === id
        });

        if (!givenSharing) {
            const givenSharingWeekPlan = new WeekPlan("", startOfCurrentWeek, endOfCurrentWeek);
            let givenSharingAuthor = state.sharedWeeks.find(sharing => sharing.weekAuthor.id === id)?.weekAuthor;

            if (!givenSharingAuthor) {
                givenSharingAuthor = new SharedUser("", "");
            }
            givenSharing = new SharedWeek("", givenSharingAuthor, givenSharingWeekPlan)
        }

        return givenSharing.week
    }
}

export const mutations = {
    ...firestoreMutations<SharedWeeksState>("sharedWeeks"),
};

export const actions = {}

