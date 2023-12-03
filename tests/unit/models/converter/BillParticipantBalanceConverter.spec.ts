import {BillParticipantBalanceConverter} from "@/models/converter/Bill/BillParticipantBalanceConverter";
import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import {faker} from "@faker-js/faker";

describe("BillParticipantBalanceConverter", () => {
    describe("fromFirestore", () => {
        it("should create BillParticipantBalance dto", () => {
            // given a payload
            const payload = {
                amount: 10,
                target: "irrelevent",
                currency: "cad"
            }

            // when creating object using dto
            const result = BillParticipantBalanceConverter.fromFirestore(payload);

            // then it should create a BillParticipantBalance object
            expect(result).toBeInstanceOf(BillParticipantBalance)
        })

        it("should define amount", () => {
            // given a payload with an amout
            const givenAmount = 309;

            const payload = {
                amount: givenAmount,
                target: "irrelevent",
                currency: "cad"
            }

            // when creating object using converter
            const result = BillParticipantBalanceConverter.fromFirestore(payload);

            // then it should have defined the amount
            expect(result.amount).toEqual(givenAmount)
        })

        it("should define the target", () => {
            // given a payload with a target
            const givenTarget = faker.string.uuid();

            const payload = {
                amount: 10,
                target: givenTarget,
                currency: "cad"
            }

            // when creating object using converter
            const result = BillParticipantBalanceConverter.fromFirestore(payload)

            // then it should have defined the target
            expect(result.target).toEqual(givenTarget);
        })

        it("should define currency", () => {
            // given a payload with a currency
            const givenCurrency = faker.finance.currencyCode();

            const payload = {
                amount: 10,
                target: "irrelevent",
                currency: givenCurrency
            }

            // when creating object using converter
            const result = BillParticipantBalanceConverter.fromFirestore(payload)

            // then it should have defined the currency
            expect(result.currency).toEqual(givenCurrency);
        })
    })
})
