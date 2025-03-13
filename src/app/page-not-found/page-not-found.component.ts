import { Component } from '@angular/core';
import {MatAnchor} from '@angular/material/button';
import {ErrorPageComponent} from '../components/error-page/error-page.component';

@Component({
  selector: 'app-page-not-found',
  imports: [
    MatAnchor,
    ErrorPageComponent
  ],
  templateUrl: './page-not-found.component.html',
  standalone: true,
})
export class PageNotFoundComponent {
}
