import {Component} from '@angular/core';
import {ErrorPageComponent} from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-forbidden',
  imports: [
    ErrorPageComponent
  ],
  templateUrl: './forbidden.component.html',
  standalone: true
})
export class ForbiddenComponent {

}
