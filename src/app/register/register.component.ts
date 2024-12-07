import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importar herramientas de formularios reactivos

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent {
  // Definir el formulario reactivo
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Crear el formulario con validaciones
    this.registerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],  // Validación para DNI (8 dígitos)
      nombre: ['', Validators.required],  // Nombre requerido
      apellido: ['', Validators.required],  // Apellido requerido
      foto: [null],  // Foto opcional
      email: ['', [Validators.required, Validators.email]],  // Validación para email
      password: ['', [Validators.required, Validators.minLength(6)]],  // Contraseña con min. 6 caracteres
      confirmPassword: ['', Validators.required],  // Confirmar contraseña
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
}
