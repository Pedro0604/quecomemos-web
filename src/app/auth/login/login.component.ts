import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../../notification/notification.service';
import {AuthService} from '../service/auth.service';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {FormService, onlyNumbersValidator} from "../../forms/service/form.service";
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {Credenciales} from '../../user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    InputComponent,
    SubmitButtonComponent,
    TitleComponent,
    FormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = signal(false);

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    protected formService: FormService
  ) {
    this.loginForm = this.fb.group({
      dni: ['', [onlyNumbersValidator]],
      clave: [''],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credenciales: Credenciales = this.loginForm.value;

      this.authService.authenticate(credenciales).subscribe({
        next: (response) => {
          console.log(response);
          if (response && response.headers && response.headers.get("Authorization")) {
            const token = response.headers.get('Authorization');
            this.authService.login(token);
          } else {
            this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
          }
        },
        error: error => {
          if (error.status === 401) {
            this.loginError.set(true);
            this.notificationService.show('Credenciales incorrectas');
          } else {
            this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
          }
        }
      });
    } else {
      this.formService.validateAllFields(this.loginForm);
    }
  }
}
