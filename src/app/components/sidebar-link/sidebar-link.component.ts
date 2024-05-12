import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-sidebar-link',
  standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
    ],
  templateUrl: './sidebar-link.component.html',
  styleUrl: './sidebar-link.component.sass'
})
export class SidebarLinkComponent {
    @Input() link: string = ''
    @Input() icon: string = ''
    @Input() label: string = ''
}
