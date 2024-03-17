import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {mount} from "@vue/test-utils";
import BillTransactionList from "@/components/Bills/BillTransactionList.vue";
import BillTransactionListItem from "@/components/Bills/BillTransactionListItem.vue";
import {faker} from "@faker-js/faker";
import {mockComposable} from "../../../utils/mock-composable";
import PaginationTrigger from "@/components/PaginationTrigger.vue";

mockComposable("@vueuse/core")

describe("BillTransactionList", () => {
    it("should display a list of BillTransactionListItem", () => {
        // given a list of bill transactions
        const givenTransactionsCount = 5;
        const givenTransactions = [];

        for (let i = 0; i < givenTransactionsCount; i++) {
            givenTransactions.push(new BillTransaction(faker.string.uuid()))
        }

        // when rendering the component
        const wrapper = mount(BillTransactionList, {
            props: {
                transactions: givenTransactions
            },
            global: {
                stubs: {
                    PaginationTrigger: true,
                }
            }
        })

        // then it should show one BillTransactionListItem per transaction in props
        const billTransactionsListItemComponents = wrapper.findAllComponents(BillTransactionListItem);

        expect(billTransactionsListItemComponents.length).toEqual(givenTransactionsCount)
    })

    it("should pass the current transaction to the BillTransactionListItem", () => {
        // given one single transaction
        const givenTransaction = new BillTransaction(faker.string.uuid());

        // when rendering the component
        const wrapper = mount(BillTransactionList, {
            props: {
                transactions: [givenTransaction]
            },
            global: {
                stubs: {
                    PaginationTrigger: true,
                }
            }
        })

        // then it should have passed the transaction to the BillTransactionListItem component
        const billTransactionsListItemComponent = wrapper.getComponent(BillTransactionListItem);

        expect(billTransactionsListItemComponent.props('transaction')).toEqual(givenTransaction)
    });

    it("should add the pagination trigger when the number of transaction exceed the defined threshold.", () => {
        // given more transactions than the defined threshold
        const givenPaginationThreshold = 30;
        const givenTransactionsCount = givenPaginationThreshold + 5;
        const givenTransactions = [];

        for (let i = 0; i < givenTransactionsCount; i++) {
            givenTransactions.push(new BillTransaction(faker.string.uuid()))
        }

        // when rendering the component
        const wrapper = mount(BillTransactionList, {
            props: {
                transactions: givenTransactions
            },
            global: {
                stubs: {
                    PaginationTrigger: true,
                }
            }
        })

        // then there should be a pagination trigger element
        const paginationTriggerElement = wrapper.findComponent(PaginationTrigger);
        expect(paginationTriggerElement.exists()).toEqual(true);
    });

    it("should not show the pagination trigger if there's less than the pagination trigger in the page", () => {
        // given less transactions than the defined threshold
        const givenPaginationThreshold = 30;
        const givenTransactionsCount = givenPaginationThreshold - 5;
        const givenTransactions = [];

        for (let i = 0; i < givenTransactionsCount; i++) {
            givenTransactions.push(new BillTransaction(faker.string.uuid()))
        }

        // when rendering the component
        const wrapper = mount(BillTransactionList, {
            props: {
                transactions: givenTransactions
            },
            global: {
                stubs: {
                    PaginationTrigger: true,
                }
            }
        })

        // then there should be a pagination trigger element
        const paginationTriggerElement = wrapper.findComponent(PaginationTrigger);
        expect(paginationTriggerElement.exists()).toEqual(false);
    })

    it("should trigger a 'page-change' when the PaginationTrigger triggers a 'page-change' event", async () => {
        // given more transactions than the defined threshold
        const givenPaginationThreshold = 30;
        const givenTransactionsCount = givenPaginationThreshold + 5;
        const givenTransactions = [];

        for (let i = 0; i < givenTransactionsCount; i++) {
            givenTransactions.push(new BillTransaction(faker.string.uuid()))
        }

        // and a component
        const wrapper = mount(BillTransactionList, {
            props: {
                transactions: givenTransactions
            }
        })

        // when the PaginationTrigger component triggers a 'page-change' event
        const paginationTriggerComponent = wrapper.getComponent(PaginationTrigger);

        await paginationTriggerComponent.trigger('page-change');

        // then the wrapper should have triggered a 'page-change' event
        expect(wrapper.emitted()).toHaveProperty('page-change')
    })
})
