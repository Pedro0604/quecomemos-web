import {Component, Input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {FormGroup} from '@angular/forms';
import {FormService} from '../../form-service/form.service';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-submit-button',
  imports: [
    MatButton,
    MatTooltip
  ],
  templateUrl: './submit-button.component.html',
  standalone: true
})
export class SubmitButtonComponent {
  @Input({required: true}) form!: FormGroup;
  @Input() pendingText = 'Enviando';
  @Input() error: boolean = false;
  @Input() loading: boolean = false;

  constructor(protected formService: FormService) {
  }
}
