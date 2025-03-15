import {Component} from '@angular/core';
import {ErrorPageComponent} from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-not-found',
  imports: [ErrorPageComponent],
  templateUrl: './not-found.component.html',
  standalone: true,
})
export class NotFoundComponent {
}
