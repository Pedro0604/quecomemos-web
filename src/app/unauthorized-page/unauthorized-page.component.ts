import { Component } from '@angular/core';
import {ErrorPageComponent} from '../components/error-page/error-page.component';

@Component({
  selector: 'app-unauthorized-page',
  imports: [
    ErrorPageComponent
  ],
  templateUrl: './unauthorized-page.component.html',
  standalone: true,
})
export class UnauthorizedPageComponent {

}
