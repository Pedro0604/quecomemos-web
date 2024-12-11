import {AfterViewInit, Component} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar herramientas de formularios reactivos
import { CommonModule } from '@angular/common';
import {LayoutService} from "../layout/layout.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegisterComponent implements AfterViewInit {

  registerForm: FormGroup;

  constructor(private layoutService: LayoutService, private fb: FormBuilder) {

    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      foto: [null],  // Foto opcional
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      // Validación personalizada para comprobar que las contraseñas coincidan
      validators: this.passwordMatchValidator
    });
  }

  // Método de validación personalizada para comparar las contraseñas
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsDoNotMatch: true }
      : null;
  }

  // Método para manejar el envío del formulario
  register() {
    if (this.registerForm.valid) {
      console.log('Formulario enviado', this.registerForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Registro de usuario');
  }
}
