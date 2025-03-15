import {booleanAttribute, Component, Input} from '@angular/core';
import {MatError} from '@angular/material/form-field';
import {SpinnerComponent} from '../../../components/spinner/spinner.component';

@Component({
  selector: 'app-form-state',
  imports: [
    SpinnerComponent,
    MatError
  ],
  templateUrl: './form-state.component.html',
  standalone: true
})
export class FormStateComponent {
  @Input({transform: booleanAttribute}) loading = false;
  @Input({transform: booleanAttribute}) error = false;
}
