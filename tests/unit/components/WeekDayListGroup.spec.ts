import {WeekPlanDays} from "@/models/dtos/WeekPlan/WeekPlanDays";
import WeekDayListGroup from "@/components/week/WeekDayListGroup.vue";
import {mount} from "@vue/test-utils";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";

describe("WeekDayListGroup", () => {
    it("should set the lunch placeholder as the previous day supper when there is a value", () => {
        // given a current day with no lunch
        const givenCurrentDay = new WeekPlanDays('1234', '', '', '', new Date())

        // and a previousDay with a supper
        const givenSupper = 'macaroni'
        const givenPreviousDay = new WeekPlanDays('1234', '', givenSupper, '', new Date())

        // when rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: givenPreviousDay,
                day: givenCurrentDay
            }
        })

        // then it should have set the lunch input placeholder as the given supper
        const givenLunchInput = wrapper.findComponent('.lunch-input')

        expect(givenLunchInput.props('placeholder')).toEqual(givenSupper)
    })

    it("should auto fill the lunch input when tab is pressed", async () => {
        // given a current day with no lunch
        const givenCurrentDay = new WeekPlanDays('1234', '', '', '', new Date())

        // and a previousDay with a supper
        const givenSupper = 'macaroni'
        const givenPreviousDay = new WeekPlanDays('1234', '', givenSupper, '', new Date())

        // and a component rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: givenPreviousDay,
                day: givenCurrentDay
            }
        })

        // when the lunch input trigger a keypress with a tab key
        const givenLunchInput = wrapper.findComponent('.lunch-input')
        await givenLunchInput.trigger('keyup.tab')

        // then the component should have emitted a day-value-change event with the previous supper value as the dinner value
        expect(wrapper.emitted()).toHaveProperty('day-value-change');
        expect((wrapper.emitted<typeof WeekDayListGroup>('day-value-change') as string[][])[0][0]).toEqual(expect.objectContaining({
            dinner: givenSupper
        }))
    })

    it("should not autofill if the previous day is null", async () => {
        // given a current day with no lunch
        const givenCurrentDay = new WeekPlanDays('1234', '', '', '', new Date())

        // and a previousDay that is null
        const givenPreviousDay = null

        // and a component rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: givenPreviousDay,
                day: givenCurrentDay
            }
        })

        // when the lunch input trigger a keypress with a tab key
        const givenLunchInput = wrapper.findComponent('.lunch-input')
        await givenLunchInput.trigger('keyup.tab')

        // then the component should not have emitted a day-value-change event
        expect(wrapper.emitted()).not.toHaveProperty('day-value-change');
    })

    it("should not autofill if the previous supper does not start with the current dinner model", async () => {
        // given a previousDay with a supper
        const givenSupper = 'macaroni'
        const givenPreviousDay = new WeekPlanDays('1234', '', givenSupper, '', new Date())

        // given a current day with a lunch that is completely different then the supper.
        const givenDinner = 'soupe'
        const givenCurrentDay = new WeekPlanDays('1234', givenDinner, '', '', new Date())


        // and a component rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: givenPreviousDay,
                day: givenCurrentDay
            }
        })

        // when the lunch input trigger a keypress with a tab key
        const givenLunchInput = wrapper.findComponent('.lunch-input')
        await givenLunchInput.trigger('keyup.tab')

        // then the component should not have emitted a day-value-change event
        expect(wrapper.emitted()).not.toHaveProperty('day-value-change');
    })

    it("should autofill if the previous supper starts with the current dinner model", async () => {
        // given a previousDay with a supper
        const givenSupper = 'macaroni'
        const givenPreviousDay = new WeekPlanDays('1234', '', givenSupper, '', new Date())

        // given a current day with a lunch that is the beggining of the previous day supper
        const givenDinner = 'maca'
        const givenCurrentDay = new WeekPlanDays('1234', givenDinner, '', '', new Date())


        // and a component rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: givenPreviousDay,
                day: givenCurrentDay
            }
        })

        // when the lunch input trigger a keypress with a tab key
        const givenLunchInput = wrapper.findComponent('.lunch-input')
        await givenLunchInput.trigger('keyup.tab')

        // then the component should have emitted a day-value-change event
        expect(wrapper.emitted()).toHaveProperty('day-value-change');
        expect((wrapper.emitted<typeof WeekDayListGroup>('day-value-change') as string[][])[0][0]).toEqual(expect.objectContaining({
            dinner: givenSupper
        }))
    })

    it("should set the tab index depending on the current index", () => {
        // given a current index props set to 2
        const currentIndex = 2;

        // when rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(WeekDayListGroup, {
            global: {
                plugins: [i18n]
            },
            props: {
                previousDay: undefined,
                index: currentIndex,
                day: new WeekPlanDays('1234', '', '', '', new Date())
            }
        })

        // then the lunch input should have a tabindex of the givenindex * 3 + 1
        const givenLunchInput = wrapper.findComponent('.lunch-input')
        expect(givenLunchInput.attributes('tabindex')).toEqual("" + (currentIndex * 3 + 1))

        // and the dinner input should have a tab index of the given index * 3 + 2
        const givenSupperInput = wrapper.findComponent('.supper-input')
        expect(givenSupperInput.attributes('tabindex')).toEqual("" + (currentIndex * 3 + 2))


        // and the activities input should have a tab index of the given index * 3 + 3
        const givenActivitiesInput = wrapper.findComponent('.activities-input')
        expect(givenActivitiesInput.attributes('tabindex')).toEqual("" + (currentIndex * 3 + 3))

    })
})
