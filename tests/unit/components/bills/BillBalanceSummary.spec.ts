import {mount} from "@vue/test-utils";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import BillBalanceSummary from "@/components/Bills/BillBalanceSummary.vue";

describe("BillBalanceSummary", () => {
    it("should display a settled up message when group balances is empty", () => {
        // given a balances props that is empty
        const givenBalances = new Array<BillParticipantBalance>();

        // when rendering the component

        // when rendering the component
        const wrapper = mount(BillBalanceSummary, {
            props: {
                balances: givenBalances
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then it should show a settled up message
        const balanceSummaryTextComponent = wrapper.getComponent('.o-bill-balances-summary__text');

        expect(balanceSummaryTextComponent.text()).toContain("settledUp");
    });

    it("should display settled up text if balances are not empty but sums up to 0", () => {
        // given a balances props with some balances that sums up to 0
        const givenBalances = [
            new BillParticipantBalance(30, "123123", "CAD"),
            new BillParticipantBalance(-20, "123123", "CAD"),
            new BillParticipantBalance(-15, "123123", "CAD"),
            new BillParticipantBalance(5, "123123", "CAD"),
            new BillParticipantBalance(0, "123123", "CAD"),
        ];

        // when rendering the component

        // when rendering the component
        const wrapper = mount(BillBalanceSummary, {
            props: {
                balances: givenBalances
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then it should show a settled up message
        const balanceSummaryTextComponent = wrapper.getComponent('.o-bill-balances-summary__text');

        expect(balanceSummaryTextComponent.text()).toContain("settledUp");
    })

    it("should display the balance if not 0", () => {
        // given a balances props with some balances that sums up to not 0
        const givenBalances = [
            new BillParticipantBalance(30, "123123", "CAD"),
            new BillParticipantBalance(-20, "456456", "CAD"),
        ];

        // when rendering the component
        const wrapper = mount(BillBalanceSummary, {
            props: {
                balances: givenBalances
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then it should show the balances
        const balanceSummaryTextComponent = wrapper.getComponent('.o-bill-balances-summary__text');

        expect(balanceSummaryTextComponent.text()).toContain("10");
    })

    it("should add class 'positive' when balance sum is positive", () => {
        // given a balances props with some balances that sums up to a positive number
        const givenBalances = [
            new BillParticipantBalance(30, "123123", "CAD"),
            new BillParticipantBalance(-20, "456456", "CAD"),
        ];

        // when rendering the component
        const wrapper = mount(BillBalanceSummary, {
            props: {
                balances: givenBalances
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the text should contain the class '--positive'
        const balanceSummaryTextComponent = wrapper.getComponent('.o-bill-balances-summary__text');

        expect(balanceSummaryTextComponent.classes()).toContain('--positive');
    })

    it("should add class 'negative' when balance sum is negative", () => {
        // given a balances props with some balances that sums up to a negative number
        const givenBalances = [
            new BillParticipantBalance(-30, "123123", "CAD"),
            new BillParticipantBalance(-20, "456456", "CAD"),
        ];

        // when rendering the component
        const wrapper = mount(BillBalanceSummary, {
            props: {
                balances: givenBalances
            },
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the text should contain the class '--negative'
        const balanceSummaryTextComponent = wrapper.getComponent('.o-bill-balances-summary__text');

        expect(balanceSummaryTextComponent.classes()).toContain('--negative');
    })
})
