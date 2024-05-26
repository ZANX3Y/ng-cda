import { JsonPipe, NgForOf, NgIf } from '@angular/common'
import { Component } from '@angular/core'
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { DividerModule } from 'primeng/divider'
import { ChipComponent } from '../../components/chip.component'
import Config from '../../data/Config'
import DepList from '../../data/dep-list'

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [
        JsonPipe,
        DialogModule,
        NgForOf,
        ChipComponent,
        NgIf,
        DividerModule,
        MarkdownComponent,
        ButtonModule,
    ],
    providers: [
        provideMarkdown(),
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.sass',
})
export class AboutComponent {
    protected readonly Config = Config
    protected readonly deps: Dependency[] = Object.values(DepList)
    depsVisible = false
    selectedDep?: Dependency
    isDepSelected = false

    openLink(url?: string) {
        window.open(url, '_blank')
    }
}

type Dependency = {
    name: string,
    version: string,
    copyright: string,
    licenses: string,
    licenseText: string,
    repository: string,
}
