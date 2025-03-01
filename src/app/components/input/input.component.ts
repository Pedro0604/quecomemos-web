import {Component, Input, numberAttribute, signal} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {BaseFormFieldComponent} from '../base-form-field/base-form-field.component';
import {FormService} from '../../form-service/form.service';

@Component({
  selector: 'app-input',
  imports: [
    MatLabel,
    MatError,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatSuffix,
    MatHint,
    MatPrefix,
  ],
  templateUrl: './input.component.html',
  standalone: true,
  styleUrl: './input.component.css',
})
export class InputComponent extends BaseFormFieldComponent {
  @Input({required: true}) type: string = '';
  @Input({transform: numberAttribute}) maxLength: number | null = null;
  @Input({transform: numberAttribute}) minLength: number | null = null;

  hide = signal(true);

  constructor(formService: FormService) {
    super(formService);
  }

  toggleHide() {
    this.hide.set(!this.hide());
  }

  getHintText(): string {
    if (this.minLength !== null && this.control.value?.length < this.minLength) {
      return `${this.control.value.length}/${this.minLength}`;
    }
    if (this.control.value) {
      return `${this.control.value.length}${this.maxLength ? '/' + this.maxLength : ''}`
    }
    return '';
  }

  getHintClass(): string {
    if (this.hint) {
      return '';
    }
    if ((this.maxLength !== null && this.control.value?.length > this.maxLength) || (this.minLength !== null && this.control.value?.length < this.minLength)) {
      return 'error';
    }
    return 'text-green-600';
  }
}
