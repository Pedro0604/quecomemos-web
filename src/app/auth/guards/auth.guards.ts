import {Injectable, signal} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  redirectToLogin = signal(true);

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(): boolean {
    // TODO - MODIFICAR PARA QUE PERMITA ACCEDER SI TIENE EL PERMISO
    if (!this.authService.isLoggedIn()) {
      if (this.redirectToLogin()) {
        this.router.navigate(['/login']);
      }
      return false;
    }
    return true;
  }
}

