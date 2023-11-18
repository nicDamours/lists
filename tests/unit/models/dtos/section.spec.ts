import {Section} from "@/models/dtos/Section";
import UUID from "@/utils/UUID";

describe("Section DTO", () => {
    it("should return false when checking if section is default", () => {
        // given a normal section
        const section = new Section(UUID.uuidv4());

        // when checking if section is default
        const result = section.isDefault;

        // then it should return false
        expect(result).toEqual(false);
    })
})
