import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoComponent {
  @Input() url = 'https://picsum.photos/200/300';
  @Input() width = 300;
  @Input() height = 200;
}
