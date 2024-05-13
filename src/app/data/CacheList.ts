import ListVideo from '../../../shared/ListVideo'

export default class CacheList {
    static lifetime = 0
    static cacheKey = 'CacheList'

    constructor(
        public name: string,
        public videos: ListVideo[],
        public page: number,
        public hasNext: boolean,
        public createdAt: number = new Date().getTime()
    ) {}

    save() {
        const ck = (this.constructor as typeof CacheList).cacheKey
        localStorage.setItem(`Cache.${ck}-${this.name}`, JSON.stringify(this))
    }

    static create(name: string) {
        const ls = localStorage.getItem(`Cache.${this.cacheKey}-${name}`)

        if (ls) {
            const json = JSON.parse(ls)
            const order = new this(json.name, json.videos.map(ListVideo.fromJSON), json.page, json.hasNext, json.createdAt)

            if (new Date().getTime() - order.createdAt < this.lifetime)
                return order
        }

        return new this(name, [], 1, true)
    }
}
