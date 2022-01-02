import useLoading from "@/composable/use-loading";
import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {WeekService} from "@/services/WeekService";

export default function useWeekService() {
    const { callAsync } = useLoading();

    const createWeekPlan = async (plan: WeekPlan) => {
        await callAsync(WeekService.createWeek, plan);
    }

    const updateWeekPlan = async (plan: WeekPlan) => {
        await callAsync(WeekService.updateWeek, plan);
    }


    return {
        createWeekPlan,
        updateWeekPlan
    }
}
