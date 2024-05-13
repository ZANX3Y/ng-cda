import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import ListVideo from '../../../../shared/ListVideo'
import { VideoCardComponent } from '../video-card/video-card.component'

@Component({
    selector: 'app-video-list',
    standalone: true,
    imports: [
        CommonModule,
        InfiniteScrollModule,
        ProgressSpinnerModule,
        VideoCardComponent,
    ],
    templateUrl: './video-list.component.html',
})
export class VideoListComponent {
    @Input() videos: ListVideo[] = []
    @Input() hasNext = false
    @Input() load = () => {}
}
