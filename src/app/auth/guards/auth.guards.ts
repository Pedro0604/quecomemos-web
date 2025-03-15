import {Injectable, signal} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {NotificationService} from '../../notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Solo si redirect es true redirige (para que no se redirija en el caso de que se llame a canActivate desde filterRoutes del layout)
  redirect = signal(true);

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn) {
      if (this.redirect()) {
        this.notificationService.show('Debés iniciar sesión para acceder a esta página');
        this.router.navigate(['/login']);
      }
      return false;
    }

    if (this.authService.canAccessRoute(route)) {
      return true;
    } else {
      if (this.redirect()) {
        this.router.navigate(['/unauthorized']);
      }
      return false;
    }
  }

  allowAccessWithoutRedirect() {
    this.redirect.set(false);
  }

  resetRedirect() {
    this.redirect.set(true);
  }
}

