import {Component, inject, Injector, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ActivatedRouteSnapshot, Router, RouterLink, RouterLinkActive, Routes} from '@angular/router';
import {appRoutes} from '../app.routes';
import {LayoutService} from './layout.service';
import {AuthGuard} from '../auth/guards/auth.guards';
import {AuthService} from '../auth/service/auth.service';
import {DefaultImageDirective} from '../directives/default-image-directive/default-image.directive';
import {Entidad, getEntidadLink} from '../permiso/entidad';
import {Accion} from '../permiso/accion';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatBadge} from '@angular/material/badge';
import {Pedido} from '../pedido/pedido.model';


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
    MatBadge,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ]
})
export class LayoutComponent implements OnInit {
  rootRoutes: Routes = [];
  title: string = '';
  extra: TemplateRef<any> | null = null;

  @ViewChild(MatMenuTrigger) carritoTrigger!: MatMenuTrigger;

  isHandset$: Observable<boolean>;

  carrito: Pedido = {
    id: 1,
    clienteId: 42,
    pagoId: null,
    fecha: new Date(),
    total: 1350, // 2x500 + 1x350
    items: [
      {
        id: 1,
        pedidoId: 1,
        precioUnitario: 500,
        cantidad: 2,
        subtotal: 1000,
        item: {
          id: 10,
          nombre: 'Menú Ejecutivo',
          tipo: Entidad.MENU,
          precio: 500
        }
      },
      {
        id: 2,
        pedidoId: 1,
        precioUnitario: 350,
        cantidad: 1,
        subtotal: 350,
        item: {
          id: 5,
          nombre: 'Empanadas de carne',
          tipo: Entidad.COMIDA,
          precio: 350
        }
      }
    ]
  };

  constructor(
    private layoutService: LayoutService,
    private injector: Injector,
    protected authService: AuthService,
    private router: Router,
  ) {
    const breakpointObserver = inject(BreakpointObserver);
    this.isHandset$ = breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );
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

  irACarrito() {
    this.carritoTrigger.closeMenu();  // opcional: asegurarse que cierre
    this.router.navigate(['/carrito']);
  }

  filtrarRutas() {
    this.rootRoutes = appRoutes.filter(route => {
      if (!route.path || route.path.includes(':') || !route.data?.['includeInLayout']) {
        return false;
      }

      if (Array.isArray(route.canActivate)) {
        return route.canActivate.every(guardClass => {
          const guardInstance: AuthGuard = this.injector.get(guardClass, null);
          if (!guardInstance) {
            console.error('No se pudo obtener el guardia:', guardClass);
            return false;
          }

          guardInstance.allowAccessWithoutRedirect();

          const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
          mockActivatedRouteSnapshot.params = {};
          mockActivatedRouteSnapshot.queryParams = {};
          mockActivatedRouteSnapshot.url = [];
          if (route.data) {
            mockActivatedRouteSnapshot.data = route.data;
          }

          const canActivate = guardInstance.canActivate(mockActivatedRouteSnapshot);
          guardInstance.resetRedirect();
          return canActivate;
        });
      }

      return true;
    });
  }

  protected readonly Accion = Accion;
  protected readonly Entidad = Entidad;
  protected readonly getEntidadLink = getEntidadLink;
}
