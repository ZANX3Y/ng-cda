import { Injectable } from '@angular/core'
import CacheList from './CacheList'
import CacheService from './cache.service'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class HomeService extends CacheService<CacheOrder> {
    protected create = (key: string) => CacheOrder.create(key)

    protected fetch = (order: string, page: number) =>
        this.http.post(Config.api('/home'), { page, order })
}

class CacheOrder extends CacheList {
    static override lifetime = 2 * 60 * 1000
    static override cacheKey = 'Order'
}
