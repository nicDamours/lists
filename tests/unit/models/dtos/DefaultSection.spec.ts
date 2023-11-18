import {DefaultSection} from "@/models/dtos/DefaultSection";
import UUID from "@/utils/UUID";

describe("DefaultSection DTO", () => {
    it("should return true when checking if default", () => {
        // given a default section
        const section = new DefaultSection(UUID.uuidv4());

        // when checking if section is default
        const result = section.isDefault

        // then it should return true
        expect(result).toEqual(true);
    })
})
