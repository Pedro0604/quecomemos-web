import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {InputComponent} from '../../components/input/input.component';
import {AuthService, UserData} from '../service/auth.service';
import {FormService, onlyLettersValidator, onlyNumbersValidator, urlValidator} from '../../form-service/form.service';
import {SubmitButtonComponent} from '../../components/submit-button/submit-button.component';
import {
  FocusFirstInvalidFieldDirective
} from '../../directives/focus-first-invalid-field.directive/focus-first-invalid-field.directive';
import {TitleComponent} from '../../components/title/title.component';
import {FormComponent} from "../../components/form/form.component";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    InputComponent,
    SubmitButtonComponent,
    FocusFirstInvalidFieldDirective,
    TitleComponent,
    FormComponent
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    protected formService: FormService,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      dni: ['', [onlyNumbersValidator]],
      nombre: ['', [onlyLettersValidator]],
      apellido: ['', [onlyLettersValidator]],
      urlImagen: ['', [urlValidator]],
      email: ['', [Validators.email]],
      clave: [''],
      confirmClave: [''],
    }, {
      validators: this.confirmationMatchesPasswordValidator
    });
  }

  confirmationMatchesPasswordValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('clave')?.value;
    const confirmPassword = group.get('confirmClave')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmClave')?.setErrors({...group.get('confirmClave')?.errors, passwordsDoNotMatch: true});
      group.get('clave')?.setErrors({...group.get('clave')?.errors, passwordsDoNotMatch: true});
      return {passwordsDoNotMatch: true};
    }
    return null;
  }

  register() {
    if (this.registerForm.valid) {
      const userData: UserData = {
        dni: this.registerForm.get('dni')?.value,
        nombre: this.registerForm.get('nombre')?.value,
        apellido: this.registerForm.get('apellido')?.value,
        urlImagen: this.registerForm.get('urlImagen')?.value,
        email: this.registerForm.get('email')?.value,
        clave: this.registerForm.get('clave')?.value,
      };

      this.authService.register('clientes', userData).subscribe({
        next: () => {
          this.notificationService.show('Usuario registrado exitosamente');
          this.authService.authenticate('clientes', this.registerForm.value).subscribe({
            next: (response) => {
              if (response && response.headers && response.headers.get('authorization')) {
                const token = response.headers.get('authorization');
                this.authService.login(token);
                this.router.navigate(['/']);
              } else {
                this.router.navigate(['/login']);
              }
            },
            error: () => {
              this.router.navigate(['/login']);
            }
          })
        },
        error: (error) => {
          const mensaje = error.status === 400 ? error.error?.message || 'El usuario ya existe.' : 'Error al registrar el usuario. Por favor, intente más tarde.';
          this.notificationService.show(mensaje);
        }
      });
    } else {
      this.formService.validateAllFields(this.registerForm);
    }
  }
}
