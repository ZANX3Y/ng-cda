export default class Config {
    private static key = (key: string) => `Config.${key}`

    private static get<T>(key: string, defaultValue: T): T {
        const value = localStorage.getItem(this.key(key))
        return value ? JSON.parse(value) as T : defaultValue
    }

    private static set<T>(key: string, value: T) {
        localStorage.setItem(this.key(key), JSON.stringify(value))
    }

    public static get API_URL() {
        return this.get('API_URL', 'http://localhost:3000')
    }

    public static set API_URL(value: string) {
        this.set('API_URL', value)
    }

    public static api = (path: string) => `${Config.API_URL}${path}`

    public static get PROGRESS_SAVE_INTERVAL() {
        return this.get('PROGRESS_SAVE_INTERVAL', 5)
    }

    public static set PROGRESS_SAVE_INTERVAL(value: number) {
        this.set('PROGRESS_SAVE_INTERVAL', value)
    }

    public static get CATEGORIES_EXPANDED() {
        return this.get('CATEGORIES_EXPANDED', true)
    }

    public static set CATEGORIES_EXPANDED(value: boolean) {
        this.set('CATEGORIES_EXPANDED', value)
    }
}
