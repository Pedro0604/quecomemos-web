import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {AsyncPipe, NgIf, NgTemplateOutlet} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {appRoutes} from '../app.routes';
import {LayoutService} from './layout.service';
import {NotificationService} from '../notification.service';
import { jwtDecode } from "C:/Users/frand/IdeaProjects/quecomemos-web/node_modules/jwt-decode/build/esm/index"

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

  rootRoutes = appRoutes.filter(r => r.path && !this.excludedRoutes.includes(r.path) )

  title: string = '';
  extra: TemplateRef<any> | null = null;

  constructor(private layoutService: LayoutService, private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.layoutService.currentTitle$.subscribe((title) => {
      this.title = title;
    });

    this.layoutService.currentExtra$.subscribe((extra) => {
      this.extra = extra;
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

      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}
