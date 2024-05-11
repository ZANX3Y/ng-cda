export function isSet(...values: any[]): boolean {
    return !values.some(v => v === undefined || v === null)
}

export function fixUrl(url: string): string {
    return url.replace(/^\/\//, 'https://')
}

export function switchCase<T>(value: string, cases: Record<string, T>): T {
    return cases[value] || cases["default"]
}
