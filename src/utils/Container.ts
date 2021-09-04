export class Container {
    private readonly singletonsInstances!: {[className: string]: any};
    private static instance: Container;
    private aliases: {[aliasName: string]: string};
    private classes: {[className: string]: any}

    private constructor() {
        this.singletonsInstances = {};
        this.aliases = {};
        this.classes = {};
    }

    public static getInstance(): Container{
        if(!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    public static get<C>(className: string, ...args: any[]): C {
        const containerInstance = Container.getInstance();
        const actualClassName = containerInstance.aliasExists(className)
            ? containerInstance.getActualClassNameForAlias(className)
            : containerInstance.getClassByName(className)

        if(!containerInstance.hasSingletonInstance(actualClassName)) {
            containerInstance.registerSingletonInstance(actualClassName, args);
        }

        return containerInstance.retrieveSingletonInstance<C>(actualClassName);
    }

    public registerAliases(aliases: any) {
        this.aliases = aliases;
    }

    public getRegisteredServices() {
        return this.classes;
    }
    public getRegisteredAliases() {
        return this.aliases;
    }

    private hasSingletonInstance(className: string): boolean {
        return !!this.singletonsInstances[className];
    }

    private registerSingletonInstance(className: string, ...args: any[]): void {
        const instanceConstructor = eval(className);
        this.singletonsInstances[className] = new instanceConstructor(...args);
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

    public registerClasses(classes: {[key: string]: any}) {
        this.classes = classes;
    }

    private getClassByName(name: string): any {
        return this.classes[name];
    }
}
