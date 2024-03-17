import {BillTransactionConverter} from "@/models/converter/Bill/BillTransactionConverter";
import {DocumentSnapshotMock} from "../../../utils/DocumentSnapshotMock";
import {BillTransaction} from "@/models/dtos/Bills/BillTransaction";
import {Timestamp} from "firebase/firestore";
import {BillSplitType} from "@/models/enums/BillSplitType";
import {BillParticipantConverter} from "@/models/converter/Bill/BillParticipantConverter";
import {BillParticipant} from "@/models/dtos/Bills/BillParticipant";

describe("BillTransactionConverter", () => {
    describe("from Firestore", () => {
        it("should create a bill DTO", () => {
            // given a payload
            const payload = {};

            // when creating dto using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should return a Bill
            expect(result).toBeInstanceOf(BillTransaction);
        })

        it("should define the id", () => {
            // given a payload with an id
            const givenID = "123";

            const payload = {
                id: givenID,
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the id
            expect(result.id).toEqual(givenID);
        })

        it("should define description", () => {
            // given a payload with a description
            const givenDescription = "some description";

            const payload = {
                id: "irrelevent",
                description: givenDescription
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the description
            expect(result.description).toEqual(givenDescription);
        })

        it("should define the amount", () => {
            // given a payload with an amount
            const givenAmount = 123;

            const payload = {
                id: "irrelevent",
                description: "irrelevent",
                amount: givenAmount
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the amount
            expect(result.amount).toEqual(givenAmount);
        })

        it("should define currency", () => {
            // given a payload with a currency
            const givenCurrency = "cad";

            const payload = {
                id: "irrelevent",
                description: "irrelevent",
                currency: givenCurrency
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the currency
            expect(result.currency).toEqual(givenCurrency);
        })

        it("should define the date", () => {
            // given a payload with a date as a number
            const givenDate = new Timestamp(1701618480, 0)

            const payload = {
                id: "irrelevent",
                description: "irrelevent",
                date: givenDate
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the date
            expect(result.date).toBeInstanceOf(Date);

            // and it should be the correct date
            expect(result.date.getTime()).toEqual(givenDate.seconds * 1000)
        })

        it("should define split type", () => {
            // given a payload with a split type
            const givenSplitType = BillSplitType.EQUALS;

            const payload = {
                id: "irrelevent",
                description: "irrelevent",
                splitType: givenSplitType
            }

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then it should have defined the split type
            expect(result.splitType).toEqual(givenSplitType);
        })

        it("should define creator", () => {
            // given a payload with a creator
            const givenCreatorPayload = {
                id: "irrelevent",
                email: "irrelevent"
            }

            const payload = {
                id: "irrelvent",
                description: "irrelevent",
                creator: givenCreatorPayload
            }

            // and a mock of the BillParticipantConverter
            BillParticipantConverter.fromFirestore = jest.fn().mockReturnValue(new BillParticipant("irrelevent", "irrelevent"));

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then the BillParticipantConverter should have been called
            expect(BillParticipantConverter.fromFirestore).toHaveBeenCalledWith(givenCreatorPayload);

            // and the creator should be defined on the created object
            expect(result.creator).toBeInstanceOf(BillParticipant)
        })

        it("should define payer", () => {
            // given a payload with a payer
            const givenPayerPayload = {
                id: "irrelevent",
                email: "irrelevent"
            }

            const payload = {
                id: "irrelvent",
                description: "irrelevent",
                payer: givenPayerPayload
            }

            // and a mock of the BillParticipantConverter
            BillParticipantConverter.fromFirestore = jest.fn().mockReturnValue(new BillParticipant("irrelevent", "irrelevent"));

            // when creating object using converter
            const querySnapshot = new DocumentSnapshotMock(payload);

            const result = BillTransactionConverter.fromFirestore(querySnapshot);

            // then the BillParticipantConverter should have been called
            expect(BillParticipantConverter.fromFirestore).toHaveBeenCalledWith(givenPayerPayload);

            // and the payer should be defined on the created object
            expect(result.payer).toBeInstanceOf(BillParticipant)
        })
    })

    describe("to Firestore", () => {
        it.each([
            ["id", "123", "id"],
            ["description", "some description", "description"],
            ["amount", 100, "amount"],
            ["currency", "cad", "currency"],
            ["splitType", BillSplitType.FULLY_OWN, "splitType"]
        ])("should send property %s", (objectProperty, value, payloadProperty) => {
            // given an object with a property and a value
            const object = new BillTransaction("irrelevent");

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            object[objectProperty] = value;

            // when sending data to firestore using converter
            const payload = BillTransactionConverter.toFirestore(object);

            // then the payload should contains the value
            expect(payload).toHaveProperty(payloadProperty);

            expect(payload[payloadProperty]).toEqual(value)
        })

        it("should send date", () => {
            // given a bill with a date
            const givenDate = new Date();

            const object = new BillTransaction("irrelevent");
            object.date = givenDate;

            // when sending date to firestore using converter
            const payload = BillTransactionConverter.toFirestore(object);

            // then the payload should contain the date
            expect(payload).toHaveProperty('date');

            expect(payload.date.seconds).toEqual(givenDate.getTime() / 1000)
        })

        it("should send id of the creator", () => {
            // given an object with a creator with an id
            const givenCreatorID = "123";
            const givenCreator = new BillParticipant(givenCreatorID, "irrelevent");

            const object = new BillTransaction("irrelevent");
            object.creator = givenCreator;

            // when sending date to firestore using converter
            const payload = BillTransactionConverter.toFirestore(object);

            // then the payload should contain the creator uuid
            expect(payload).toHaveProperty('creator');

            expect(payload.creator).toEqual(givenCreatorID)
        })

        it("should send id of the payer", () => {
            // given an object with a payer with an id
            const givenPayerId = "123";
            const givenPayer = new BillParticipant(givenPayerId, "irrelevent");

            const object = new BillTransaction("irrelevent");
            object.payer = givenPayer;

            // when sending date to firestore using converter
            const payload = BillTransactionConverter.toFirestore(object);

            // then the payload should contain the payer uuid
            expect(payload).toHaveProperty('creator');

            expect(payload.payer).toEqual(givenPayerId)
        })
    })
})
