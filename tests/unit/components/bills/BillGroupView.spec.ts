import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import * as useBillsGroups from "@/composable/bills/use-bills-groups";
import {mockComposable, setComposableValue} from "../../../utils/mock-composable";
import {mount} from "@vue/test-utils";
import getMockI18nPlugin from "../../../utils/modifiers/get-mock-i18n-plugin";
import {IonContent, IonHeader, IonTitle} from "@ionic/vue";
import BillGroupView from "@/views/BillGroupView.vue";

mockComposable("@/composable/bills/use-bills-groups");
jest.mock('vue-router', () => ({
    useRoute: jest.fn(),
}))

describe("BillGroupView", () => {
    it("should display group name in the header", () => {
        // given a group with a name
        const givenGroupName = "someGroupName";
        const givenGroup = new BillGroup("123");
        givenGroup.name = givenGroupName;

        // and a mock of the getGroupById that returns that group
        const getGroupByIdMock = jest.fn().mockReturnValue(givenGroup);

        setComposableValue(useBillsGroups, {
            getGroupById: getGroupByIdMock
        })


        // when rendering the component
        const wrapper = mount(BillGroupView, {
            global: {
                plugins: [getMockI18nPlugin()]
            }
        })

        // then the header should contain the group name
        const headerTitleComponent = wrapper.getComponent(IonContent).getComponent(IonHeader).getComponent(IonTitle);

        expect(headerTitleComponent.text()).toEqual(givenGroupName);
    })
})
