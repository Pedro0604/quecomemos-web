import {AfterViewInit, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LayoutService} from "../../layout/layout.service";
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../notification/notification.service';
import {
  FormErrorService,
  onlyLettersValidator,
  onlyNumbersValidator,
  urlValidator
} from '../../formError/form-error.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule],
})
export class RegisterComponent implements AfterViewInit {

  registerForm: FormGroup;
  errorMessages: { [key: string]: string } = {};

  constructor(
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private formErrorService: FormErrorService
  ) {

    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), onlyNumbersValidator]],
      nombre: ['', [Validators.required, onlyLettersValidator]],
      apellido: ['', [Validators.required, onlyLettersValidator]],
      urlImagen: ['', [Validators.required, urlValidator]],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      confirmClave: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('clave')?.value;
    const confirmPassword = group.get('confirmClave')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmClave')?.setErrors({passwordsDoNotMatch: true});
      return {passwordsDoNotMatch: true};
    }
    return null;
  }

  register() {
    if (this.registerForm.valid) {
      const datosRegistro = this.registerForm.value;
      this.http
        .post('http://localhost:8080/clientes', datosRegistro, {observe: 'response'})
        .subscribe({
          next: () => {
            this.notificationService.show('Usuario registrado exitosamente');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            if (error.status === 400) {
              const mensaje = error.error?.message || 'El usuario ya existe.';
              this.notificationService.show(mensaje);
            } else {
              this.notificationService.show('Error al registrar el usuario. Por favor, intente más tarde.');
            }
          },
          complete: () => {
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
      this.notificationService.show('El formulario contiene errores. Por favor, revisa los campos.');
    }
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Registro de usuario');
  }

  updateErrorMessage(controlName: string) {
    const control = this.registerForm.get(controlName);
    this.errorMessages[controlName] = this.formErrorService.updateErrorMessage(control);
  }
}
