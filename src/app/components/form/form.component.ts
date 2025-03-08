import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule
  ],
  templateUrl: './form.component.html',
  standalone: true,
})
export class FormComponent {
  @Input({required: true}) form!: FormGroup;
  @Input() maxWidth: string = 'max-w-2xl';

  @Output() submit = new EventEmitter<any>();
}
