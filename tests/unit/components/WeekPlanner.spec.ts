import {WeekPlan} from "@/models/dtos/WeekPlan/WeekPlan";
import {addDays} from "date-fns";
import WeekPlanner from "@/components/WeekPlanner.vue";
import {flushPromises, mount} from "@vue/test-utils";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";
import WeekColumn from "@/components/week/WeekColumn.vue";

describe("WeekPlanner", () => {
    it("should have one column for each days of the plan", () => {
        // given a plan with some days
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

        // then it should have one WeekColumn for each plan day

        const WeekColumnComponents = wrapper.findAllComponents(WeekColumn);
        expect(WeekColumnComponents).toHaveLength(plan.days.length)

        for (let i = 0; i < plan.days.length; i++) {
            expect(WeekColumnComponents[i].props('day')).toEqual(plan.days[i]);
        }
    })

    it("should pass the previous day to the weekColumn", () => {
        // given a plan with some days
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

        // then it should have passed null as the previous days for the first column
        const WeekColumnComponents = wrapper.findAllComponents(WeekColumn);
        expect(WeekColumnComponents[0].props('previousDay')).toEqual(null);

        // and it should have passed the previous days to the other days
        for (let i = 1; i < plan.days.length; i++) {
            expect(WeekColumnComponents[i].props('previousDay')).toEqual(plan.days[i - 1]);
        }
    })

    it("should emit a 'plan-change' when a WeekColum emits a change event", async () => {
        // given a plan with some days
        const date = new Date();
        const plan = new WeekPlan('12345', date, addDays(date, 6))

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekPlanner, {
            global: {
                plugins: [i18n]
            },
            props: {
                plan
            }
        })

        // when one of the weekDay emits a change event
        const givenIndex = 4;
        const givenNewValue = 'SomeNewValue';
        const givenWeekDayComponent = wrapper.findAllComponents(WeekColumn)[givenIndex];
        givenWeekDayComponent.vm.$emit('day-value-change', {supper: givenNewValue});
        await flushPromises();

        // then it should have emitted a 'update-plan' with the new value for the given plan
        expect(wrapper.emitted()).toHaveProperty('update-plan');
        expect((wrapper.emitted<WeekPlan[]>('update-plan')?.[0][0] as WeekPlan).days).toEqual(expect.arrayContaining([
            expect.objectContaining({
                _supper: givenNewValue
            })
        ]));
    })
})
