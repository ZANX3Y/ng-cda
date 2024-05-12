import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router'
import ListVideo from '../../../../shared/ListVideo'

@Component({
  selector: 'app-video-card',
  standalone: true,
    imports: [
        RouterLink,
    ],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.sass'
})
export class VideoCardComponent {
    @Input() video!: ListVideo
}
