import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import BillGroupItem from "@/components/Bills/BillGroupItem.vue";
import {mount} from "@vue/test-utils";
import {IonText} from "@ionic/vue";
import {faker} from "@faker-js/faker";

const composableFnMock = jest.fn();

const useAuthenticationMock = jest.mock("@/composable/use-authentication", () => composableFnMock);
describe("BillGroupItem", () => {

    it("should contain bill group name", () => {
        // given a bill group with a name
        const givenName = "some name"
        const givenGroup = new BillGroup("id");
        givenGroup.name = givenName;

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: givenGroup
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

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
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

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
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

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
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

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: billGroup
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

        composableFnMock.mockImplementationOnce(() => {
            return {
                currentUser: {
                    value: currentUser
                }
            }
        })

        // and a group
        const givenGroup = new BillGroup("irrelevent");
        const getBalanceForParticipantSpy = jest.spyOn(givenGroup, 'getBalanceForParticipant');

        // when rendering the component
        const wrapper = mount(BillGroupItem, {
            props: {
                group: givenGroup
            }
        })

        // then the balance function should have been called with the current user
        expect(getBalanceForParticipantSpy).toHaveBeenCalledWith(givenCurrentUserId)
    })
})
