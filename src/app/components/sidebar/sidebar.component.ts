import { NgClass, NgForOf, NgStyle } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { DividerModule } from 'primeng/divider'
import Category from '../../../../shared/Category'
import { CategoryService } from '../../data/category.service'
import Config from '../../data/Config'
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component'

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        DividerModule,
        NgClass,
        NgForOf,
        NgStyle,
        RouterLink,
        RouterLinkActive,
        SidebarLinkComponent,
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: [
        './sidebar.component.sass',
        '../../components/sidebar-link/sidebar-link.component.sass',
    ],
})
export class SidebarComponent implements OnInit {
    @Input() toggleSidebar = (_?: boolean) => {}
    @Input() sidebarActive = true
    categories: Category[] = []

    constructor(
        private router: Router,
        private categoryService: CategoryService,
    ) {}

    ngOnInit() {
        this.router.events.subscribe(() => this.toggleSidebar(false))
        this.categoryService.getCategories().subscribe(categories => this.categories = categories)
    }

    protected readonly Config = Config
}
