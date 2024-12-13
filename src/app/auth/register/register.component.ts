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
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      urlImagen: ['', Validators.required],
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
    const clave = group.get('clave')?.value;
    const confirmClave = group.get('confirmClave')?.value;
    return clave && confirmClave && clave !== confirmClave
      ? { passwordsDoNotMatch: true }
      : null;
  }

  // Método para manejar el envío del formulario
  register() {
    if (this.registerForm.valid) {
      const datosRegistro = this.registerForm.value;
      this.http
        .post('http://localhost:8080/clientes', datosRegistro, { observe: 'response' })
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
      this.notificationService.show('El formulario contiene errores. Por favor, revisa los campos.');
    }
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Registro de usuario');
  }
}
