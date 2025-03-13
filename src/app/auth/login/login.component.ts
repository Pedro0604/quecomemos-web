import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../../notification/notification.service';
import {AuthService} from '../service/auth.service';
import {concatMap, first, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {FormService, onlyNumbersValidator} from "../../forms/service/form.service";
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {Credenciales, Role} from '../../user/user.model';

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

  roles: Role[] = ['clientes', 'responsables', 'administradores'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
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

      of(...this.roles).pipe(
        concatMap((role) =>
          this.authService.authenticate(role, credenciales).pipe(
            catchError(() => of(null)) // Si falla, retorna null y sigue con el siguiente rol
          )
        ),
        first((response) => response && response.headers && response.headers.get("authorization"), null) // Detiene el flujo en el primer login exitoso
      ).subscribe({
        next: (response) => {
          console.log(response)
          if (response) {
            // Si hay una respuesta, se logró autenticar
            const token = response.headers.get('authorization');
            this.authService.login(token);
          } else {
            // Si no hay respuesta, no se logró autenticar
            this.loginError.set(true);
            this.notificationService.show('Credenciales incorrectas');
          }
        },
        error: () => {
          this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
        }
      });
    } else {
      this.formService.validateAllFields(this.loginForm);
    }
  }
}
