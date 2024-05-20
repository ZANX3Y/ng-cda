import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import ApiError from '../../../shared/ApiError'
import Comment from '../../../shared/Comment'
import Video from '../../../shared/Video'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(
        private http: HttpClient,
    ) {}

    private get upvoted() {
        return JSON.parse(localStorage.getItem('upvotedComments') || '[]')
    }

    private set upvoted(value) {
        localStorage.setItem('upvotedComments', JSON.stringify(value))
    }

    isUpvoted = (comment: Comment) => this.upvoted.includes(comment.id)

    getReplies = (video: Video, comment: Comment): Observable<Comment[]> =>
        new Observable(observer => {
            this.http.post(Config.api('/video/comment/replies'), {
                id: video.id,
                commentId: comment.id,
                client: video.client,
            }).subscribe((response: any) => {
                video.client.sequence++

                if (response.error) {
                    observer.error(ApiError.fromId(response.error))
                    observer.complete()
                    return
                }

                comment.replies = response.map(Comment.fromJSON)
                comment.replyCount = comment.replies.length

                observer.next(response.map(Comment.fromJSON))
                observer.complete()
            })
        })

    upvote = (video: Video, comment: Comment) =>
        new Observable(observer => {
            this.http.post(Config.api('/video/comment/upvote'), {
                id: video.id,
                commentId: comment.id,
            }).subscribe((response: any) => {
                if (response.error) {
                    observer.error(ApiError.fromId(response.error))
                    observer.complete()
                    return
                }

                comment.points++
                this.upvoted = [...this.upvoted, comment.id]

                observer.next()
                observer.complete()
            })
        })
}
