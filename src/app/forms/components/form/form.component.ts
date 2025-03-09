import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  FocusFirstInvalidFieldDirective
} from '../../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';

@Component({
  selector: 'app-form',
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    FocusFirstInvalidFieldDirective,
  ],
  templateUrl: './form.component.html',
  standalone: true,
})
export class FormComponent {
  @Input({required: true}) formGroup!: FormGroup;
  @Input() maxWidth: string = 'max-w-2xl';

  @Output() submit = new EventEmitter<any>();
}
