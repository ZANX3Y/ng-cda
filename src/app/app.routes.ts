import { Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'top', component: HomeComponent },
    { path: 'new', component: HomeComponent },
    { path: 'category/:id', component: HomeComponent },
    { path: 'search/:query', component: HomeComponent },
]
