import {Ref, ref} from "vue";
import {Section} from "@/models/dtos/Section";
import {ClonableItem, Item} from "@/models/dtos/Item";
import {ClonableList, List} from "@/models/dtos/List";
import useReorderItems from "@/composable/use-reorder-items";
import UUID from "@/utils/UUID";

const buildListWithSection = (sectionDefinition: Array<number>) => {
    const listRef = ref<ClonableList>(new List("irrelevent", "irrelevent") as ClonableList) as Ref<ClonableList>;

    listRef.value.sections = new Array(sectionDefinition.length).fill(undefined).map((_, index) => {
        const section = new Section("irrelevent");
        section.items = new Array(sectionDefinition[index]).fill(undefined).map(() => new Item("irrelevent", "irrelevent") as ClonableItem)

        return section;
    });

    return listRef
}
describe("useReorderItems", () => {
    const itemsInSectionDataProvider = [
        {
            itemsIndex: 0,
            sectionIndex: 0,
            domIndex: 1,
            sections: [
                2,
                3
            ]
        },
        {
            itemsIndex: 4,
            sectionIndex: 1,
            domIndex: 9,
            sections: [
                2,
                5,
                4
            ]
        },
        {
            itemsIndex: 1,
            sectionIndex: 1,
            domIndex: 7,
            sections: [
                3,
                2
            ]
        },
        {
            itemsIndex: 5,
            sectionIndex: 1,
            domIndex: 2 * 1 + 3 + 6,
            sections: [
                3,
                6,
                2
            ]
        },
    ]
    describe.each(itemsInSectionDataProvider)("getOriginalIndexFromSections", (dataProvider) => {
        it(`should return correctIndex with section ${dataProvider.sectionIndex} and item ${dataProvider.itemsIndex}`, () => {
           const givenList = buildListWithSection(dataProvider.sections);

            const  { getOriginalIndexFromSections } = useReorderItems(givenList)

            const [resultsSection, resultsItem] = getOriginalIndexFromSections(dataProvider.domIndex);

            expect(resultsSection).toEqual(dataProvider.sectionIndex);
            expect(resultsItem).toEqual(dataProvider.itemsIndex);
        })
    });
    const getSectionFromDomIndexDataProvider = [
        {
            sections: [
                2,
                3,
                4,
            ],
            sectionIndex: 2,
            domIndex: 2 * 2 + 2 + 3 + 1
        },
        {
            sections: [
                1,
                1
            ],
            sectionIndex: 0,
            domIndex: (0 * 2) + 0 + 1
        },
        {
            sections: [
                2,
                3,
                4,
            ],
            sectionIndex: 1,
            domIndex: 2 * 1 + 2 + 2
        },
        {
            sections: [
                2,
                3,
                4,
            ],
            sectionIndex: 2,
            domIndex: 2 * 2 + 2 + 3 + 4
        },
        {
            sections: [
                2,
                3,
                4,
            ],
            sectionIndex: 0,
            domIndex: 2 * 0 + 1
        },
    ]

    describe.each(getSectionFromDomIndexDataProvider)("getSectionFromDomIndex", (dataProvider) => {
        it(`should return ${dataProvider.sectionIndex} from domIndex ${dataProvider.domIndex}`, () => {
            const givenList = buildListWithSection(dataProvider.sections);

            const { getSectionFromDomIndex } = useReorderItems(givenList);

            const [resultSectionIndex, _] = getSectionFromDomIndex(dataProvider.domIndex);

            expect(resultSectionIndex).toEqual(dataProvider.sectionIndex);
        })

        it(`should returns the correct amount of items for domIndex ${dataProvider.domIndex}`, () => {
            const givenList = buildListWithSection(dataProvider.sections);

            const { getSectionFromDomIndex } = useReorderItems(givenList);

            const [_, resultsAmountOfItems] = getSectionFromDomIndex(dataProvider.domIndex);

            const expectedAmountOfItems = [...dataProvider.sections]
                .slice(0, dataProvider.sectionIndex)
                .reduce((collector, section) => collector += section, 0);

            expect(resultsAmountOfItems).toEqual(expectedAmountOfItems);
        })
    });

    const calcDomIndex = (sections: Array<number>, sectionIndex: number, itemIndex: number) => {
        const previousSectionSum = [...sections].splice(0, sectionIndex).reduce((collector, itemCount) => collector += itemCount, 0);
        const titleAndFormFromPreviousSections = 2 * sectionIndex;

        const currentSectionTitleIndex = 1;
        const givenSectionDomIndexStart = titleAndFormFromPreviousSections + previousSectionSum + currentSectionTitleIndex;

        return givenSectionDomIndexStart + itemIndex;
    }

    const reorderItemsInListDataProvider = () => {
        const input = [
            {
                sections: [
                    2,
                    4,
                    3,
                ],
                items: {
                    from: {
                        section: 0,
                        index: 0,
                        domIndex: NaN
                    },
                    to: {
                        section: 0,
                        index: 1,
                        domIndex: 0
                    }
                }
            },
            {
                sections: [
                    1,
                    4,
                    2,
                ],
                items: {
                    from: {
                        section: 0,
                        index: 0,
                        domIndex: NaN
                    },
                    to: {
                        section: 2,
                        index: 1,
                        domIndex: 1
                    }
                }
            },
            {
                sections: [
                    2,
                    3
                ],
                items: {
                    from: {
                        section: 1,
                        index: 2,
                        domIndex: NaN
                    },
                    to: {
                        section: 0,
                        index: 1,
                        domIndex: 0
                    }
                }
            },
            {
                sections: [
                    1,
                    3,
                    4,
                    3
                ],
                items: {
                    from: {
                        section: 3,
                        index: 2,
                        domIndex: NaN
                    },
                    to: {
                        section: 0,
                        index: 0,
                        domIndex: 0
                    }
                }
            },
            {
                sections: [
                    1,
                    3,
                    4,
                    3
                ],
                items: {
                    from: {
                        section: 0,
                        index: 0,
                        domIndex: NaN
                    },
                    to: {
                        section: 3,
                        index: 2,
                        domIndex: 1
                    }
                }
            },
            {
                sections: [
                    1,
                    3,
                    4,
                    3
                ],
                items: {
                    from: {
                        section: 0,
                        index: 0,
                        domIndex: NaN
                    },
                    to: {
                        section: 2,
                        index: 3,
                        domIndex: 1
                    }
                }
            },
        ]

        return input.map(item => {
           item.items.from.domIndex = calcDomIndex(item.sections, item.items.from.section, item.items.from.index);
           item.items.to.domIndex = calcDomIndex(item.sections, item.items.to.section, item.items.to.index) - item.items.to.domIndex;

           return item;
        });
    }

    describe.each(reorderItemsInListDataProvider())("reorderItemsInList", (dataProvider) => {
        it(`should reorder items ${dataProvider.items.from.index} in section ${dataProvider.items.from.section} to ${dataProvider.items.to.index} in section ${dataProvider.items.to.section}`, () => {
            // given a list with multiple sections
            const givenFromItemId = UUID.uuidv4();

            const givenList = buildListWithSection(dataProvider.sections)
            // and two items to switch in the appropriate section.

            givenList.value.sections[dataProvider.items.from.section].items[dataProvider.items.from.index] = new Item(givenFromItemId, "irrelevent") as ClonableItem;
            givenList.value.sections[dataProvider.items.to.section].items[dataProvider.items.to.index] = new Item("irrelevent", "irrelevent") as ClonableItem;

            const { reorderItemsInList } = useReorderItems(givenList)
            // when switching items
            const updatedList = reorderItemsInList(dataProvider.items.to.domIndex, dataProvider.items.from.domIndex);

            // then the section should contains the correct items.
            expect(updatedList?.sections[dataProvider.items.to.section].items[dataProvider.items.to.index].id).toEqual(givenFromItemId);
        })
    })
})
