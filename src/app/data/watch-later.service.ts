import { Injectable } from '@angular/core'
import ListVideo from '../../../shared/ListVideo'

@Injectable({
    providedIn: 'root',
})
export class WatchLaterService {
    private static readonly wlKey = 'WL'
    private wl: ListVideo[] = []

    constructor() {
        this.load()

        window.addEventListener('storage', e => {
            if (e.key === WatchLaterService.wlKey)
                this.load()
        })
    }

    private load() {
        const ls = localStorage.getItem(WatchLaterService.wlKey)
        if (ls) this.wl = JSON.parse(ls).map(ListVideo.fromJSON)
    }

    private save() {
        localStorage.setItem(WatchLaterService.wlKey, JSON.stringify(this.wl))
    }

    add(video: ListVideo) {
        const existing = this.wl.findIndex(entry => entry.id === video.id)

        if (existing !== -1)
            this.wl.splice(existing, 1)

        this.wl.unshift(video)

        this.save()
    }

    remove(id: string) {
        const el = this.wl.findIndex(entry => entry.id === id)
        if (el !== -1) this.wl.splice(el, 1)
        this.save()
    }

    getEntry = (id: string) => this.wl.find(entry => entry.id === id)

    getWatchLater = () => this.wl
}
