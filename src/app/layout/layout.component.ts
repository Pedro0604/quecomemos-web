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
import {DefaultImageDirective} from '../directives/default-image-directive/default-image.directive';
import {UserService} from '../user/service/user.service';


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
  private breakpointObserver = inject(BreakpointObserver);
  protected userImageSrc: string = 'Sample_User_Icon.png';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  excludedRoutes = [
    'login',
    '**',
    'menu/edit/:id',
    'comida/edit/:id',
    'register',
    'menu-diario/edit/:id',
    'clientes/:id',
    'responsables/:id',
    'administrador/:id'
  ];
  rootRoutes: Routes = [];

  title: string = '';
  extra: TemplateRef<any> | null = null;

  constructor(
    private layoutService: LayoutService,
    private injector: Injector,
    protected authService: AuthService,
    private userService: UserService
  ) {
  }

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
            guardInstance.allowAccessWithoutRedirect();
            const canActivateReturnValue = guardInstance.canActivate();
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

  setUserImg(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    this.userService.getById(userId).subscribe({
      next: (user) => {
        if (user.urlImagen) {
          this.userImageSrc = user.urlImagen;
        }
      },
      error: (error) => {
        console.error('Error al obtener la imagen del usuario');
        console.error(error);
      }
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
    this.setUserImg();
  }
}
