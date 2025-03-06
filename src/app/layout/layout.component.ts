import {Component, inject, Injector, OnInit, TemplateRef} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {RouterLink, RouterLinkActive, Routes} from '@angular/router';
import {appRoutes} from '../app.routes';
import {LayoutService} from './layout.service';
import {AuthGuard} from '../auth/guards/auth.guards';
import {AuthService} from '../auth/service/auth.service';


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
    NgTemplateOutlet
  ]
})
export class LayoutComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  excludedRoutes = ['login', '**', 'menu/edit/:id', 'comida/edit/:id', 'register', 'menu-diario/edit/:id'];
  rootRoutes: Routes = [];

  title: string = '';
  extra: TemplateRef<any> | null = null;

  constructor(private layoutService: LayoutService, private injector: Injector, protected authService: AuthService) {
  }

  // TODO - MODIFICAR PARA QUE FILTRE SEGÚN EL PERMISO NECESARIO
  filtrarRutas() {
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
            guardInstance.redirectToLogin.set(false);
            const canActivateReturnValue = guardInstance.canActivate();
            guardInstance.redirectToLogin.set(true);
            return canActivateReturnValue;
          }

          console.warn('Guard no tiene un método canActivate válido:', guardClass);
          return false;
        });
      }

      return true;
    });
  }

  ngOnInit(): void {
    this.layoutService.currentTitle$.subscribe((title) => {
      this.title = title;
    });

    this.layoutService.currentExtra$.subscribe((extra) => {
      this.extra = extra;
    });

    this.authService.isLoggedIn$.subscribe(() => {
      this.filtrarRutas();
    });

    this.filtrarRutas();
  }
}
