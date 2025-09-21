import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import WeekRow from "@/components/week/WeekRow.vue";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";
import {mount, VueWrapper} from "@vue/test-utils";
import WeekCell from "@/components/week/WeekCell.vue";

describe("WeekRow", () => {
    it("should pass the tabindex props on the weekcell depending on their index and the multiplier", () => {
        // given some week cells
        const givenCellCount = 7;
        const givenWeekCells = new Array(givenCellCount).fill(undefined).map((_, index) => {
            return {
                content: 'day' + index + 1,
                id: index + 1,
                day: new WeekPlanDays('1234', '', '', '', new Date())
            }
        });

        // and an index multiplier
        const givenIndexMultiplier = 2

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekRow, {
            global: {
                plugins: [i18n],
                stubs: {
                    WeekCell: true,
                }
            },
            props: {
                cells: givenWeekCells,
                indexMultiplier: givenIndexMultiplier
            }
        });

        // then it should have passed the tabindex to each cell depending on their index
        const allWeekCells = wrapper.findAllComponents(WeekCell)

        expect(allWeekCells.length).toEqual(givenCellCount)

        for (let i = 0; i < allWeekCells.length; i++) {
            const component = allWeekCells[i] as VueWrapper<typeof WeekCell>
            expect(component.props('tabIndex')).toEqual((givenIndexMultiplier * 3) + i)
        }
    })
})
