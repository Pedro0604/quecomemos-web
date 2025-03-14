import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu/list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './auth/guards/auth.guards';
import {MenuFormComponent} from './menu/form/menu-form.component';
import {ComidaFormComponent} from './comida/form/comida-form.component';
import {ComidaListComponent} from './comida/list/comida-list.component';
import {MenuDiarioListComponent} from './menu-diario/list/menu-diario-list.component';
import {MenuDiarioFormComponent} from './menu-diario/form/menu-diario-form.component';
import {UserFormComponent} from './user/form/user-form.component';
import {UnauthorizedPageComponent} from './unauthorized-page/unauthorized-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/carta',
    pathMatch: 'full'
  },
  {
    path: 'carta',
    component: HomeComponent,
    title: 'Carta Semanal',
    data: {
      includeInLayout: true
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de Sesión'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro de Usuario'
  },
  {
    path: 'menu-diario',
    component: MenuDiarioListComponent,
    title: 'Menús Diarios',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_menu_diario',
      includeInLayout: true
    }
  },
  {
    path: 'menu-diario/create',
    component: MenuDiarioFormComponent,
    title: 'Crear un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear_menu_diario',
      includeInLayout: true
    }
  },
  {
    path: 'menu-diario/edit/:id',
    component: MenuDiarioFormComponent,
    title: 'Editar un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar_menu_diario'
    }
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Menús',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_menu',
      includeInLayout: true
    }
  },
  {
    path: 'menu/create',
    component: MenuFormComponent,
    title: 'Crear un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear_menu',
      includeInLayout: true
    }
  },
  {
    path: 'menu/edit/:id',
    component: MenuFormComponent,
    title: 'Editar un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar_menu'
    }
  },
  {
    path: 'comidas',
    component: ComidaListComponent,
    title: 'Comidas',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_comida',
      includeInLayout: true
    }
  },
  {
    path: 'comida/create',
    component: ComidaFormComponent,
    title: 'Crear una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear_comida',
      includeInLayout: true
    }
  },
  {
    path: 'comida/edit/:id',
    component: ComidaFormComponent,
    title: 'Editar una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar_comida'
    }
  },
  {
    path: 'clientes/:id',
    component: UserFormComponent,
    title: 'Mi Perfil',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar_cliente'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPageComponent,
    title: 'Acceso Denegado'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'No encontrado'
  }
];
