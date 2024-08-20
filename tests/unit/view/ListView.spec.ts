import {List} from "@/models/dtos/List";
import useRealStore from "../../utils/modifiers/use-real-store";
import {MUTATION_NAME_ADD, MUTATION_NAME_UPDATE} from "@/store/modules/firestoreModule";
import {flushPromises, mount} from "@vue/test-utils";
import ListView from "@/views/ListView.vue";
import {IonPage} from "@ionic/vue";
import useFakeI18n from "../../utils/modifiers/use-fake-i18n";
import {routeLocationKey, routerKey} from "vue-router";
import OnLongPress from "@/directive/on-long-press";
import * as useListService from "@/composable/use-list-service";
import {mockComposable, setComposableValue} from "../../utils/mock-composable";
import {Section} from "@/models/dtos/Section";
import {DefaultSection} from "@/models/dtos/DefaultSection";
import {nextTick} from "vue";

mockComposable("@/composable/use-list-service")

describe("ListView", () => {
    it("should render", async () => {
        // given a list in the store
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // when rendering the component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // then there should be a page
        const pageContainer = wrapper.findComponent(IonPage);

        expect(pageContainer.exists()).toBe(true)

        resetRealStore();
    })

    it("should push a new section in the list when creating a new item", async () => {
        // given a list in the store
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn();
        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // when a new section is added with a given name
        const givenNewSectionName = "new section";
        const sectionNewFormComponent = wrapper.getComponent('[data-test-id="new-section-form"]')
        sectionNewFormComponent.vm.$emit('form-submit', givenNewSectionName);

        // then the new section should have been added to the current list.
        expect(updateListFn).toHaveBeenCalled()
        const updateListCallArgs: List = updateListFn.mock.calls[0][0];

        const addedSection = updateListCallArgs.sections.filter(section => !(section instanceof DefaultSection));
        expect(addedSection).toHaveLength(1);

        expect(addedSection[0].name).toEqual(givenNewSectionName);

        resetRealStore();
    })

    it("should push a item in the default section when creating new item in the default section", async () => {
        // given a list in the store
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn();
        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // when a new item is added to the default section
        const givenNewItemName = "new item";
        const sectionNewFormComponent = wrapper.getComponent('[data-test-id="new-item-form-0"]')
        sectionNewFormComponent.vm.$emit('form-submit', givenNewItemName);

        // then the new item should have been added to the default section.
        expect(updateListFn).toHaveBeenCalled()
        const updateListCallArgs: List = updateListFn.mock.calls[0][0];

        const defaultSection = updateListCallArgs.sections.filter(section => section instanceof DefaultSection);
        expect(defaultSection[0].items).toHaveLength(1);

        expect(defaultSection[0].items[0].name).toEqual(givenNewItemName);

        resetRealStore();
    })

    it("should push a item in the given section when creating new item in the default section", async () => {
        // given a list in the store with a section
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");
        const givenSection = new Section("12345");
        givenSection.name = "new section";

        givenList.sections.push(givenSection)

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn();
        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // when a new item is added to the given section
        const givenNewItemName = "new item";
        const givenSectionNewItemFormComponent = wrapper.getComponent('[data-test-id="new-item-form-1"]')

        await givenSectionNewItemFormComponent.vm.$emit('form-submit', givenNewItemName);
        await flushPromises();

        // then the new item should have been added to the given section.
        expect(updateListFn).toHaveBeenCalled()

        const updateListCallArgs: List = updateListFn.mock.calls[0][0];

        const givenSectionNewItemForms = updateListCallArgs.sections.filter(section => !(section instanceof DefaultSection));
        expect(givenSectionNewItemForms[0].items).toHaveLength(1);

        expect(givenSectionNewItemForms[0].items[0].name).toEqual(givenNewItemName);

        resetRealStore();
    })

    it("should update the quantity when item name contains 'x {value}'", async () => {
        // given a list in the store with a section
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");
        const givenSection = new Section("12345");
        givenSection.name = "new section";

        givenList.sections.push(givenSection)

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn();
        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // when a new item is added to the given section that ends with 'x somevalue'
        const givenQuantity = 4;
        const givenNewItemName = "new item";

        const formValue = `${givenNewItemName} x ${givenQuantity}`;
        const givenSectionNewItemFormComponent = wrapper.getComponent('[data-test-id="new-item-form-1"]')

        await givenSectionNewItemFormComponent.vm.$emit('form-submit', formValue);
        await flushPromises();

        // then the new item should have the defined quantity
        expect(updateListFn).toHaveBeenCalled()

        const updateListCallArgs: List = updateListFn.mock.calls[0][0];

        const givenSectionNewItemForms = updateListCallArgs.sections.filter(section => !(section instanceof DefaultSection));

        expect(givenSectionNewItemForms[0].items).toHaveLength(1);

        expect(givenSectionNewItemForms[0].items[0].quantity).toEqual(givenQuantity);

        // and the item name should only contain the part without the quantity
        expect(givenSectionNewItemForms[0].items[0].name).toEqual(givenNewItemName);

        resetRealStore();
    })

    it("should update the quantity when item name contains multiple 'x'", async () => {
        // given a list in the store with a section
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");
        const givenSection = new Section("12345");
        givenSection.name = "new section";

        givenList.sections.push(givenSection)

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn();
        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                }
            }
        })

        // when a new item is added to the given section that ends with 'x somevalue'
        const givenQuantity = 4;
        const givenNewItemName = "dawdawdxxawdxaw xwaxawxaw xanax";

        const formValue = `${givenNewItemName} x${givenQuantity}`;
        const givenSectionNewItemFormComponent = wrapper.getComponent('[data-test-id="new-item-form-1"]')

        await givenSectionNewItemFormComponent.vm.$emit('form-submit', formValue);
        await flushPromises();

        // then the new item should have the defined quantity
        expect(updateListFn).toHaveBeenCalled()

        const updateListCallArgs: List = updateListFn.mock.calls[0][0];

        const givenSectionNewItemForms = updateListCallArgs.sections.filter(section => !(section instanceof DefaultSection));

        expect(givenSectionNewItemForms[0].items).toHaveLength(1);

        expect(givenSectionNewItemForms[0].items[0].quantity).toEqual(givenQuantity);

        // and the item name should only contain the part without the quantity
        expect(givenSectionNewItemForms[0].items[0].name).toEqual(givenNewItemName);

        resetRealStore();
    })

    it("should focus the new item form when creating a new section", async () => {
        // given a list in the store
        const givenListId = "someId";

        const givenList = new List(givenListId, "irrelevent");

        const {store, resetRealStore} = useRealStore();

        store.commit(`lists/${MUTATION_NAME_ADD}LISTS`, givenList)

        // and a mock of the ListService
        const updateListFn = jest.fn().mockImplementation((updatedList) => {
            store.commit(`lists/${MUTATION_NAME_UPDATE}LISTS`, {id: givenListId, value: updatedList})
        });

        setComposableValue(useListService, {
            updateList: updateListFn
        })

        // and a component
        const {i18n} = useFakeI18n();

        const wrapper = mount(ListView, {
            attachTo: document.body,
            global: {
                plugins: [i18n, store],
                directives: {
                    'long-press': OnLongPress
                },
                provide: {
                    [routerKey as symbol]: () => {
                        return {};
                    },
                    [routeLocationKey as symbol]: {
                        params: {
                            id: givenListId
                        }
                    }
                },
            }
        })

        // when a new section is added with a given name
        const givenNewSectionName = "new section";
        const sectionNewFormComponent = wrapper.getComponent('[data-test-id="new-section-form"]')
        sectionNewFormComponent.vm.$emit('form-submit', givenNewSectionName);

        await flushPromises();
        await nextTick();

        // then the new item form, in the new section, should be focus
        const newSectionNewItemFormComponent = wrapper.getComponent('[data-test-id="new-item-form-1"]')

        expect(newSectionNewItemFormComponent.props('hasFocus')).toEqual(true)

        resetRealStore();
    })
})
