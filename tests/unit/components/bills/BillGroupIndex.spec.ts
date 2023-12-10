import {mockComposable, setComposableValue} from "../../../utils/mock-composable";

import * as useBillsGroups from "@/composable/bills/use-bills-groups";
import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import {ref} from "vue";
import BillGroupIndex from "@/views/BillGroupIndex.vue";
import {mount} from "@vue/test-utils";
import BillGroupItem from "@/components/Bills/BillGroupItem.vue";
import getMockRouterPlugin from "../../../utils/modifiers/get-mock-router-plugin";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";
import * as useConfirm from "@/composable/use-confirm";
import NewBillGroupFabButton from "@/components/Bills/NewBillGroupFabButton.vue";

mockComposable("@/composable/bills/use-bills-groups");
mockComposable("@/composable/use-confirm");
describe("BillGroupIndex", () => {
    it("should display one item per group", () => {
        // given multiple bills groups
        const givenBillGroupsCount = 4;
        const givenBillGroups = new Array(givenBillGroupsCount).fill(undefined).map(() => new BillGroup("123"))

        // and a composable that returns those bills groups
        setComposableValue(useBillsGroups, {
            billGroups: ref(givenBillGroups)
        })

        // when rendering the component
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // then it should display one BillGroupItem per group
        const groupItemComponents = wrapper.findAllComponents(BillGroupItem);

        expect(groupItemComponents).toHaveLength(givenBillGroupsCount);
    });

    it("should have fab button to create new groups", () => {
        // given a component

        setComposableValue(useBillsGroups, {
            billGroups: ref([])
        })

        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // then it should have a newGroup fab button
        const newGroupfabButton = wrapper.findComponent(NewBillGroupFabButton);

        expect(newGroupfabButton.exists()).toEqual(true);
    });

    it("should call create function, on useBillGroups composable, when fab button trigger group create event", async () => {
        // given a mock of the useBillGroups composable
        const givenGroupToCreate = new BillGroup("123");

        const createGroupSpy = jest.fn().mockResolvedValue(new BillGroup("123"));
        setComposableValue(useBillsGroups, {
            createGroup: createGroupSpy,
            billGroups: ref([])
        })

        // and a wrapper
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // when the fab button triggers a "create-group" event
        const newGroupFabButton = wrapper.getComponent(NewBillGroupFabButton);

        await newGroupFabButton.vm.$emit("create-group", givenGroupToCreate);

        // then the composable's create function should have been called with the given new group
        expect(createGroupSpy).toHaveBeenCalledWith(givenGroupToCreate)
    });

    it("should trigger naviguation change when group item is clicked", async () => {
        // given a mock of the router
        const router = getMockRouterPlugin();

        const routerPushSpy = jest.spyOn(router, 'push');

        // and a mock of the useBillGroups composable that returs some groups
        const givenGroupID = "3123123";

        const givenGroup = new BillGroup(givenGroupID);

        setComposableValue(useBillsGroups, {
            billGroups: ref([givenGroup])
        })
        // and a component
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin(), router],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // when an item triggers a click event
        const billGroupItem = wrapper.findAllComponents(BillGroupItem)[0];

        await billGroupItem.trigger('click');

        // then it should have triggered a navigation on the router
        expect(routerPushSpy).toHaveBeenCalledTimes(1);
        expect(routerPushSpy).toHaveBeenCalledWith({
            name: "BillGroupView",
            params: {
                id: givenGroupID
            }
        });
    })

    it("should trigger delete group when group item trigger delete event", async () => {
        // given a mock of the useBillGroups composable
        const givenGroupToDelete = new BillGroup("123");

        const deleteGroupSpy = jest.fn().mockResolvedValue(new BillGroup("123"));
        setComposableValue(useBillsGroups, {
            deleteGroup: deleteGroupSpy,
            billGroups: ref([givenGroupToDelete])
        })

        // and a mock of use-confirm that resolve true
        const showConfirmSpy = jest.fn().mockResolvedValue(true);

        setComposableValue(useConfirm, {
            showConfirm: showConfirmSpy
        })

        // and a wrapper
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // when the bill group item triggers a 'delete' event
        const billGroupItem = wrapper.findAllComponents(BillGroupItem)[0];

        await billGroupItem.trigger("delete");

        // then a confirm modal should have been shown
        expect(showConfirmSpy).toHaveBeenCalledTimes(1);

        // and the composable's delete function should have been called with the group to delete
        expect(deleteGroupSpy).toHaveBeenCalledWith(givenGroupToDelete)
    });

    it("should show empty group text if no group exists", () => {
        // given a mock of the useBillGroups composable with no groups
        setComposableValue(useBillsGroups, {
            billGroups: ref([])
        })

        // when rendering the component
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // then the no groups text should be displayed
        const noGroupTextComponent = wrapper.find('.v-bill-group-index__empty');

        expect(noGroupTextComponent.exists()).toEqual(true)
    })

    it("should not display empty component if groups exists", () => {
        // given a mock of the useBillGroups composable with some groups
        setComposableValue(useBillsGroups, {
            billGroups: ref([new BillGroup("123")])
        })

        // when rendering the component
        const wrapper = mount(BillGroupIndex, {
            global: {
                plugins: [getMockI18nPlugin()],
                stubs: {
                    BillGroupItem: true,
                    NewBillGroupFabButton: true
                }
            },
        });

        // then the no groups text should be displayed
        const noGroupTextComponent = wrapper.find('.v-bill-group-index__empty');

        expect(noGroupTextComponent.exists()).toEqual(false)
    })
})
