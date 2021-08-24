export function pick<T extends Record<string, any>, K extends keyof T>(input: T, fields: K[]): Pick<T, K> {
    const output = {} as T;
    fields.forEach(field => {
        if (field in input) {
            output[field] = input[field];
        }
    });
    return output;
}
