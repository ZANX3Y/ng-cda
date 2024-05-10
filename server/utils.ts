export function isSet(...values: any[]): boolean {
    return !values.some(v => v === undefined || v === null)
}

export function fixUrl(url: string): string {
    return url.replace(/^\/\//, 'https://')
}
