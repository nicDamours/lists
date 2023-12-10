import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import BillGroupItem from "@/components/Bills/BillGroupItem.vue";
import {mount} from "@vue/test-utils";
import {IonItemOption, IonText} from "@ionic/vue";
import {faker} from "@faker-js/faker";
import {mockComposable, setComposableValue} from "../../../utils/mock-composable";
import * as useAuthentication from "@/composable/use-authentication"
import {ref} from "vue";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";

mockComposable("@/composable/use-authentication")

describe("BillGroupItem", () => {

    it("should contain bill group name", () => {
        // given a current user
        const currentParticipant = new BillParticipant("123", "irrelevent");

        // given a bill group with a name
        const givenName = "some name"
        const givenGroup = new BillGroup("id");
        givenGroup.name = givenName;
        givenGroup.participants = [currentParticipant];

        // and a current user
        setComposableValue(useAuthentication, {
            currentUser: ref({id: currentParticipant.id})
        })

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: givenGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then it should display the group name
        const groupNameComponent = wrapper.getComponent(IonText);

        expect(groupNameComponent.text()).toEqual(givenName);
    })

    it("should display balance for group", () => {
        // given a mock of the group object with a balance
        const givenBalance = 100;
        const billGroup = new BillGroup("irrelevent");

        jest.spyOn(billGroup, 'getBalanceForParticipant')
            .mockImplementation(() => {
                return givenBalance;
            })

        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123"})
        })

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the balance should be displayed at the end of the line
        const balanceComponent = wrapper.get('.m-group-item__balance');

        expect(balanceComponent.text()).toContain(`${givenBalance}`)
    })

    it("should set class 'negative' when balance is negative", () => {
        // given a mock of the group object with a negative balance
        const givenBalance = -100;
        const billGroup = new BillGroup("irrelevent");

        jest.spyOn(billGroup, 'getBalanceForParticipant')
            .mockImplementation(() => {
                return givenBalance;
            })


        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123"})
        })

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the balance component should contain the class "negative"
        const balanceComponent = wrapper.get('.m-group-item__balance');

        expect(balanceComponent.classes()).toContain('negative')
    })

    it("should set class 'positive' when balance is positive", () => {
        // given a mock of the group object with a positive balance
        const givenBalance = 100;
        const billGroup = new BillGroup("irrelevent");

        jest.spyOn(billGroup, 'getBalanceForParticipant')
            .mockImplementation(() => {
                return givenBalance;
            })


        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123"})
        })

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the balance component should contain the class "positive"
        const balanceComponent = wrapper.get('.m-group-item__balance');

        expect(balanceComponent.classes()).toContain('positive')
    })


    it("should set class 'neutral' when balance is 0", () => {
        // given a mock of the group object with a balance equals to 0
        const givenBalance = 0;
        const billGroup = new BillGroup("irrelevent");

        jest.spyOn(billGroup, 'getBalanceForParticipant')
            .mockImplementation(() => {
                return givenBalance;
            })


        setComposableValue(useAuthentication, {
            currentUser: ref({id: "123"})
        })

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the balance component should contain the class "neutral"
        const balanceComponent = wrapper.get('.m-group-item__balance');

        expect(balanceComponent.classes()).toContain('neutral')
    })

    it("should show balance of connected user", () => {
        // given a connected user
        const givenCurrentUserId = faker.string.uuid();
        const currentUser = {id: givenCurrentUserId}

        // and a current user
        setComposableValue(useAuthentication, {
            currentUser: ref(currentUser)
        })

        // and a group
        const givenGroup = new BillGroup("irrelevent");
        const getBalanceForParticipantSpy = jest.spyOn(givenGroup, 'getBalanceForParticipant').mockImplementationOnce(() => {
            return 10;
        });

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: givenGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the balance function should have been called with the current user
        expect(getBalanceForParticipantSpy).toHaveBeenCalledWith(givenCurrentUserId)
    });

    it("should trigger 'delete' event when clicking on delete button", async () => {
        // given a current user
        const currentParticipant = new BillParticipant("123", "irrelevent");

        // given a bill group with a name
        const givenName = "some name"
        const givenGroup = new BillGroup("id");
        givenGroup.name = givenName;
        givenGroup.participants = [currentParticipant];

        // and a current user
        setComposableValue(useAuthentication, {
            currentUser: ref({id: currentParticipant.id})
        })

        // and a component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: givenGroup
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // when clicking on the delete sliding option
        const deleteSlidingOptionComponent = wrapper.getComponent(IonItemOption);

        await deleteSlidingOptionComponent.trigger('click');

        // then the component should have triggered a "delete" event
        expect(wrapper.emitted()).toHaveProperty('delete');
    })
})
