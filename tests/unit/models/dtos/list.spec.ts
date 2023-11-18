import {List} from "@/models/dtos/List";
import {DefaultSection} from "@/models/dtos/DefaultSection";
import {Section} from "@/models/dtos/Section";
import UUID from "@/utils/UUID";

describe("List DTO", () => {
    it("should create default section when creating new list", () => {
        // given nothing

        // when creating a new list
        const list = new List("irrelevent", "irrelevent");

        // then the list should contain a default section
        expect(list.sections).toHaveLength(1);

        expect(list.sections[0]).toBeInstanceOf(DefaultSection);
    })

    it("should always put default list first if present", () => {
        // given a list with a few sections
        const givenSectionCount = 3;
        const givenSections = new Array(givenSectionCount).fill(undefined).map((_, index) => {
            const section = new Section(UUID.uuidv4());
            section.name = `section ${index + 1}`;

            return section;
        });

        const givenList = new List(UUID.uuidv4(), "irrelevent");
        givenList.sections = givenSections;

        // and a default section for this list
        const defaultSection = new DefaultSection(UUID.uuidv4());

        givenList.sections = [...givenList.sections, defaultSection];

        // when fetching section using getter
        const result = givenList.sections;

        // then the first section should always be the default one
        expect(result).toHaveLength(givenSectionCount + 1);

        expect(result[0]).toBeInstanceOf(DefaultSection);
    });
})
