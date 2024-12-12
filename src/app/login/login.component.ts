import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NotificationService} from '../notification.service';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = signal(true);
  loginError = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private notificationService: NotificationService) {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleHide() {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let encontrado = false;
      const credenciales = {
        dni: this.loginForm.get('dni')?.value,
        clave: this.loginForm.get('clave')?.value,
      };
      this.http
        .post('http://localhost:8080/clientes/autenticacion', credenciales, {observe: 'response'})
        .subscribe({
            next: (response) => {
              const token = response.headers.get('authorization');
              if (token) {
                encontrado = true;
                localStorage.setItem('authToken', token);
                this.router.navigate(['/home']);
              }
            },
            error: (error) => {
              console.error('Error al autenticar cliente', error);
              this.notificationService.show('Error al autenticar el cliente');
            },
            complete: () => {
              this.notificationService.show('Cliente autenticado correctamente');
            }
          }
        );
      if (!encontrado) {
        this.http
          .post('http://localhost:8080/responsables/autenticacion', credenciales, {observe: 'response'})
          .subscribe({
              next: (response) => {
                const token = response.headers.get('Authorization');
                if (token) {
                  encontrado = true;
                  localStorage.setItem('authToken', token);
                  this.router.navigate(['/home']);
                }
              },
              error: (error) => {
                console.error('Error al autenticar responsable', error);
                this.notificationService.show('Error al autenticar el responsable');
              },
              complete: () => {
                this.notificationService.show('Responsable autenticado correctamente');
              }
            }
          );
      }
      if (!encontrado) {
        this.http
          .post('http://localhost:8080/administradores/autenticacion', credenciales, {observe: 'response'})
          .subscribe({
            next: (response) => {
              const token = response.headers.get('Authorization');
              if (token) {
                encontrado = true;
                localStorage.setItem('authToken', token);
                this.router.navigate(['/home']);
              }
            },
            error: (error) => {
              console.error('Error al administrador cliente', error);
              this.notificationService.show('Error al administrador el cliente');
            },
            complete: () => {
              this.notificationService.show('Administrador autenticado correctamente');
            }
          });
      }
      if (!encontrado) {
        this.loginError = true;
      }
    }
  }

}
