import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, NgForm} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    HttpClientModule
  ]
})
export class LoginComponent {
  loginError: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const credenciales = {
        dni: form.value.dni,
        clave: form.value.clave,
      };
      this.http
        .post('/clientes/autenticacion', credenciales, { observe: 'response' })
        .subscribe(
          (response) => {
            const token = response.headers.get('Authorization');
            if (token) {
              localStorage.setItem('authToken', token); // Guardar el token
              // Dar permisos de cliente
              this.router.navigate(['/home']); // Redirigir al home
            }
          },
          (error) => {
            this.http
              .post('/responsables/autenticacion', credenciales, { observe: 'response' })
              .subscribe(
                (response) => {
                  const token = response.headers.get('Authorization');
                  if (token) {
                    localStorage.setItem('authToken', token); // Guardar el token
                    // Dar permisos de responsable
                    this.router.navigate(['/home']); // Redirigir al home
                  }
                },
                (error) => {
                  this.http
                    .post('/administradores/autenticacion', credenciales, { observe: 'response' })
                    .subscribe(
                      (response) => {
                        const token = response.headers.get('Authorization');
                        if (token) {
                          localStorage.setItem('authToken', token); // Guardar el token
                          // Dar permisos de administrador
                          this.router.navigate(['/home']); // Redirigir al home
                        }
                      },
                      (error) => {
                        this.loginError = true;
                        alert('Usuario o contraseña incorrectos');
                      }
                    );
                }
              );
          }
        );
    }
  }
}

