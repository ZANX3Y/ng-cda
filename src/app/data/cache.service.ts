import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import ListVideo from '../../../shared/ListVideo'
import CacheList from './CacheList'

@Injectable({
    providedIn: 'root',
})
export default abstract class CacheService<T extends CacheList> {
    protected items: Record<string, T> = {}

    constructor(
        protected http: HttpClient,
    ) {}

    protected abstract create(key: string): T

    protected getItem(key: string): T {
        if (!this.items[key])
            this.items[key] = this.create(key)

        return this.items[key]
    }

    protected abstract fetch(key: string, page: number): Observable<any>

    getVideos = (key: string): ListVideo[] =>
        this.getItem(key).videos

    hasNext = (key: string): boolean =>
        this.getItem(key).hasNext

    loadVideos = (key: string): Observable<ListVideo[]> =>
        new Observable(observer => {
            const item = this.getItem(key)

            this.fetch(key, item.page).subscribe((response: any) => {
                const videos = response.videos.map(ListVideo.fromJSON)
                    .filter((v: ListVideo) => !item.videos.some(v2 => v2.id === v.id))

                item.videos.push(...videos)
                item.page++
                item.hasNext = response.hasNext as boolean
                item.save()

                observer.next(item.videos)
                observer.complete()
            })
        })
}
