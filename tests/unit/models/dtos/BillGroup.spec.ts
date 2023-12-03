import {BillParticipantBalance} from "@/models/dtos/Bills/BillParticipantBalance";
import {faker} from "@faker-js/faker";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";

describe("BillGroup", () => {
    describe("getBalance", () => {
        it("should return the sum of all balance for the current user", () => {
            // given a current participant with some balance
            const givenCurrentParticipantBalances = [
                new BillParticipantBalance(100, "irrelevent", "cad"),
                new BillParticipantBalance(-50, "irrelevent", "cad"),
                new BillParticipantBalance(23, "irrelevent", "cad"),
                new BillParticipantBalance(0, "irrelevent", "cad"),
            ]

            const currentParticipant = new BillParticipant(faker.string.uuid(), "test@test.com");
            currentParticipant.balances = givenCurrentParticipantBalances;

            // and a group with the current participant
            const givenGroup = new BillGroup("irrelevent");
            givenGroup.participants = [currentParticipant];

            // when fetching balance
            const result = givenGroup.getBalanceForParticipant(currentParticipant.id);

            // then it should return the sum of the balance for the given participant
            const expectedResult = givenCurrentParticipantBalances.map(bal => bal.amount).reduce((col, item) => col += item, 0);

            expect(result).toEqual(expectedResult);
        });

        it("should only consider requested particiant's balance", () => {
            // given multiple participant with some balance
            const otherParticipant = new BillParticipant("irrelevent", "irrelevent");
            otherParticipant.balances = [
                new BillParticipantBalance(100, "irrelevent", "cad"),
            ]

            // and a requested participant with some balance
            const currentParticipant = new BillParticipant(faker.string.uuid(), "test@test.com");
            currentParticipant.balances = [
                new BillParticipantBalance(-923, "irrelevent", "cad"),
            ];

            // and a bill group with both participant
            const billGroup = new BillGroup("irrelevent");
            billGroup.participants = [
                otherParticipant,
                currentParticipant
            ];

            // when fetching balance for the current participant
            const result = billGroup.getBalanceForParticipant(currentParticipant.id);

            // then it should not consider the other participant balance
            expect(result).toEqual(currentParticipant.balances[0].amount);
        });
    });
});
