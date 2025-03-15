import { Component } from '@angular/core';
import {ErrorPageComponent} from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-unauthorized',
  imports: [
    ErrorPageComponent
  ],
  templateUrl: './unauthorized.component.html',
  standalone: true,
})
export class UnauthorizedComponent {

}
