import {mount} from "@vue/test-utils";
import NewBillGroupFabButton from "@/components/Bills/NewBillGroupFabButton.vue";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";
import {IonFabButton} from "@ionic/vue";
import {mockComposable, setComposableValue} from "../../../utils/mock-composable";
import * as useConfirm from "@/composable/use-confirm";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import * as useAuthentication from "@/composable/use-authentication";
import {ref} from "vue";

mockComposable("@/composable/use-confirm")
mockComposable("@/composable/use-authentication")
describe("NewBillGroupFabButton", () => {
    it("should prompt a name input when clicking on the new group button", async () => {
        // given a mock of the useConfirm composable
        const confirmWithInputSpy = jest.fn().mockResolvedValue("test");

        setComposableValue(useConfirm, {
            showConfirmWithInput: confirmWithInputSpy
        })

        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123", email: "etst"})
        })

        // and a component
        const wrapper = mount(NewBillGroupFabButton, {
            global: {
                plugins: [getMockI18nPlugin()]
            }
        });

        // when clicking on the button
        const fabButton = wrapper.getComponent(IonFabButton);

        await fabButton.trigger('click');

        // then a prompt with input should have been shown
        expect(confirmWithInputSpy).toHaveBeenCalledTimes(1);
    });

    it("should trigger an event 'create-group' when clicking on button", async () => {
        // given a mock of the useConfirm composable
        const confirmWithInputSpy = jest.fn().mockResolvedValue(true);

        setComposableValue(useConfirm, {
            showConfirmWithInput: confirmWithInputSpy
        })

        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123", email: "etst"})
        })

        // and a component
        const wrapper = mount(NewBillGroupFabButton, {
            global: {
                plugins: [getMockI18nPlugin()]
            }
        });

        // when clicking on the button
        const fabButton = wrapper.getComponent(IonFabButton);

        await fabButton.trigger('click');

        // then a 'create-group' event should have been emitted from the wrapper
        expect(wrapper.emitted()).toHaveProperty('create-group');

        // and the event value should be a new BillGroup
        expect(wrapper.emitted<Array<Array<any>>>()['create-group'][0][0]).toBeInstanceOf(BillGroup)
    })

    it("should set the new group name", async () => {
        // given a mock of the useConfirm composable
        const confirmWithInputSpy = jest.fn().mockResolvedValue(true);

        setComposableValue(useConfirm, {
            showConfirmWithInput: confirmWithInputSpy
        })

        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123", email: "etst"})
        })

        // and a component
        const wrapper = mount(NewBillGroupFabButton, {
            global: {
                plugins: [getMockI18nPlugin()]
            }
        });

        // when clicking on the button
        const fabButton = wrapper.getComponent(IonFabButton);

        await fabButton.trigger('click');

        // then the created group's name should be set
        const createdGroup = wrapper.emitted<Array<BillGroup>>()['create-group'][0][0];

        expect(createdGroup.name).not.toBeNull()
    })

    it("should create a new participant with the current user on the created group", async () => {
        // given a mock of the useConfirm composable
        const confirmWithInputSpy = jest.fn().mockResolvedValue(true);

        setComposableValue(useConfirm, {
            showConfirmWithInput: confirmWithInputSpy
        })

        // and a mock of the current user
        const givenCurrentUserID = "23098123";
        setComposableValue(useAuthentication, {
            currentUser: ref({id: givenCurrentUserID, email: "etst"})
        })

        // and a component
        const wrapper = mount(NewBillGroupFabButton, {
            global: {
                plugins: [getMockI18nPlugin()]
            }
        });

        // when clicking on the button
        const fabButton = wrapper.getComponent(IonFabButton);

        await fabButton.trigger('click');

        // then the created group should contain a participant
        const createdGroup = wrapper.emitted<Array<BillGroup>>()['create-group'][0][0];

        expect(createdGroup.participants).toHaveLength(1);

        // and the participant should be the current user
        expect(createdGroup.participants[0].id).toEqual(givenCurrentUserID);
    })
})
