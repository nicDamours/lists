import {ClonableList} from "@/models/dtos/List";
import {Ref} from "vue";

export default function useReorderItems(list: Ref<ClonableList>) {
    /**
     * We take a number and check in which section it is.
     * To do so, we need to remove 2 for each section we've already checked ( title and form )
     * And then, we check if the element is greater or equals to the sum of the items of the previous section + 1
     * and less than this index - the sum of items in the current section.
     *
     * @param domIndex
     * @returns {[number, number]}
     */
    const getSectionFromDomIndex = (domIndex: number) => {
        let sectionItemSum = 0;

        for(let i = 0; i < list.value.sections.length; i ++) {
            const currentSection = list.value.sections[i];

            const sumOfPreviousDomItem = (i * 2) + 1 + sectionItemSum;

            if(domIndex >= sumOfPreviousDomItem && domIndex <= (sumOfPreviousDomItem + currentSection.items.length)) {
                return [i, sectionItemSum];
            }

            sectionItemSum += currentSection.items.length
        }


        return [-1, 0];
    }

    /**
     * The reorder component returns an index 0 based indexes. We need to convert this index into an section and item index.
     * To do so, we know that each section has 2 extra items, a title and a form. ( 2 * givenSectionIndex ).
     * We also know that the current section has one extra item, the title ( - 1 )
     * We then need to remove the sum of all the previous section. ( - sumOfPreviousSectionItems ).
     *
     * Ex:
     * we got two section, one with 3 items, and one with 2,
     * we want to get the index of the second item in the second section.
     *
     * the originalDomIndex is 7.
     *
     * givenSectionIndex = 1
     * 7 - ( 2 * givenSectionIndex ) = 5 we remove the titles and forms of all the previous sections
     * 5 - 1  = 4 we remove the title of the current section
     * 4 - 3 = 1 we remove the sum of the previous sections' items.
     *
     * results, the index of the items, in the second section is 1
     *
     * @return {[number, number]}
     * @param domIndex
     */
    const getOriginalIndexFromSections = (domIndex: number): [number, number] => {
        const [givenSectionIndex, sumOfPreviousSectionItems] = getSectionFromDomIndex(domIndex);

        return [givenSectionIndex, domIndex - (2 * givenSectionIndex) - 1 - sumOfPreviousSectionItems];
    }

    /**
     * In order to reorder the list, we need to first remove the original item from the appropriate section.
     * We then add the same items, in the new section. In the case of both section being the same. It's like a find and replace.
     * If we have two different sections, we remove from one and add to the new one.
     *
     * @param {number} newDomIndex
     * @param {number} oldDomIndex
     */
    const reorderItemsInList = (newDomIndex: number, oldDomIndex: number): ClonableList|null => {
        const [oldSectionIndex, oldItemInOldSection] = getOriginalIndexFromSections(oldDomIndex);

        if(oldSectionIndex >= 0 && oldItemInOldSection >= 0) {
            const originalItemClone = list.value.sections[oldSectionIndex].items[oldItemInOldSection].clone();

            const newDomIndexModifier = newDomIndex > oldDomIndex ? 1 : 0;
            const newIndexes = getOriginalIndexFromSections(newDomIndex + newDomIndexModifier);
            const newSectionIndex = newIndexes[0];
            let newIndexInNewSection = newIndexes[1];

            if(newSectionIndex === oldSectionIndex) {
                newIndexInNewSection = newIndexInNewSection - newDomIndexModifier;
            }
            const listClone = list.value.clone();

            listClone.sections[oldSectionIndex].removeItem(oldItemInOldSection);
            listClone.sections[newSectionIndex].insertItem(originalItemClone, newIndexInNewSection)

            return listClone
        }

        return null;
    }

    return {
        reorderItemsInList,
        getSectionFromDomIndex,
        getOriginalIndexFromSections
    }
}
