import { CommonModule } from '@angular/common'
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TagModule } from 'primeng/tag'
import Video from '../../../../shared/Video'
import { VideoService } from '../../data/video.service'
import { CommentComponent } from '../comment/comment.component'
import { VideoCardComponent } from '../video-card/video-card.component'

@Component({
    selector: 'app-video',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        CommentComponent,
        MenuModule,
        ProgressSpinnerModule,
        TagModule,
        VideoCardComponent,
    ],
    templateUrl: './video.component.html',
    styleUrl: './video.component.sass',
})
export class VideoComponent implements OnInit, OnDestroy {
    @ViewChild('player') player?: ElementRef<HTMLVideoElement>

    data?: Video
    qualityMenuItems: MenuItem[] = []

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private videoService: VideoService,
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
                    this.qualityMenuItems = Object.keys(data.qualities).map(quality => ({
                        label: quality,
                        command: () => {
                            console.log(`Selected quality: ${quality} - ${data.qualities[quality]}`)
                            this.changeQuality(data.qualities[quality])
                        }
                    }))
                })
        })
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
}
