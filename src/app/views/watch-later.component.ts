import { Component } from '@angular/core'
import { VideoCardAction } from '../components/video-card/video-card.component'
import { VideoListComponent } from '../components/video-list/video-list.component'
import { WatchLaterService } from '../data/watch-later.service'

@Component({
    selector: 'app-watch-later',
    standalone: true,
    imports: [
        VideoListComponent,
    ],
    template: '<app-video-list [videos]="videos" [actions]="actions" />',
})
export class WatchLaterComponent {
    actions = [
        new VideoCardAction('clear', (video) => this.watchLaterService.remove(video.id)),
    ]

    constructor(
        private watchLaterService: WatchLaterService,
    ) {}

    get videos() {
        return this.watchLaterService.getWatchLater()
    }
}
