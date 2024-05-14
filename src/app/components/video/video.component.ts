import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { TagModule } from 'primeng/tag'
import Video from '../../../../shared/Video'
import { VideoService } from '../../data/video.service'
import { VideoCardComponent } from '../video-card/video-card.component'

@Component({
    selector: 'app-video',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        TagModule,
        VideoCardComponent,
        ProgressSpinnerModule,
        MenuModule,
    ],
    templateUrl: './video.component.html',
    styleUrl: './video.component.sass',
})
export class VideoComponent implements OnInit {
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
                        command: () => console.log(`Selected quality: ${quality} - ${data.qualities[quality]}`)
                    }))
                })
        })
    }
}