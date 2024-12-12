import {Component, inject, Injector, OnInit, TemplateRef} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgIf, NgTemplateOutlet} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Router, RouterLink, RouterLinkActive, Routes} from '@angular/router';
import {appRoutes} from '../app.routes';
import {LayoutService} from './layout.service';
import {NotificationService} from '../notification.service';
import {jwtDecode} from 'jwt-decode';
import {AuthGuard} from '../guards/auth.guards';

interface JwtPayload {
  exp: number; // Tiempo de expiración del token (en segundos desde la época UNIX)
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    NgIf
  ]
})
export class LayoutComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  excludedRoutes = ['login', '**', 'menu/edit/:id', 'comida/edit/:id', 'logout'];
  rootRoutes: Routes = [];

  title: string = '';
  extra: TemplateRef<any> | null = null;

  constructor(private layoutService: LayoutService, private router: Router, private notificationService: NotificationService, private injector: Injector) {
  }

  ngOnInit(): void {
    this.layoutService.currentTitle$.subscribe((title) => {
      this.title = title;
    });

    this.layoutService.currentExtra$.subscribe((extra) => {
      this.extra = extra;
    });

    this.rootRoutes = appRoutes.filter(route => {
      if (!route.path) {
        return false;
      }
      if (this.excludedRoutes.includes(route.path)) {
        return false;
      }

      if (Array.isArray(route.canActivate)) {
        return route.canActivate?.every(guardClass => {
          const guardInstance: AuthGuard = this.injector.get(guardClass, null);

          if (!guardInstance) {
            console.error('No se pudo obtener el guardia:', guardClass);
            return false;
          }

          if (typeof guardInstance.canActivate === 'function') {
            return guardInstance.canActivate();
          }

          console.warn('Guard no tiene un método canActivate válido:', guardClass);
          return false;
        });
      }

      return true;
    });
  }

  logout() {
    // Eliminar el token de localStorage
    localStorage.removeItem('authToken');

    // Redirigir al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
    this.notificationService.show('Sesión cerrada correctamente');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      return decoded.exp * 1000 >= Date.now();


    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}
