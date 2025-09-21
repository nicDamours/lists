import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {addDays} from "date-fns";
import WeekPlanner from "@/components/WeekPlanner.vue";
import WeekDayListGroup from "@/components/week/WeekDayListGroup.vue";
import {mount} from "@vue/test-utils";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";

describe("WeekPlanner", () => {
    it("should pass the previous day to the week day", () => {
        // given a plan
        const date = new Date();
        const plan = new WeekPlan('12345', date, addDays(date, 6))

        // when rendering the week planner
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekPlanner, {
            global: {
                plugins: [i18n]
            },
            props: {
                plan
            }
        })

        // then it should have passed the previous day to the Previous day props
        const WeekDayListGroups = wrapper.findAllComponents(WeekDayListGroup);

        for (let i = 0; i < WeekDayListGroups.length; i++) {
            const previousDay = i === 0 ? null : plan.days[i - 1]

            const group = WeekDayListGroups[i]

            expect(group.props('previousDay')).toEqual(previousDay)
        }
    })

    it("should pass the multipliers to the week rows", () => {
        // given a plan
        const date = new Date();
        const plan = new WeekPlan('12345', date, addDays(date, 6))

        // when rendering the week planner
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekPlanner, {
            global: {
                plugins: [i18n]
            },
            props: {
                plan
            }
        })

        // then it should have passed 1 to the dinner week row's index multiplier
        const dinnerWeekRow = wrapper.findComponent('.dinner-week-row')
        expect(dinnerWeekRow.props('indexMultiplier')).toEqual(1)

        // and it should have passed 2 to the supper week row's index multiplier
        const supperWeekRow = wrapper.findComponent('.supper-week-row')
        expect(supperWeekRow.props('indexMultiplier')).toEqual(2)

        // and it should have passed 3 to the activities week row's index multiplier
        const activitiesWeekRow = wrapper.findComponent('.activities-week-row')
        expect(activitiesWeekRow.props('indexMultiplier')).toEqual(3)
    })

    it("should create the placeholders for the dinner cells", () => {
        // given a plan
        const date = new Date();
        const plan = new WeekPlan('12345', date, addDays(date, 6))

        // when rendering the week planner
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekPlanner, {
            global: {
                plugins: [i18n]
            },
            props: {
                plan
            }
        })

        // then it should have passed the previous day to the Previous day props
        const WeekDayListGroups = wrapper.findAllComponents(WeekDayListGroup);

        for (let i = 0; i < WeekDayListGroups.length; i++) {
            const previousDay = i === 0 ? null : plan.days[i - 1]

            const group = WeekDayListGroups[i]

            expect(group.props('previousDay')).toEqual(previousDay)
        }
    })
})
