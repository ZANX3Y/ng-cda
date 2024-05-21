import { Injectable } from '@angular/core';
import ListVideo from '../../../shared/ListVideo'

@Injectable({
    providedIn: 'root',
})
export class HistoryService {
    private static readonly historyKey = 'History'
    private history: HistoryEntry[] = []

    constructor() {
        this.load()

        window.addEventListener('storage', e => {
            if (e.key === HistoryService.historyKey)
                this.load()
        })
    }

    private load() {
        const ls = localStorage.getItem(HistoryService.historyKey)
        if (ls) this.history = JSON.parse(ls).map(HistoryEntry.fromJSON)
    }

    private save() {
        localStorage.setItem(HistoryService.historyKey, JSON.stringify(this.history))
    }

    add(data: ListVideo, duration: number, progress: number) {
        const id = data.id
        const existing = this.history.findIndex(entry => entry.id === id)

        if (existing !== -1)
            this.history.splice(existing, 1)

        this.history.unshift(new HistoryEntry(id, data, duration, progress))

        this.save()
    }

    getEntry = (id: string) => this.history.find(entry => entry.id === id)

    getHistory = () => this.history
}

class HistoryEntry {
    constructor(
        public id: string,
        public data: ListVideo,
        public duration: number,
        public progress: number
    ) {}

    static fromJSON = (json: any) =>
        new HistoryEntry(
            json.id,
            ListVideo.fromJSON(json.data),
            json.duration,
            json.progress
        )
}
