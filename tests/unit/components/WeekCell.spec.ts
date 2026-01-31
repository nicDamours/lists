import {mount} from "@vue/test-utils";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";
import {IonTextarea} from "@ionic/vue";
import WeekCell from "@/components/week/WeekCell.vue";
import {nextTick} from "vue";

describe("WeekCell", () => {
    it("should pass the placeholder props to the text area", () => {
        // given a placeholder value
        const givenPlaceholder = 'SomePlaceHolder';

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekCell, {
            global: {
                plugins: [i18n]
            },
            props: {
                content: 'someContent',
                placeholder: givenPlaceholder
            }
        })

        // then it should have passed the placeholder to the text area
        const textareaComponent = wrapper.findComponent(IonTextarea)
        expect(textareaComponent.props('placeholder')).toBe(givenPlaceholder);
    })

    it("should emit a focus event when the text area is focused", async () => {
        // given a component
        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekCell, {
            global: {
                plugins: [i18n]
            },
            props: {
                content: 'someContent',
            }
        })

        // when the textarea component emits a focus event
        const textareaComponent = wrapper.findComponent(IonTextarea)
        await textareaComponent.trigger('ion-focus');

        // then the component should have triggered a focus event
        expect(wrapper.emitted()).toHaveProperty('focus');
    })

    it("should set the value as the placeholder when using tab and content is empty", async () => {
        // given a placeholder value
        const givenPlaceholder = 'SomePlaceHolder';

        // and no content
        const givenContent = '';

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekCell, {
            global: {
                plugins: [i18n]
            },
            props: {
                content: givenContent,
                placeholder: givenPlaceholder
            }
        })

        // when using tab while focus on the component
        const textareaComponent = wrapper.findComponent(IonTextarea)
        await textareaComponent.trigger('keydown.tab')
        await nextTick()

        // then the component should have emitted a 'change' event with the placeholder value
        expect(wrapper.emitted()).toHaveProperty('change');
        expect(wrapper.emitted<string[][]>('change')?.[0][0]).toEqual(givenPlaceholder);
    })

    it("should not set the value as the placeholder when the content is not empty", async () => {
        // given a placeholder value
        const givenPlaceholder = 'SomePlaceHolder';

        // and some content
        const givenContent = 'someContent';

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(WeekCell, {
            global: {
                plugins: [i18n]
            },
            props: {
                content: givenContent,
                placeholder: givenPlaceholder
            }
        })

        // when using tab while focus on the component
        const textareaComponent = wrapper.findComponent(IonTextarea)
        await textareaComponent.trigger('keydown.tab')
        await nextTick()

        // then the component should not have emitted a change event
        expect(wrapper.emitted()).not.toHaveProperty('change');

    })
})