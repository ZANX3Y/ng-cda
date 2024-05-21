import { Routes } from '@angular/router'
import { HistoryComponent } from './views/history.component'
import { HomeComponent } from './views/home.component'
import { SettingsComponent } from './views/settings/settings.component'
import { VideoComponent } from './views/video/video.component'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'top', component: HomeComponent },
    { path: 'new', component: HomeComponent },
    { path: 'category/:id', component: HomeComponent },
    { path: 'search/:query', component: HomeComponent },
    { path: 'video/:id', component: VideoComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'settings', component: SettingsComponent },
]
