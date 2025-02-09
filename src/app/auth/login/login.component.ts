import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../../notification/notification.service';
import {MatCard, MatCardContent} from '@angular/material/card';
import {AuthService} from './services/auth.service';
import {concatMap, first, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {FormErrorService, onlyNumbersValidator} from '../../formError/form-error.service';
import {LayoutService} from '../../layout/layout.service';

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
    MatCard,
    MatCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessages: { [key: string]: string } = {};
  hide = signal(true);
  loginError = signal(false);
  roles: ('clientes' | 'responsables' | 'administradores')[] = ['clientes', 'responsables', 'administradores'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private formErrorService: FormErrorService,
    private layoutService: LayoutService
  ) {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), onlyNumbersValidator]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleHide() {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credenciales = this.loginForm.value;

      of(...this.roles).pipe(
        concatMap((role) =>
          this.authService.authenticate(role, credenciales).pipe(
            catchError(() => of(null)) // Si falla, retorna null y sigue con el siguiente rol
          )
        ),
        first((response) => response && response.headers && response.headers.get("authorization"), null)// Detiene el flujo en el primer login exitoso
      ).subscribe({
        next: (response) => {
          if (response) {
            const token = response.headers.get('authorization');
            this.authService.login(token);
            this.notificationService.show(`${this.getRoleName(response.url)} autenticado correctamente`);
            this.router.navigate(['/carta']);
          } else {
            this.loginError.set(true);
            this.notificationService.show('Credenciales incorrectas');
          }
        },
        error: () => {
          this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
        }
      });
    } else {
      this.notificationService.show('Error en el formulario. Vuelva a intentarlo');
    }
  }

  private getRoleName(url: string): string {
    if (url.includes('clientes')) return 'Cliente';
    if (url.includes('responsables')) return 'Responsable de turno';
    if (url.includes('administradores')) return 'Administrador';
    return 'Usuario';
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Iniciar sesión');
  }

  updateErrorMessage(controlName: string) {
    const control = this.loginForm.get(controlName);
    this.errorMessages[controlName] = this.formErrorService.updateErrorMessage(control);
  }
}
