type Injectable = Record<string, unknown>;

export class Container {
    private static instance: Container;
    private readonly singletonsInstances!: { [className: string]: Injectable };
    private aliases: { [aliasName: string]: string };
    private classes: { [className: string]: unknown };

    private constructor() {
        this.singletonsInstances = {};
        this.aliases = {};
        this.classes = {};
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    public static get<C>(className: string, ...args: unknown[]): C {
        const containerInstance = Container.getInstance();
        const actualClassName = containerInstance.aliasExists(className) ?
            containerInstance.getActualClassNameForAlias(className) :
            containerInstance.getClassByName(className);

        if (!containerInstance.hasSingletonInstance(actualClassName)) {
            containerInstance.registerSingletonInstance(actualClassName, ...args);
        }

        return containerInstance.retrieveSingletonInstance<C>(actualClassName);
    }

    public registerAliases(aliases: Record<string, string>): void {
        this.aliases = aliases;
    }

    public getRegisteredServices(): Record<string, unknown> {
        return this.classes;
    }

    public getRegisteredAliases(): Record<string, string> {
        return this.aliases;
    }

    public registerClasses(classes: Record<string, unknown>): void {
        this.classes = classes;
    }

    private hasSingletonInstance(className: string): boolean {
        return !!this.singletonsInstances[className];
    }

    private registerSingletonInstance(className: string, ...args: unknown[]): void {
        const _instanceConstructor = eval(className);

        this.singletonsInstances[className] = new _instanceConstructor(...args);
    }

    private retrieveSingletonInstance<C>(className: string): C {
        return this.singletonsInstances[className] as C;
    }

    private aliasExists(aliasName: string): boolean {
        return !!this.aliases[aliasName];
    }

    private getActualClassNameForAlias(aliasName: string): string {
        return this.aliases[aliasName];
    }

    private getClassByName(name: string): string {
        return this.classes[name] as string;
    }
}
