import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import Comment from '../../../../shared/Comment'
import Video from '../../../../shared/Video'
import { VideoService } from '../../data/video.service'

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.sass',
})
export class CommentComponent {
    @Input() comment!: Comment
    @Input() parent?: Comment
    @Input() video!: Video

    loadingReplies = false
    showReplies = false

    constructor(
        private videoService: VideoService,
    ) {}

    toggleReplies() {
        this.showReplies = !this.showReplies
        if (this.showReplies && !this.loadingReplies && this.comment.replies.length != this.comment.replyCount)
            this.loadReplies()
    }

    loadReplies() {
        this.loadingReplies = true
        this.comment.replies = []

        this.videoService.getReplies(this.video, this.comment)
            .subscribe(() => this.loadingReplies = false)
    }
}
