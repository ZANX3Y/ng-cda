import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext'
import { ToastModule } from 'primeng/toast'
import Category from '../../../../shared/Category'
import Config from '../../data/Config'
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component'
import { CategoryService } from '../../data/category.service'
import { SearchService } from '../../data/search.service'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        AutoCompleteModule,
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
        ToastModule,
    ],
    providers: [
        MessageService,
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

    searchQuery = ''
    searchSuggestions: string[] = []

    categories: Category[] = []

    constructor(
        private primengConfig: PrimeNGConfig,
        private router: Router,
        private messageService: MessageService,
        private categoryService: CategoryService,
        private searchService: SearchService,
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true
        this.router.events.subscribe(() => this.sidebarActive = false)
        this.categoryService.getCategories().subscribe(categories => this.categories = categories)
    }

    suggest() {
        const q = this.searchQuery.trim()
        if (q.length < 2) return

        this.searchService.getSuggestions(q)
            .subscribe(it => this.searchSuggestions = it)
    }

    search() {
        const q = this.searchQuery.trim()

        if (q.length >= 2) {
            this.router.navigate(['/search', q.replace(/ /g, '_')])
            return
        }

        this.messageService.add({
            severity: 'contrast',
            summary: 'Nie można wyszukać',
            detail: 'Wprowadzone zapytanie jest za krótkie'
        })
    }
}
