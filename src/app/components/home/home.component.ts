import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { ButtonModule } from 'primeng/button'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { Subscription } from 'rxjs'
import ListVideo from '../../../../shared/ListVideo'
import { HomeService } from '../../data/home.service'
import { VideoCardComponent } from '../video-card/video-card.component'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        InfiniteScrollModule,
        ProgressSpinnerModule,
        VideoCardComponent,
    ],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    sub?: Subscription
    isLoading = false
    view = 'default'

    constructor(
        private router: Router,
        private service: HomeService,
    ) {}

    ngOnInit() {
        this.initView()
        this.sub = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) this.initView()
        })
    }

    ngOnDestroy() {
        this.sub?.unsubscribe()
    }

    get videos(): ListVideo[] {
        return this.service.getVideos(this.view)
    }

    get hasNext(): boolean {
        return this.service.hasNext(this.view)
    }

    initView = () => {
        const parts = this.router.url.split('/')
        this.view = parts[parts.length - 1] || 'default'
        window.scrollTo(0, 0)
        this.initLoad()
    }

    /**
     * Loads videos until page becomes scrollable
     */
    initLoad = () => this.loadVideos(() => {
        if (document.body.scrollHeight <= window.innerHeight)
            this.initLoad()
    })

    loadVideos = (callback: () => void = () => {}) => {
        if (this.isLoading || !this.service.hasNext(this.view)) return

        this.isLoading = true

        this.service.loadVideos(this.view).subscribe(() => {
            this.isLoading = false
            callback()
        })
    }
}
