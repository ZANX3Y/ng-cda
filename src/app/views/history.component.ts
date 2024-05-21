import { Component } from '@angular/core';
import { HistoryService } from '../data/history.service'
import { VideoListComponent } from '../components/video-list/video-list.component'

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        VideoListComponent,
    ],
    template: '<app-video-list [videos]="videos" />',
})
export class HistoryComponent {
    constructor(
        private historyService: HistoryService,
    ) {}

    get videos() {
        return this.historyService.getHistory().map(v => v.data)
    }
}
