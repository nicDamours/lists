import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {
    BillParticipantConverter,
    BillParticipantConverterPayload
} from "@/models/converter/Bill/BillParticipantConverter";
import {faker} from "@faker-js/faker";
import {BillParticipantBalanceConverter} from "@/models/converter/Bill/BillParticipantBalanceConverter";

describe("BillParticipantConverter", () => {
    describe("fromFirestore", () => {
        it("should create BillParticipant object", () => {
            // given a payload
            const payload: BillParticipantConverterPayload = {
                id: "irrelevent",
                email: "irrelevent"
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload)

            // then it should return a BillParticipant
            expect(result).toBeInstanceOf(BillParticipant)
        })

        it("should define id", () => {
            // given a payload with an id
            const givenId = "123";

            const payload = {
                id: givenId,
                email: "irrelevent"
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have defined the id
            expect(result.id).toEqual(givenId)
        })

        it("should define the email", () => {
            // given a payload with an email
            const givenEmail = "test@test.com";
            const payload = {
                id: "irrelevent",
                email: givenEmail
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have defined the email
            expect(result.email).toEqual(givenEmail)
        })

        it("should define the first name when present", () => {
            // given a payload with an first name
            const givenFirstName = faker.person.firstName();
            const payload = {
                id: "irrelevent",
                email: "irrelevent",
                first_name: givenFirstName
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have define the first name
            expect(result.firstName).toEqual(givenFirstName)
        })

        it("should define last name when present", () => {
            // given a payload with a last name
            const givenLastName = faker.person.lastName();
            const payload = {
                id: "irrelevent",
                email: "irrelevent",
                last_name: givenLastName
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have defined the last name
            expect(result.lastName).toEqual(givenLastName)
        })

        it("should define participant balance", () => {
            // given a payload with a participant's balance
            const givenBalancesCount = 2;
            const givenBalances = [];
            for (let i = 0; i < givenBalancesCount; i++) {
                givenBalances.push({
                    amount: 100,
                    target: "irrelevent",
                    currency: "cad"
                })
            }

            const payload = {
                id: "irrelevent",
                email: "irrelevent",
                balances: givenBalances
            }

            // and a mock of the BillParticipantBalanceConverter
            BillParticipantBalanceConverter.fromFirestore = jest.fn().mockReturnValue(new Array(givenBalancesCount).fill({}));

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then the BillParticipantBalance converter should have been called
            expect(BillParticipantBalanceConverter.fromFirestore).toHaveBeenCalledTimes(givenBalancesCount)

            // then the result's balance should contain the balances;
            expect(result.balances).toHaveLength(givenBalancesCount);
        })
    })
})
