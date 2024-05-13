import { CommonModule } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs'
import { switchCase } from '../../../../server/utils'
import ListVideo from '../../../../shared/ListVideo'
import { CategoryService } from '../../data/category.service'
import { HomeService } from '../../data/home.service'
import { VideoListComponent } from '../video-list/video-list.component'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        VideoListComponent,
    ],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
    sub?: Subscription
    isLoading = false
    mode = 'home'
    view = 'default'

    constructor(
        private router: Router,
        private homeService: HomeService,
        private categoryService: CategoryService,
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

    get service() {
        return switchCase(this.mode, {
            category: this.categoryService,
            default: this.homeService,
        })
    }

    get videos(): ListVideo[] {
        return this.service.getVideos(this.view)
    }

    get hasNext(): boolean {
        return this.service.hasNext(this.view)
    }

    initView = () => {
        const parts = this.router.url.split('/')

        this.mode = switchCase(parts[1], {
            category: 'category',
            default: 'home',
        })

        this.view = parts[parts.length - 1] || switchCase(this.mode, {
            category: 'media',
            default: 'default',
        })

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
