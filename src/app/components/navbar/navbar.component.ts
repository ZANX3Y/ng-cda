import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { ButtonModule } from 'primeng/button'
import { InputGroupModule } from 'primeng/inputgroup'
import { SearchService } from '../../data/search.service'

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        AutoCompleteModule,
        ButtonModule,
        FormsModule,
        InputGroupModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.sass',
})
export class NavbarComponent {
    @Input() toggleSidebar = () => {}
    searchQuery = ''
    searchSuggestions: string[] = []

    constructor(
        private router: Router,
        private messageService: MessageService,
        private searchService: SearchService,
    ) {}

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
