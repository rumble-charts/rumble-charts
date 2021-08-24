export function sortBy<T extends Record<string, any>>(list: T[], field: string): T[] {
    const copy = [...list];
    copy.sort((a, b) => {
        if (a[field] === b[field]) {
            return 0;
        }
        return a[field] > b[field] ? 1 : -1;
    });
    return copy;
}
