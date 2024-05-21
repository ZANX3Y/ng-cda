import { Routes } from '@angular/router'
import { HistoryComponent } from './components/history/history.component'
import { HomeComponent } from './components/home/home.component'
import { VideoComponent } from './components/video/video.component'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'top', component: HomeComponent },
    { path: 'new', component: HomeComponent },
    { path: 'category/:id', component: HomeComponent },
    { path: 'search/:query', component: HomeComponent },
    { path: 'video/:id', component: VideoComponent },
    { path: 'history', component: HistoryComponent },
]
