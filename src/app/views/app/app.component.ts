import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { NavbarComponent } from '../../components/navbar/navbar.component'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        NavbarComponent,
        RouterOutlet,
        SidebarComponent,
        ToastModule,
    ],
    providers: [
        MessageService,
    ],
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    sidebarActive = false

    constructor(
        private primengConfig: PrimeNGConfig,
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
    }

    toggleSidebar = (state = !this.sidebarActive) => this.sidebarActive = state
}
