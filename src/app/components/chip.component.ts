import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-chip',
    standalone: true,
    template: '<span class="px-2 py-0.5 bg-surface-d rounded-full" [textContent]="text"></span>',
})
export class ChipComponent {
    @Input() text?: string
}
