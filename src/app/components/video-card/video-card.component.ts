import { NgForOf, NgIf } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'
import { ProgressBarModule } from 'primeng/progressbar'
import { SkeletonModule } from 'primeng/skeleton'
import ListVideo from '../../../../shared/ListVideo'
import Video from '../../../../shared/Video'
import { HistoryService } from '../../data/history.service'

@Component({
    selector: 'app-video-card',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        ProgressBarModule,
        RouterLink,
        SkeletonModule,
    ],
    templateUrl: './video-card.component.html',
    styleUrl: './video-card.component.sass',
})
export class VideoCardComponent implements OnInit {
    @Input() video!: ListVideo
    @Input() actions: VideoCardAction[] = []
    @Input() thumbnailSize = '768x432'
    watchProgress = 0

    constructor(
        private history: HistoryService,
    ) {}

    get thumbnail() {
        return this.video.thumb.replace(/_\d+x\d+\.jpg$/, `_${this.thumbnailSize}.jpg`)
    }

    get link() {
        return this.video.isPremium ? undefined : ['/video', this.video.id]
    }

    ngOnInit() {
        const entry = this.history.getEntry(this.video.id)
        if (entry) this.watchProgress = (entry.progress / entry.duration) * 100
    }

    onClick() {
        if (!this.video.isPremium) return
        window.open(Video.getLink(this.video.id), '_blank')
    }
}

export class VideoCardAction {
    constructor(
        public icon: string,
        public handler: (video: ListVideo) => void,
    ) {}
}
