import { Component } from '@angular/core';
import { VideoCardAction } from '../components/video-card/video-card.component'
import { VideoListComponent } from '../components/video-list/video-list.component'
import { HistoryService } from '../data/history.service'

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        VideoListComponent,
    ],
    template: '<app-video-list [videos]="videos" [actions]="actions" />',
})
export class HistoryComponent {
    actions = [
        new VideoCardAction('clear', (video) => this.historyService.remove(video.id)),
    ]

    constructor(
        private historyService: HistoryService,
    ) {}

    get videos() {
        return this.historyService.getHistory().map(v => v.data)
    }
}
