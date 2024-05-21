import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TagModule } from 'primeng/tag'
import ListVideo from '../../../../shared/ListVideo'
import Video from '../../../../shared/Video'
import { CommentService } from '../../data/comment.service'
import Config from '../../data/Config'
import { VideoService } from '../../data/video.service'
import { CommentComponent } from '../../components/comment/comment.component'
import { VideoCardComponent } from '../../components/video-card/video-card.component'
import { HistoryService } from '../../data/history.service';

@Component({
    selector: 'app-video',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        CommentComponent,
        InfiniteScrollModule,
        MenuModule,
        ProgressSpinnerModule,
        TagModule,
        VideoCardComponent,
    ],
    templateUrl: './video.component.html',
})
export class VideoComponent implements OnInit, OnDestroy {
    @ViewChild('player') player?: ElementRef<HTMLVideoElement>

    data?: Video
    miniData?: ListVideo
    qualityMenuItems: MenuItem[] = []
    hasMoreComments = true

    restored = false
    lastProgressSave = 0

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private videoService: VideoService,
        private commentService: CommentService,
        private historyService: HistoryService,
    ) {}

    ngOnInit(): void {
        this.load()

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) this.load()
        })
    }

    ngOnDestroy(): void {
        this.player?.nativeElement.pause()
    }

    load() {
        this.data = undefined

        this.route.paramMap.subscribe(params => {
            const id = params.get('id')

            if (!id) {
                this.router.navigate(['/'])
                return
            }

            this.videoService.getVideo(id)
                .subscribe(data => {
                    this.data = data;
                    this.miniData = ListVideo.fromVideo(data)

                    this.qualityMenuItems = Object.keys(data.qualities).map(quality => ({
                        label: quality,
                        command: () => {
                            console.log(`Selected quality: ${quality} - ${data.qualities[quality]}`)
                            this.changeQuality(data.qualities[quality])
                        }
                    }))

                    this.hasMoreComments = data.comments.length > 0
                })
        })
    }

    onLoadedMD() {
        if (this.restored) return
        this.restored = true

        const history = this.historyService.getEntry(this.data!.id)

        if (!this.player || !history || (history.progress / history.duration) > 0.99) return

        const player = this.player.nativeElement
        player.currentTime = history.progress
    }

    onProgress(){
        if (!this.miniData || !this.restored) return

        const player = this.player!.nativeElement

        if (player.currentTime - this.lastProgressSave < Config.PROGRESS_SAVE_INTERVAL) return

        this.lastProgressSave = player.currentTime
        this.historyService.add(this.miniData, player.duration, player.currentTime)
    }

    onSeeked() {
        this.lastProgressSave = 0
        this.onProgress()
    }

    changeQuality(quality: string) {
        if (!this.data) return

        const player = this.player!.nativeElement
        const time = player.currentTime
        player.pause()

        this.videoService.changeQuality(this.data, quality)
            .subscribe(() => {
                player.load()
                player.currentTime = time
                player.play()
            })
    }

    loadComments() {
        if (!this.data || !this.hasMoreComments) return

        this.commentService.loadComments(this.data)
            .subscribe(hasMore => this.hasMoreComments = hasMore)
    }
}
