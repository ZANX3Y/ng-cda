import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import ListVideo from '../../../shared/ListVideo'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    private orders: Record<string, Order> = {}

    constructor(
        private http: HttpClient,
    ) {}

    private getOrder(view: string): Order {
        if (!this.orders[view])
            this.orders[view] = Order.create(view)

        return this.orders[view]
    }

    private fetchVideos(page: number, order: string) {
        return this.http.post(Config.api('/home'), { page, order })
    }

    getVideos = (view: string): ListVideo[] =>
        this.getOrder(view).videos

    hasNext = (view: string): boolean =>
        this.getOrder(view).hasNext

    loadVideos = (view: string): Observable<ListVideo[]> =>
        new Observable((observer) => {
            const order = this.getOrder(view)

            this.fetchVideos(order.page, view).subscribe((response: any) => {
                const videos = response.videos.map(ListVideo.fromJSON)
                    .filter((v: ListVideo) => !order.videos.some(v2 => v2.id === v.id))

                order.videos.push(...videos)
                order.page++
                order.hasNext = response.hasNext as boolean
                order.save()

                observer.next(order.videos)
                observer.complete()
            })
        })
}

class Order {
    private static readonly LIFETIME = 2 * 60 * 1000

    private constructor(
        public name: string,
        public videos: ListVideo[],
        public page: number,
        public hasNext: boolean,
        public createdAt: number = new Date().getTime()
    ) {}

    save() {
        localStorage.setItem(`Cache.Order-${this.name}`, JSON.stringify(this))
    }

    static create(name: string) {
        const ls = localStorage.getItem(`Cache.Order-${name}`)

        if (ls) {
            const json = JSON.parse(ls)
            const order = new Order(json.name, json.videos.map(ListVideo.fromJSON), json.page, json.hasNext, json.createdAt)

            if (new Date().getTime() - order.createdAt < Order.LIFETIME)
                return order
        }

        return new Order(name, [], 1, true)
    }
}
