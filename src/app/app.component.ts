import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatAnchor} from '@angular/material/button';
import {LayoutComponent} from './layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  standalone: true
})
export class AppComponent {
  title = 'quecomemos-web';
}
