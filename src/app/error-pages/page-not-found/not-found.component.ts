import { Component } from '@angular/core';
import {MatAnchor} from '@angular/material/button';
import {ErrorPageComponent} from '../../components/error-page/error-page.component';

@Component({
  selector: 'app-not-found',
  imports: [
    MatAnchor,
    ErrorPageComponent
  ],
  templateUrl: './not-found.component.html',
  standalone: true,
})
export class NotFoundComponent {
}
