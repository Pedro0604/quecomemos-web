import {Component, Input, numberAttribute} from '@angular/core';
import {BaseFormFieldComponent} from '../base-form-field/base-form-field.component';

@Component({
  selector: 'app-base-input-field',
  imports: [],
  templateUrl: '',
  standalone: true,
})
export abstract class BaseInputFieldComponent extends BaseFormFieldComponent {
  @Input({transform: numberAttribute}) maxLength: number | null = null;
  @Input({transform: numberAttribute}) minLength: number | null = null;

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
