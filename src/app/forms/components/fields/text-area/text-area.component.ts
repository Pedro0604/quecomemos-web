import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {BaseInputFieldComponent} from '../base-input-field/base-input-field.component';
import {FormService} from '../../../service/form.service';

@Component({
  selector: 'app-text-area',
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSuffix,
    ReactiveFormsModule,
    MatTooltip
  ],
  templateUrl: './text-area.component.html',
  standalone: true,
})
export class TextAreaComponent extends BaseInputFieldComponent {
  constructor(formService: FormService) {
    super(formService);
  }
}
