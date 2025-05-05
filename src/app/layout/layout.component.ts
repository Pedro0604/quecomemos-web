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
import {ActivatedRouteSnapshot, RouterLink, RouterLinkActive, Routes} from '@angular/router';
import {appRoutes} from '../app.routes';
import {LayoutService} from './layout.service';
import {AuthGuard} from '../auth/guards/auth.guards';
import {AuthService} from '../auth/service/auth.service';
import {DefaultImageDirective} from '../directives/default-image-directive/default-image.directive';
import {Entidad, getEntidadLink} from '../permiso/entidad';
import {Accion} from '../permiso/accion';


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
    DefaultImageDirective,
  ]
})
export class LayoutComponent implements OnInit {
  rootRoutes: Routes = [];
  title: string = '';
  extra: TemplateRef<any> | null = null;
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private layoutService: LayoutService,
    private injector: Injector,
    protected authService: AuthService
  ) {
  }

  filtrarRutas() {
    this.rootRoutes = appRoutes.filter(route => {
      if (!route.path) {
        return false;
      }
      if (route.path.includes(':')) {
        return false;
      }
      if (!route.data?.['includeInLayout']) {
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
            const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();

            mockActivatedRouteSnapshot.params = {};
            mockActivatedRouteSnapshot.queryParams = {};
            mockActivatedRouteSnapshot.url = [];
            if (route.data) {
              mockActivatedRouteSnapshot.data = route.data;
            }

            guardInstance.allowAccessWithoutRedirect();
            const canActivateReturnValue = guardInstance.canActivate(mockActivatedRouteSnapshot);
            guardInstance.resetRedirect();

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

    this.authService.usuario$.subscribe(() => {
      this.filtrarRutas();
    });
  }

  protected readonly Accion = Accion;
  protected readonly Entidad = Entidad;
  protected readonly getEntidadLink = getEntidadLink;
}
