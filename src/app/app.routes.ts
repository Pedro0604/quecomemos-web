import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {NotFoundComponent} from './error-pages/page-not-found/not-found.component';
import {MenuListComponent} from './menu/list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './auth/guards/auth.guards';
import {MenuFormComponent} from './menu/form/menu-form.component';
import {ComidaFormComponent} from './comida/form/comida-form.component';
import {ComidaListComponent} from './comida/list/comida-list.component';
import {MenuDiarioListComponent} from './menu-diario/list/menu-diario-list.component';
import {MenuDiarioFormComponent} from './menu-diario/form/menu-diario-form.component';
import {UserFormComponent} from './user/form/user-form.component';
import {GuestGuard} from './auth/guards/guest.guards';
import {ForbiddenComponent} from './error-pages/forbidden-page/forbidden.component';
import {SugerenciaListComponent} from './sugerencia/list/sugerencia-list.component';
import {SugerenciaFormComponent} from './sugerencia/form/sugerencia-form.component';
import {BuzonComponent} from './sugerencia/buzon/buzon.component';

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
    title: 'Inicio de Sesión',
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro de Usuario',
    canActivate: [GuestGuard]
  },
  {
    path: 'menu-diario',
    component: MenuDiarioListComponent,
    title: 'Menús Diarios',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_todos:menu_diario',
      includeInLayout: true
    }
  },
  {
    path: 'menu-diario/create',
    component: MenuDiarioFormComponent,
    title: 'Crear un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear:menu_diario',
      includeInLayout: true
    }
  },
  {
    path: 'menu-diario/edit/:id',
    component: MenuDiarioFormComponent,
    title: 'Editar un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar:menu_diario'
    }
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Menús',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_todos:menu',
      includeInLayout: true
    }
  },
  {
    path: 'menu/create',
    component: MenuFormComponent,
    title: 'Crear un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear:menu',
      includeInLayout: true
    }
  },
  {
    path: 'menu/edit/:id',
    component: MenuFormComponent,
    title: 'Editar un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar:menu'
    }
  },
  {
    path: 'comidas',
    component: ComidaListComponent,
    title: 'Comidas',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_todos:comida',
      includeInLayout: true
    }
  },
  {
    path: 'comida/create',
    component: ComidaFormComponent,
    title: 'Crear una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear:comida',
      includeInLayout: true
    }
  },
  {
    path: 'comida/edit/:id',
    component: ComidaFormComponent,
    title: 'Editar una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar:comida'
    }
  },
  {
    path: 'sugerencia',
    component: SugerenciaListComponent,
    title: 'Sugerencias',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_todos:sugerencia',
      includeInLayout: true
    }
  },
  {
    path: 'sugerencia/create',
    component: SugerenciaFormComponent,
    title: 'Crear una Sugerencia',
    canActivate: [AuthGuard],
    data: {
      permiso: 'crear:sugerencia',
      includeInLayout: true
    }
  },
  {
    path: 'sugerencia/edit/:id',
    component: SugerenciaFormComponent,
    title: 'Editar una Sugerencia',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar:sugerencia'
    }
  },
  {
    path: 'buzon',
    component: BuzonComponent,
    title: 'Buzón de sugerencias',
    canActivate: [AuthGuard],
    data: {
      permiso: 'ver_buzon:cliente'
    }
  },
  {
    path: 'clientes/:id',
    component: UserFormComponent,
    title: 'Mi Perfil',
    canActivate: [AuthGuard],
    data: {
      permiso: 'editar:cliente'
    }
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
    title: 'Acceso Prohibido'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'No encontrado'
  }
];
