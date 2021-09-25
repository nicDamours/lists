export default function useRandom() {
    /**
     * @ref https://stackoverflow.com/a/7228322/5784924
     * @param min Number
     * @param max Number
     *
     * @return Number
     */
    const getRandom = (min = 0, max = Number.MAX_VALUE): number => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return {
        getRandom
    }
}
