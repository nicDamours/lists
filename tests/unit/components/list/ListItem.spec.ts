import {Item} from "@/models/dtos/Item";
import {mount} from "@vue/test-utils";
import ListItem from "@/components/list/ListItem.vue";

describe("ListItem", () => {
    it("should display the item name", () => {
        // given an item with a name
        const givenName = "someItem";

        const givenItem = new Item("irrelevent", givenName);

        // when mounting the component
        const wrapper = mount(ListItem, {
            props: {
                item: givenItem
            }
        })

        // then the item's name should be visible
        const itemNameComponent = wrapper.find('[data-test-id="item-name"]');

        expect(itemNameComponent.exists()).toBe(true);
        expect(itemNameComponent.text()).toEqual(givenName);
    })
})
