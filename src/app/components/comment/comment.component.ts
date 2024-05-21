import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import Comment from '../../../../shared/Comment'
import Video from '../../../../shared/Video'
import { CommentService } from '../../data/comment.service';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './comment.component.html',
})
export class CommentComponent implements OnInit {
    @Input() comment!: Comment
    @Input() parent?: Comment
    @Input() video!: Video

    loadingReplies = false
    showReplies = false
    isUpvoted = false

    constructor(
        private service: CommentService,
    ) {}

    ngOnInit(): void {
        this.isUpvoted = this.service.isUpvoted(this.comment)
    }

    toggleReplies() {
        this.showReplies = !this.showReplies
        if (this.showReplies && !this.loadingReplies && this.comment.replies.length != this.comment.replyCount)
            this.loadReplies()
    }

    loadReplies() {
        this.loadingReplies = true
        this.comment.replies = []

        this.service.getReplies(this.video, this.comment)
            .subscribe(() => this.loadingReplies = false)
    }

    upvote() {
        if (this.isUpvoted) return

        this.service.upvote(this.video, this.comment)
            .subscribe(() => {
                this.isUpvoted = true
            })
    }
}
