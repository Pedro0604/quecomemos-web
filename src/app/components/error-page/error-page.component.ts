import {Component, Input, numberAttribute} from '@angular/core';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'app-error-page',
  imports: [
    MatAnchor
  ],
  templateUrl: './error-page.component.html',
  standalone: true
})
export class ErrorPageComponent {
  @Input({required: true, transform: numberAttribute}) codigoError!: number;
  @Input({required: true}) mensajeError!: string;
}
