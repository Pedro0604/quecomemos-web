import {Injectable, signal} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {NotificationService} from '../../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  redirectToLogin = signal(true);

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // TODO - SI TIENE LOS PERMISOS
    if (!this.authService.isLoggedIn) {
      if (this.redirectToLogin()) {
        this.notificationService.show('Debés iniciar sesión para acceder a esta página');
        this.router.navigate(['/login']);
      }
      return false;
    }

    if (this.authService.canAccessRoute(route)) {
      return true;
    } else {
      this.notificationService.show('No tenés permisos para acceder a esta página');
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }

  allowAccessWithoutRedirect() {
    this.redirectToLogin.set(false);
  }

  resetRedirect() {
    this.redirectToLogin.set(true);
  }
}

