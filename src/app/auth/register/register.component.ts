import {AfterViewInit, Component} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar herramientas de formularios reactivos
import { CommonModule } from '@angular/common';
import {LayoutService} from "../../layout/layout.service";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Opcional, para íconos
import { MatCardModule } from '@angular/material/card';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../notification/notification.service';


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

  constructor(private layoutService: LayoutService, private fb: FormBuilder, private http: HttpClient, private router: Router, private notificationService: NotificationService) {

    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^\d+$/)]],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      urlImagen: ['', [Validators.required, Validators.pattern(/^(https?:\/\/[^\s$.?#].[^\s]*)$/)]],
      email: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      confirmClave: ['', Validators.required],
    }, {
      // Validación personalizada para comprobar que las contraseñas coincidan
      validators: this.passwordMatchValidator
    });
  }

  // Método de validación personalizada para comparar las contraseñas
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('clave')?.value;
    const confirmPassword = group.get('confirmClave')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmClave')?.setErrors({ passwordsDoNotMatch: true });
      return {passwordsDoNotMatch: true};
    }
    return null;
  }

  // Método para manejar el envío del formulario
  register() {
    if (this.registerForm.valid) {
      const datosRegistro = this.registerForm.value;
      this.http
        .post('http://localhost:8080/clientes',  datosRegistro, { observe: 'response' })
        .subscribe({
          next: () => {
            this.notificationService.show('Usuario registrado exitosamente');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            if (error.status === 400) {
              const mensaje = error.error?.message || 'El usuario ya existe.';
              this.notificationService.show(mensaje); // Muestra el mensaje de error
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
}
