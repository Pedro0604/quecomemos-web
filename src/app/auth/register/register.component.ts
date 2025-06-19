import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {AuthService} from '../service/auth.service';
import {
  confirmationMatchesPasswordValidator,
  FormService,
  onlyLettersValidator,
  onlyNumbersValidator,
  urlValidator
} from '../../forms/service/form.service';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {TitleComponent} from '../../components/title/title.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {ClientDTO, Credenciales} from '../../user/user.model';

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
    InputComponent,
    SubmitButtonComponent,
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
      email: [''],
      clave: [''],
      confirmClave: [''],
    }, {
      validators: confirmationMatchesPasswordValidator
    });
  }

  register() {
    if (this.registerForm.valid) {
      const clientData: ClientDTO = {
        dni: this.registerForm.get('dni')?.value,
        nombre: this.registerForm.get('nombre')?.value,
        apellido: this.registerForm.get('apellido')?.value,
        urlImagen: this.registerForm.get('urlImagen')?.value,
        email: this.registerForm.get('email')?.value,
        clave: this.registerForm.get('clave')?.value,
      };

      this.authService.registerClient(clientData).subscribe({
        next: () => {
          this.notificationService.show('Usuario registrado exitosamente');
          const credenciales: Credenciales = {
            dni: clientData.dni,
            clave: clientData.clave
          };
          this.authService.authenticate(credenciales).subscribe({
            next: (response) => {
              if (response && response.headers && response.headers.get('Authorization')) {
                const token = response.headers.get('Authorization');
                this.authService.login(token);
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
          console.log(error);
          const mensaje = error.status === 400 ? error.error || 'El usuario ya existe.' : 'Error al registrar el usuario. Por favor, intente más tarde.';
          this.notificationService.show(mensaje);
        }
      });
    } else {
      this.formService.validateAllFields(this.registerForm);
    }
  }
}
