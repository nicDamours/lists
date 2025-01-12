import {mockComposable, setComposableValue} from "@tests/utils/mock-composable";
import * as useShareRequests from "@/composable/use-share-requests";
import * as useCurrentUser from "@/composable/use-current-user";
import UUID from "@/utils/UUID";
import {mount} from "@vue/test-utils";
import {List} from "@/models/dtos/List";
import {IonBadge, IonItemOption, IonItemSliding} from "@ionic/vue";
import ShareListRequest from "@/models/dtos/ShareListRequest";
import ShareWithUserList from "@/components/modal/ShareWithUserModal/ShareWithUserList.vue";
import useFakeI18n from "@tests/utils/modifiers/use-fake-i18n";
import {SharedUser} from "@/models/dtos/SharedUser";
import * as useCloudFunctions from "@/composable/use-cloud-functions";


mockComposable("@/composable/use-share-requests")
mockComposable("@/composable/use-current-user")
mockComposable("@/composable/use-cloud-functions")


describe("ShareWithUserList", () => {
    it("should display pending request", () => {
        // given a mock of the useSharedRequests composable that returns some share request
        const givenSharedRequestCount = 2;
        const givenListId = UUID.uuidv4();
        const givenSharedRequests = new Array(givenSharedRequestCount).fill(undefined).map(() => {
            return new ShareListRequest(
                UUID.uuidv4(),
                UUID.uuidv4(),
                UUID.uuidv4() + "@test.com",
                UUID.uuidv4(),
                UUID.uuidv4() + "@test3.com",
                givenListId,
                "irrelevent"
            )
        })

        setComposableValue(useShareRequests, {
            getShareRequestsForList: jest.fn().mockReturnValue(givenSharedRequests)
        });

        setComposableValue(useCurrentUser, {
            getCurrentUser: jest.fn()
        })

        // when rendering the component
        const {i18n} = useFakeI18n();
        const list = new List(givenListId, "irrelevent")
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // then the pending request should be present in the list.
        const activeShareListComponent = wrapper.findAllComponents(IonItemSliding);

        expect(activeShareListComponent).toHaveLength(givenSharedRequestCount)
    })

    it("should show a pending tag when share request is pending", () => {
        // given a pending shared request
        const givenListId = UUID.uuidv4();
        const givenSharedRequests = [
            new ShareListRequest(
                UUID.uuidv4(),
                UUID.uuidv4(),
                UUID.uuidv4() + "@test.com",
                UUID.uuidv4(),
                UUID.uuidv4() + "@test3.com",
                givenListId,
                "irrelevent"
            )
        ];

        setComposableValue(useShareRequests, {
            getShareRequestsForList: jest.fn().mockReturnValue(givenSharedRequests)
        });

        setComposableValue(useCurrentUser, {
            getCurrentUser: jest.fn()
        })

        // when rendering the component
        const {i18n} = useFakeI18n();
        const list = new List(givenListId, "irrelevent")
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // then the pending request should have a pending tag
        const pendingShareRequestComponent = wrapper.findAllComponents(IonItemSliding)[0];
        const pendingTag = pendingShareRequestComponent.findComponent(IonBadge)

        expect(pendingTag.exists()).toEqual(true)
    })

    it("should not show pending tag when request is not pending", () => {
        // given a list with a non pending request
        const givenListId = UUID.uuidv4();
        const list = new List(givenListId, "irrelevent")
        list.sharedWiths = [
            new SharedUser(UUID.uuidv4(), "irrelevent")
        ]

        setComposableValue(useShareRequests, {
            getShareRequestsForList: jest.fn().mockReturnValue([])
        });

        setComposableValue(useCurrentUser, {
            getCurrentUser: jest.fn()
        })

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // then the request should not have a pending tag
        const pendingShareRequestComponent = wrapper.findAllComponents(IonItemSliding)[0];
        const pendingTag = pendingShareRequestComponent.findComponent(IonBadge)

        expect(pendingTag.exists()).toEqual(false)
    })

    it("should show both pending and non pending request", () => {
        // given some pending request
        const givenListId = UUID.uuidv4();
        const givenSharedRequests = [
            new ShareListRequest(
                UUID.uuidv4(),
                UUID.uuidv4(),
                UUID.uuidv4() + "@test.com",
                UUID.uuidv4(),
                UUID.uuidv4() + "@test3.com",
                givenListId,
                "irrelevent"
            )
        ];

        setComposableValue(useShareRequests, {
            getShareRequestsForList: jest.fn().mockReturnValue(givenSharedRequests)
        });

        setComposableValue(useCurrentUser, {
            getCurrentUser: jest.fn()
        })
        // and a list with non pending request
        const list = new List(givenListId, "irrelevent")
        list.sharedWiths = [
            new SharedUser(UUID.uuidv4(), "irrelevent")
        ]

        // when rendering the component
        const {i18n} = useFakeI18n();
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // then both pending and non pending request should be visible
        const shareRequestComponents = wrapper.findAllComponents(IonItemSliding);

        expect(shareRequestComponents).toHaveLength(2)
    });

    it("should call the unshareWithEmail function when revoking a non pending request", async () => {
        // given a mock of the callFunction composable
        const callFunctionFn = jest.fn();

        setComposableValue(useCloudFunctions, {
            callFunction: callFunctionFn
        })

        setComposableValue(useShareRequests, {
            getShareRequestsForList: jest.fn().mockReturnValue([])
        });


        // and a list with a non pending request
        const list = new List(UUID.uuidv4(), "irrelevent")
        list.sharedWiths = [
            new SharedUser(UUID.uuidv4(), "irrelevent")
        ]

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // when clicking on the revoke btn for the request
        const requestComponent = wrapper.findAllComponents(IonItemSliding)[0];
        const revokeBtn = requestComponent.findComponent(IonItemOption);
        await revokeBtn.trigger('click');

        // then the callFunction should have been called with "unshareWithEmail"
        expect(callFunctionFn).toBeCalledWith("unshareWithEmail", expect.anything())
    });

    it("should call the deleteRequest function when revoking a pending request", async () => {
        // given a mock of the deleteRequest function
        const deleteRequestFn = jest.fn();

        // and a list with a pending request
        const givenListId = UUID.uuidv4();
        const givenRequestId = UUID.uuidv4();
        const givenSharedRequest = new ShareListRequest(
            givenRequestId,
            UUID.uuidv4(),
            UUID.uuidv4() + "@test.com",
            UUID.uuidv4(),
            UUID.uuidv4() + "@test3.com",
            givenListId,
            "irrelevent"
        )

        const list = new List(givenListId, "irrelevent")
        list.sharedWiths = []

        setComposableValue(useShareRequests, {
            deleteRequest: deleteRequestFn,
            getShareRequestsForList: jest.fn().mockReturnValue([givenSharedRequest])
        });

        // and a component
        const {i18n} = useFakeI18n();
        const wrapper = mount(ShareWithUserList, {
            global: {
                plugins: [i18n],
            },
            props: {
                list
            }
        });

        // when clicking on the revoke btn for the request
        const requestComponent = wrapper.findAllComponents(IonItemSliding)[0];
        const revokeBtn = requestComponent.findComponent(IonItemOption);
        await revokeBtn.trigger('click');

        // then the deleteRequestFn should have been called
        expect(deleteRequestFn).toHaveBeenCalledWith(givenSharedRequest)
    });
})
