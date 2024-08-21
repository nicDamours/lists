type Methods<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T] & string;

type ImportedComposable = {
    __esModule?: true;
    default: (...args: any[]) => any;
};

type ComposableReturnType<T extends ImportedComposable> = T['default'] extends (
        ...args: any[]
    ) => infer R
    ? Partial<R>
    : never;

const invalidComposableImportError = new Error(
    'Could not mock composable, did you import it using \'import * as composable from "..."\' ?'
);

export function setComposableValue<
    T extends ImportedComposable,
    R extends ComposableReturnType<T>
>(mockObject: T, returnValue: R) {
    return setComposableImplementation(mockObject, () => returnValue);
}

export function setComposableImplementation<T extends ImportedComposable>(
    mockObject: T,
    implementation: (...args: unknown[]) => ComposableReturnType<T>
) {
    if (!('default' in (mockObject as object))) {
        throw invalidComposableImportError;
    }

    return jest
        .spyOn<ImportedComposable, 'default'>(mockObject, 'default')
        .mockImplementation(implementation as any);
}

export function mockComposable(composablePath: string) {
    jest.doMock(composablePath, () => ({
        __esModule: true,
        default: jest.fn()
    }));
}
