import {Component, Input, signal} from '@angular/core';
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {FormService} from '../../../service/form.service';
import {MatTooltip} from '@angular/material/tooltip';
import {BaseInputFieldComponent} from '../base-input-field/base-input-field.component';

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
    MatTooltip,
  ],
  templateUrl: './input.component.html',
  standalone: true,
  styleUrl: './input.component.css',
})
export class InputComponent extends BaseInputFieldComponent {
  @Input({required: true}) type: string = '';

  hide = signal(true);

  constructor(formService: FormService) {
    super(formService);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.type === 'email') {
      this.control.addValidators([Validators.email]);
    }
  }

  toggleHide() {
    this.hide.set(!this.hide());
  }
}
