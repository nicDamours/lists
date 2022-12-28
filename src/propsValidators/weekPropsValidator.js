export default function weekPropsValidator(value) {
    return ['startDate', 'endDate'].every(prop => prop in value && value[prop] instanceof Date)
}
