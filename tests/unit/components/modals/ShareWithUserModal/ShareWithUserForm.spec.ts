import ShareWithUserForm from "@/components/modal/ShareWithUserModal/ShareWithUserForm.vue";
import {mount} from "@vue/test-utils"
import useFakeI18n from "../../../../utils/modifiers/use-fake-i18n";
import {mockComposable, setComposableValue} from "@tests/utils/mock-composable";
import * as useCurrentUser from "@/composable/use-current-user";

mockComposable("@/composable/use-current-user");

describe("ShareWithUserForm", () => {
    it("should emit a submit event when form is submitted", async () => {
        // given a component
        const {i18n} = useFakeI18n();

        setComposableValue(useCurrentUser, {
            getCurrentUser: jest.fn()
        })

        const wrapper = mount(ShareWithUserForm, {
            global: {
                plugins: [i18n]
            },
            props: {
                headerText: "irrelevent"
            }
        });

        // when the form is submitted
        const givenForm = wrapper.find('.o-form');
        await givenForm.trigger('submit');

        // then the component should have emitted a "submit" event
        expect(wrapper.emitted()).toHaveProperty('submit')
    })
})
