import {Component, Input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {FormGroup} from '@angular/forms';
import {FormService} from '../../service/form.service';
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
  @Input() disabled: boolean = false;
  @Input() tooltipMessage: string | undefined;

  constructor(protected formService: FormService) {
  }
}
