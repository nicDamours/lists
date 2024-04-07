import {BillGroup} from "@/models/dtos/Bills/BillGroup";
import useBillsGroups from "@/composable/bills/use-bills-groups";
import {BillGroupService} from "@/services/bills/BillGroupService";
import * as useLoading from "@/composable/use-loading";
import {mockComposable, setComposableValue} from "../../../utils/mock-composable";

mockComposable("@/composable/use-loading");

jest.mock("vuex", () => {
    return {
        useStore: jest.fn()
    }
})

jest.mock("vue-router", () => {
    return {
        useRoute: jest.fn().mockReturnValue({})
    }
})

describe("useBillsGroups", () => {
    it("should call service when creating new group", async () => {
        // given a group to create
        const newGroup = new BillGroup("123");

        const callAsyncSpy = jest.fn();

        // and a mock of the callAsync function
        setComposableValue(useLoading, {
            callAsync: callAsyncSpy
        })

        // and a composable
        const {createGroup} = useBillsGroups()

        // when calling the 'createGroup' function on the composable
        const results = createGroup(newGroup);

        // then it should have called the service
        expect(callAsyncSpy).toHaveBeenCalledWith(BillGroupService.addNewBillGroup, newGroup);
    })

    it("should call service when deleting a group", () => {
        // given a group to create
        const groupToDelete = new BillGroup("123");

        const callAsyncSpy = jest.fn();

        // and a mock of the callAsync function
        setComposableValue(useLoading, {
            callAsync: callAsyncSpy
        })

        // and a composable
        const {deleteGroup} = useBillsGroups()

        // when calling the 'createGroup' function on the composable
        const results = deleteGroup(groupToDelete);

        // then it should have called the service
        expect(callAsyncSpy).toHaveBeenCalledWith(BillGroupService.deleteGroup, groupToDelete);
    })
})
