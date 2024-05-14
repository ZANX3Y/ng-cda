import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import ApiError from '../../../shared/ApiError'
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
}
