import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {BillGroupConverter} from "@/models/converter/Bill/BillGroupConverter";
import {DocumentSnapshotMock} from "../../../utils/DocumentSnapshotMock";
import {faker} from "@faker-js/faker";
import {BillParticipantConverter} from "@/models/converter/Bill/BillParticipantConverter";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

describe("BillGroupConverter", () => {
    describe("from firestore", () => {
        it("should create a BillGroup object", () => {
            // given a payload
            const payload = {
                id: "irrelevent"
            }

            // when using converter to create object
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillGroupConverter.fromFirestore(querySnapshot);

            // then it should return a BillGroup
            expect(result).toBeInstanceOf(BillGroup)
        })

        it("should define id", () => {
            // given a payload with an id
            const givenId = "123";
            const payload = {
                id: givenId,
            }

            // when using converter to create object
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillGroupConverter.fromFirestore(querySnapshot);

            // then it should have defined the id on the object
            expect(result.id).toEqual(givenId);
        })

        it("should define group name", () => {
            // given a payload with a name
            const givenName = "Some group";

            const payload = {
                id: "irrelevent",
                name: givenName
            }

            // when using converter to create object
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillGroupConverter.fromFirestore(querySnapshot);

            // then it should have defined the name on the object
            expect(result.name).toEqual(givenName);
        })

        it("should define participant", () => {
            // given a payload with some participant
            const givenParticipantCount = 3;

            const payload: Record<string, any> = {
                id: "irrelevent",
                participants: []
            }

            for (let i = 0; i < givenParticipantCount; i++) {
                payload.participants.push({
                    id: faker.string.uuid(),
                    email: faker.internet.email(),
                    first_name: faker.person.firstName(),
                    last_name: faker.person.lastName()
                })
            }

            // and a mock of the BillParticipantConverter
            BillParticipantConverter.fromFirestore = jest.fn().mockReturnValue(new Array(givenParticipantCount).fill({}))

            // when creating dto using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillGroupConverter.fromFirestore(querySnapshot);

            // then the participant converter should have been call
            expect(BillParticipantConverter.fromFirestore).toHaveBeenCalledTimes(givenParticipantCount)

            // and the participants should have been defined on the Bill group
            expect(result.participants).toHaveLength(givenParticipantCount)
        })
    })
    describe("to firestore", () => {
        it("should send the name", () => {
            // given a BillGroup object with a name
            const givenName = "some name";

            const givenGroup = new BillGroup("irrelevent");
            givenGroup.name = givenName;

            // when send data to firestore using converter
            const payload = BillGroupConverter.toFirestore(givenGroup);

            // then it should contain the name
            expect(payload).toHaveProperty('name');
            expect(payload.name).toEqual(givenName)
        });

        it("should format participants as an array of ids", () => {
            // given a group with some participants
            const givenParticipantsCount = 3;
            const givenParticipants = new Array(givenParticipantsCount).fill(undefined).map(() => new BillParticipant(faker.string.uuid(), faker.internet.email()));

            const givenGroup = new BillGroup("123");
            givenGroup.participants = givenParticipants;

            // when send data to firestore using converter
            const payload = BillGroupConverter.toFirestore(givenGroup);

            // then it should contain the participants
            expect(payload).toHaveProperty('participants');

            // and the participants should be formatted as an array of ids
            expect(payload.participants).toHaveLength(givenParticipantsCount);

            for (const participant of givenParticipants) {
                expect(payload.participants).toContain(participant.id);
            }
        })
    })
})
