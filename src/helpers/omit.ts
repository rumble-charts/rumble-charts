export function omit<T extends Record<string, any>, K extends keyof T>(input: T, fields: K[]): Omit<T, K> {
    const output = {...input};
    fields.forEach(field => {
        if (field in output) {
            delete output[field];
        }
    });
    return output;
}
