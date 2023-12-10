export function setComposableValue(mockObject: any, returnValue: any) {
    // eslint-disable-next-line no-undef
    return jest
        .spyOn(mockObject, "default")
        .mockImplementationOnce(() => returnValue);
}

export function mockComposable(composablePath: string) {
    // eslint-disable-next-line no-undef
    jest.mock(composablePath, () => ({
        __esModule: true,
        // eslint-disable-next-line no-undef
        default: jest.fn()
    }));
}
