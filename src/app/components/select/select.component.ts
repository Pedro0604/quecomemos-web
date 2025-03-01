import {Component, Input} from '@angular/core';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {BaseFormFieldComponent} from '../base-form-field/base-form-field.component';
import {FormService} from "../../form-service/form.service";

@Component({
  selector: 'app-select',
  imports: [
    MatLabel,
    MatSelect,
    MatError,
    MatFormField,
    ReactiveFormsModule,
    MatPrefix,
    MatHint,
    MatOption,
  ],
  templateUrl: './select.component.html',
  standalone: true,
})
export class SelectComponent extends BaseFormFieldComponent {
  @Input({required: true}) opciones: {value: string | number, name: string}[] = [];

  constructor(formService: FormService) {
    super(formService);
  }

  override get clearable(): boolean {
    return this._clearable == null ? !this.required : this._clearable;
  }
}
