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
                uid: "irrelevent",
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
                uid: givenId,
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
                uid: "irrelevent",
                email: givenEmail
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have defined the email
            expect(result.email).toEqual(givenEmail)
        })

        it("should define the display anme when present", () => {
            // given a payload with a display name
            const givenDisplayName = faker.person.firstName();
            const payload = {
                uid: "irrelevent",
                email: "irrelevent",
                display_name: givenDisplayName
            }

            // when creating object using converter
            const result = BillParticipantConverter.fromFirestore(payload);

            // then it should have define the display name
            expect(result.displayName).toEqual(givenDisplayName)
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
                uid: "irrelevent",
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

    describe("toFirestore", () => {
        it("should contain id", () => {
            // given a billParticipant with an id
            const givenId = "123";
            const givenBillParticipant = new BillParticipant(givenId, "test@test.com");


            // when sending data using converter
            const payload = BillParticipantConverter.toFirestore(givenBillParticipant)

            // then it should send the id
            expect(payload).toHaveProperty("id");
            expect(payload.id).toEqual(givenId)
        })

        it("should contain email", () => {
            // given a billParticipant with an email
            const givenEmail = "test@test.com";
            const givenBillParticipant = new BillParticipant("123", givenEmail);


            // when sending data using converter
            const payload = BillParticipantConverter.toFirestore(givenBillParticipant)

            // then it should send the email
            expect(payload).toHaveProperty("email");
            expect(payload.email).toEqual(givenEmail)
        })

        it("should contain display name", () => {
            // given a billParticipant with a display name
            const givenDisplayName = "jon doe";
            const givenBillParticipant = new BillParticipant("123", "test@test.com");
            givenBillParticipant.displayName = givenDisplayName;


            // when sending data using converter
            const payload = BillParticipantConverter.toFirestore(givenBillParticipant)

            // then it should send the display name
            expect(payload).toHaveProperty("displayName");
            expect(payload.displayName).toEqual(givenDisplayName)
        })
    })
})
