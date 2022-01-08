import {firestoreMutations} from "@/store/modules/firestoreModule";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {addDays, startOfWeek} from "date-fns";

export const namespaced = true;

export type WeekState = {
    weeks: WeekPlan[];
}

export const state: WeekState = {
    weeks: [],
}

export const getters = {
    weeks(state: WeekState) {
        return state.weeks;
    },
    currentWeek: (state: WeekState) => (date: Date) => {
        const startOfCurrentWeek = startOfWeek(date);
        const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

        let givenPlan = state.weeks.find(plan => {
            return plan.startDate.getTime() === startOfCurrentWeek.getTime() && plan.endDate.getTime() === endOfCurrentWeek.getTime()
        });

        if(!givenPlan) {
            givenPlan = new WeekPlan("", startOfCurrentWeek, endOfCurrentWeek);
        }

        return givenPlan
    }
}

export const mutations = {
    ...firestoreMutations<WeekState>("weeks"),
};

export const actions = {}

