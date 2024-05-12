export default class Config {
    private static key = (key: string) => `Config.${key}`

    private static get<T>(key: string, defaultValue: T): T {
        const value = localStorage.getItem(this.key(key))
        return value ? JSON.parse(value) as T : defaultValue
    }

    private static set<T>(key: string, value: T) {
        localStorage.setItem(this.key(key), JSON.stringify(value))
    }

    public static get CATEGORIES_EXPANDED() {
        return this.get('CATEGORIES_EXPANDED', true)
    }

    public static set CATEGORIES_EXPANDED(value: boolean) {
        this.set('CATEGORIES_EXPANDED', value)
    }
}
