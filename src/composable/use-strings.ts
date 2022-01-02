export default function useStrings() {
    const capitalize = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return {
        capitalize
    }
}
