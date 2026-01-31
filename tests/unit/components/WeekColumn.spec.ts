import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import WeekColumn from "@/components/week/WeekColumn.vue";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";
import {flushPromises, mount} from "@vue/test-utils";
import WeekCell from "@/components/week/WeekCell.vue";
import {nextTick} from "vue";

describe("WeekRow", () => {
    jest.useFakeTimers();

    it("show one cell per day element", () => {
        // given a day with different cell element
        const givenDay = new WeekPlanDays('1234', '', '', '', new Date())

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekColumn, {
            global: {
                plugins: [i18n],
                stubs: {
                    WeekCell: true,
                }
            },
            props: {
                day: givenDay,
            }
        });

        // then it should have created one cell per day element
        const cellsComponents = wrapper.findAllComponents(WeekCell);

        expect(cellsComponents.length).toEqual(3)
    })

    it("show render the correct content in each cell", () => {
        // given a day with different cell element
        const givenDinner = 'someDinner';
        const givenSupper = 'someSupper';
        const givenActivities = 'someActivities';

        const givenDay = new WeekPlanDays('1234', givenDinner, givenSupper, givenActivities, new Date())

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekColumn, {
            global: {
                plugins: [i18n],
                stubs: {
                    WeekCell: true,
                }
            },
            props: {
                day: givenDay,
            }
        });

        // then it should have pass the correct content to each cell
        const cellsComponents = wrapper.findAllComponents(WeekCell);

        expect(cellsComponents[0].props('content')).toEqual(givenDinner);
        expect(cellsComponents[1].props('content')).toEqual(givenSupper);
        expect(cellsComponents[2].props('content')).toEqual(givenActivities);
    })

    it("should emit a 'change' event when the week cells emits a change event", async () => {
        // given a day with different cell element
        const givenDay = new WeekPlanDays('1234', '', '', '', new Date())

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekColumn, {
            global: {
                plugins: [i18n],
                stubs: {
                    WeekCell: true,
                }
            },
            props: {
                day: givenDay,
            }
        });

        // when a cell emits a change event
        const givenNewValue = 'Some new value';

        const givenCell = wrapper.findAllComponents(WeekCell)[1];
        givenCell.vm.$emit('change', givenNewValue)
        await flushPromises();


        // then it should have emitted a 'change' event with the given day and value
        expect(wrapper.emitted()).toHaveProperty('day-value-change');
        expect(wrapper.emitted('day-value-change')).toEqual([[{
            supper: givenNewValue
        }]])
    })

    it("should pass the previous day's supper to the current day's dinner placeholder", async () => {
        // given a previous day with a supper
        const givenSupper = 'someSupper'
        const givenPreviousDay = new WeekPlanDays('1234', '', givenSupper, '', new Date())

        // and a current day with no dinner
        const givenCurrentDay = new WeekPlanDays('1234', '', givenSupper, '', new Date());

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekColumn, {
            global: {
                plugins: [i18n],
                stubs: {
                    WeekCell: true,
                }
            },
            props: {
                day: givenCurrentDay,
                previousDay: givenPreviousDay,
            }
        });

        // when focussing the dinner component for 2 seconds
        const dinnerComponent = wrapper.findAllComponents(WeekCell)[0];
        await dinnerComponent.trigger('focus')
        jest.runAllTimers();
        await nextTick();

        // then it should have passed the previous day's supper to the dinner placeh
        expect(dinnerComponent.props('placeholder')).toEqual(givenSupper)
    })
})
