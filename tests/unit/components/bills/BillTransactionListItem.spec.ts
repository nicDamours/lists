import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {mount} from "@vue/test-utils";
import BillTransactionListItem from "@/components/Bills/BillTransactionListItem.vue";
import {format} from "date-fns";

describe("BillTransactionListItem", () => {
    it("should show the transaction date", () => {
        // given a bill transaction with a date
        const givenDate = new Date(2023, 4, 6);
        const givenTransaction = new BillTransaction("123123");
        givenTransaction.date = givenDate

        // when rendering the component
        const wrapper = mount(BillTransactionListItem, {
            props: {
                transaction: givenTransaction
            }
        })

        // then the date should be visible
        const transactionDateComponent = wrapper.find('.transaction-date');

        expect(transactionDateComponent.exists()).toEqual(true)

        // and the date should be formatted correctly
        const expectedDateFormat = format(givenDate, "MMM d");

        expect(transactionDateComponent.text()).toEqual(expectedDateFormat)
    })

    it("should show the description of the transaction", () => {
        // given a bill transaction with a description
        const givenDate = new Date(2023, 4, 6);
        const givenDescription = "some description";

        const givenTransaction = new BillTransaction("123123");
        givenTransaction.date = givenDate
        givenTransaction.description = givenDescription

        // when rendering the component
        const wrapper = mount(BillTransactionListItem, {
            props: {
                transaction: givenTransaction
            }
        })

        // then the description should be visible
        const transactionDescriptionComponent = wrapper.find('.transaction-description');

        expect(transactionDescriptionComponent.exists()).toEqual(true)

        // and the description should contain the given description
        expect(transactionDescriptionComponent.text()).toEqual(givenDescription)
    })
})
