export interface Clonable {
    clone(): any;
}

const ClonableMixin: Clonable = {
    clone(): any {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)));

        const currentObjectKeys = Object.keys(this);

        const mixinTarget = (this as {[key: string]: any})

        currentObjectKeys.forEach((key: string|number) => {
            let clonableValue = mixinTarget[key];

            if(clonableValue instanceof Array) {
                clonableValue = [...clonableValue];
            }

            if(clonableValue instanceof Object && 'clone' in clonableValue) {
                clonableValue = clonableValue.clone();
            }
            clone[key] = clonableValue;
        });

        return clone;
    }
};

export default ClonableMixin
