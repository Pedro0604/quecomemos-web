import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
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
