import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import * as useBillsGroups from "@/composable/bills/use-bills-groups";
import * as useAuthentication from "@/composable/use-authentication";
import {mockComposable, setComposableValue} from "../../../utils/mock-composable";
import {flushPromises, mount} from "@vue/test-utils";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";
import {IonContent, IonHeader, IonTitle} from "@ionic/vue";
import BillGroupView from "@/views/BillGroupView.vue";
import {useRoute} from "vue-router";
import BillBalanceSummary from "@/components/Bills/BillBalanceSummary.vue";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import {ref} from "vue";
import BillTransactionList from "@/components/Bills/BillTransactionList.vue";
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";

mockComposable("@/composable/bills/use-bills-groups");
mockComposable("@/composable/use-authentication");
jest.mock('vue-router', () => ({
    useRoute: jest.fn()
}))

describe("BillGroupView", () => {
    afterEach(() => {
        jest.resetAllMocks()
    });

    it("should display group name in the header", () => {
        // given a group with a name
        const givenGroupName = "someGroupName";
        const givenGroup = new BillGroup("123");
        givenGroup.name = givenGroupName;

        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];

        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })

        setComposableValue(useAuthentication, {
            currentUser: ref({
                uid: currentParticipantId
            })
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // then the header should contain the group name
        const headerTitleComponent = wrapper.getComponent(IonContent).getComponent(IonHeader).getComponent(IonTitle);

        expect(headerTitleComponent.text()).toEqual(givenGroupName);
    })

    it("should contain a balance component", () => {
        // given a group
        const givenGroupName = "someGroupName";
        const givenGroup = new BillGroup("123");
        givenGroup.name = givenGroupName;

        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];


        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })

        setComposableValue(useAuthentication, {
            currentUser: ref({
                uid: currentParticipantId
            })
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // then a group balance component should be present
        const balanceComponent = wrapper.findComponent(BillBalanceSummary)

        expect(balanceComponent.exists()).toEqual(true);
    });

    it("should pass the group to the bill balance summary", () => {
        // given a group
        const givenGroupId = "1231231";
        const givenGroup = new BillGroup(givenGroupId);

        // and a current participant for this group with a balance
        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];

        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })

        // and a mock of the current user
        setComposableValue(useAuthentication, {
            currentUser: ref({uid: currentParticipantId})
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // then the group balance component should have a props with the given group
        const balanceComponent = wrapper.getComponent(BillBalanceSummary)

        expect(balanceComponent.props('balances')).toEqual(currentParticipant.balances);
    })

    it("should contain a bill group transaction list component", () => {
        // given a group
        const givenGroupId = "1231231";
        const givenGroup = new BillGroup(givenGroupId);

        // and a current participant for this group with a balance
        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];

        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })

        // and a mock of the current user
        setComposableValue(useAuthentication, {
            currentUser: ref({uid: currentParticipantId})
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // then there should be a bill transaction list component
        const billTransactionListComponent = wrapper.findComponent(BillTransactionList);

        expect(billTransactionListComponent.exists()).toEqual(true);
    })

    it("should pass the current bill transaction list to the transaction list component", () => {
        // given a group
        const givenGroupId = "1231231";
        const givenGroup = new BillGroup(givenGroupId);

        // and a current participant for this group with a balance
        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];

        // and a few transaction for this group
        const givenTransactionsCount = 4;

        const transactions = [];
        for (let i = 0; i < givenTransactionsCount; i++) {
            transactions.push(new BillTransaction("irrelevent"))
        }

        givenGroup.transactions = transactions;

        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })

        // and a mock of the current user
        setComposableValue(useAuthentication, {
            currentUser: ref({uid: currentParticipantId})
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // then the bill transaction list component should contains the current group transaction
        const billTransactionListComponent = wrapper.getComponent(BillTransactionList);

        expect(billTransactionListComponent.props('transactions').length).toEqual(givenTransactionsCount);
    });

    it("should fetch next transaction page when list trigger a 'page-change' event", async () => {
        // given a group
        const givenGroupId = "1231231";
        const givenGroup = new BillGroup(givenGroupId);

        // and a current participant for this group with a balance
        const currentParticipantId = "123123ad";
        const currentParticipant = new BillParticipant(currentParticipantId, "irrelevent");
        currentParticipant.balances = [
            new BillParticipantBalance(123, "123123", "CAD")
        ]

        givenGroup.participants = [currentParticipant];

        // and a few transaction for this group
        const givenTransactionsCount = 4;

        const transactions = [];
        for (let i = 0; i < givenTransactionsCount; i++) {
            transactions.push(new BillTransaction("irrelevent"))
        }

        givenGroup.transactions = transactions;

        // and a mock of the getGroupById that returns that group
        const fetchTransactionsFn = jest.fn().mockResolvedValue([]);

        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock,
            fetchTransactions: fetchTransactionsFn
        })

        // and a mock of the current user
        setComposableValue(useAuthentication, {
            currentUser: ref({uid: currentParticipantId})
        })

        // and a current route containing the group's id
        const mockedRoute = jest.mocked(useRoute, {shallow: true});

        mockedRoute.mockImplementationOnce(() => {
            return {
                name: "irrelevent",
                matched: [],
                hash: "",
                meta: {},
                path: "",
                fullPath: "",
                query: {},
                redirectedFrom: undefined,
                params: {
                    id: givenGroup.id
                }
            }
        })

        // and a component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillBalanceSummary: true,
                    BillTransactionList: true,
                }
            }
        })

        // when the BillTransactionList component triggers a "page-change" event
        const billTransactionListComponent = wrapper.getComponent(BillTransactionList);

        await billTransactionListComponent.trigger('page-change');
        await flushPromises();

        // then fetchTransactions function should have been called
        expect(fetchTransactionsFn).toHaveBeenCalled()
    })
})
