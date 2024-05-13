import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import Category from '../../../shared/Category'
import CacheList from './CacheList'
import CacheService from './cache.service'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends CacheService<CacheCategory> {
    private readonly categoryListLifetime = 15 * 60 * 1000
    private categoryList: Category[] = []

    protected create = (key: string) => CacheCategory.create(key)

    protected fetch = (id: string, page: number) =>
        this.http.post(Config.api('/home/category'), { id, page })

    getCategories = (): Observable<Category[]> =>
        new Observable(observer => {
            if (this.categoryList.length) {
                observer.next(this.categoryList)
                observer.complete()
                return
            }

            const cache = localStorage.getItem('Cache.CategoryList')
            if (cache) {
                const json = JSON.parse(cache)
                if (json.expires > Date.now()) {
                    this.categoryList = json.data.map(Category.fromJSON)
                    observer.next(this.categoryList)
                    observer.complete()
                    return
                }
            }

            this.http.post(Config.api('/home/categories'), {}).subscribe((response: any) => {
                this.categoryList = response.map(Category.fromJSON)
                localStorage.setItem('Cache.CategoryList', JSON.stringify({
                    data: this.categoryList,
                    expires: Date.now() + this.categoryListLifetime,
                }))
                observer.next(this.categoryList)
                observer.complete()
            })
        })
}

class CacheCategory extends CacheList {
    static override lifetime = 2 * 60 * 1000
    static override cacheKey = 'Category'
}
