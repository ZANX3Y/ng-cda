import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { PrimeNGConfig } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import Category from '../../../../shared/Category'
import Config from '../../data/Config'
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        DividerModule,
        FormsModule,
        InputTextModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        InputGroupModule,
        SidebarLinkComponent,
    ],
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.sass',
        '../sidebar-link/sidebar-link.component.sass'
    ],
})
export class AppComponent implements OnInit {
    protected Config = Config
    sidebarActive = false

    categories: Category[] = []

    constructor(
        private primengConfig: PrimeNGConfig,
        private router: Router,
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
        this.router.events.subscribe(() => this.sidebarActive = false)
    }
}
