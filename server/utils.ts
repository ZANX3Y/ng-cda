export function isSet(...values: any[]): boolean {
    return !values.some(v => v === undefined || v === null)
}
