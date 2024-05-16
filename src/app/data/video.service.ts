import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import ApiError from '../../../shared/ApiError'
import Comment from '../../../shared/Comment'
import Video from '../../../shared/Video'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class VideoService {
    constructor(
        private http: HttpClient,
    ) {}

    getVideo = (id: string): Observable<Video> =>
        new Observable(observer => {
            this.http.post(Config.api('/video'), { id }).subscribe((response: any) => {
                if (response.error) {
                    observer.error(ApiError.fromId(response.error))
                    observer.complete()
                    return
                }

                observer.next(Video.fromJSON(response))
                observer.complete()
            })
        })

    changeQuality = (video: Video, quality: string): Observable<string> =>
        new Observable(observer => {
            this.http.post(Config.api('/video/file'), {
                id: video.id,
                quality,
                client: video.client,
            }).subscribe((response: any) => {
                video.client.sequence++

                if (response.error) {
                    observer.error(ApiError.fromId(response.error))
                    observer.complete()
                    return
                }

                video.quality = quality
                video.file = response.file

                observer.next(response.file)
                observer.complete()
            })
        })

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
}
