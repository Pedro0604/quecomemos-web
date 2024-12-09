import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = signal(true);
  loginError = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      clave: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  toggleHide() {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credenciales = {
        dni: this.loginForm.get('dni')?.value,
        clave: this.loginForm.get('clave')?.value,
      };
      console.log("credenciales: " + this.loginForm.get('dni')?.value + " " + this.loginForm.get('clave')?.value);
      this.http
        .post('/clientes/autenticacion', credenciales, { observe: 'response' })
        .subscribe(
          (response) => {
            const token = response.headers.get('Authorization');
            if (token) {
              localStorage.setItem('authToken', token);
              this.router.navigate(['/home']);
            }
          },
          () => {
            this.http
              .post('/responsables/autenticacion', credenciales, { observe: 'response' })
              .subscribe(
                (response) => {
                  const token = response.headers.get('Authorization');
                  if (token) {
                    localStorage.setItem('authToken', token);
                    this.router.navigate(['/home']);
                  }
                },
                () => {
                  this.http
                    .post('/administradores/autenticacion', credenciales, { observe: 'response' })
                    .subscribe(
                      (response) => {
                        const token = response.headers.get('Authorization');
                        if (token) {
                          localStorage.setItem('authToken', token);
                          this.router.navigate(['/home']);
                        }
                      },
                      () => {
                        this.loginError = true;
                      }
                    );
                }
              );
          }
        );
    }
  }
}
