import { CommonModule } from '@angular/common'
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { FieldsetModule } from 'primeng/fieldset'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import Config from '../../data/Config'

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        FieldsetModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
    ],
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    protected readonly Config = Config
}
