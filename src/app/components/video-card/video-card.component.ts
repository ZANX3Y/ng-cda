import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router'
import { SkeletonModule } from 'primeng/skeleton'
import ListVideo from '../../../../shared/ListVideo'

@Component({
  selector: 'app-video-card',
  standalone: true,
    imports: [
        RouterLink,
        SkeletonModule,
    ],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.sass'
})
export class VideoCardComponent {
    @Input() video!: ListVideo
    @Input() thumbnailSize = '768x432'

    get thumbnail() {
        return this.video.thumb.replace(/_\d+x\d+\.jpg$/, `_${this.thumbnailSize}.jpg`)
    }
}
