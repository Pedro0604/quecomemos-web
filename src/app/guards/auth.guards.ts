import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (token) {
      // Opcional: Validar el token localmente antes de permitir acceso
      const isTokenValid = this.isTokenValid(token);
      if (isTokenValid) {
        return true; // Permitir el acceso
      }
    }

    // Redirigir al login si no está autenticado
    this.router.navigate(['/login']);
    return false;
  }

  private isTokenValid(token: string): boolean {
    // Aquí podrías implementar una validación básica local, como verificar la expiración del token
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; // Comparar la expiración
    } catch (error) {
      return false; // Token inválido
    }
  }
}

