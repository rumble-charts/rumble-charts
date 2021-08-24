export function omitBy<T extends Record<string, any>>(input: T, predicate: (value: any, key: string) => boolean): T {
    const output = {} as T;
    for (const key in input) {
        if (!predicate(input[key], key)) {
            output[key] = input[key];
        }
    }
    return output;
}
