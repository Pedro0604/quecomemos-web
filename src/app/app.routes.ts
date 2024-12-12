import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu-list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './guards/auth.guards';
import {LayoutComponent} from './layout/layout.component';
import {MenuFormComponent} from './menu-form/menu-form.component';
import {ComidaFormComponent} from './comida-form/comida-form.component';
import {ComidaListComponent} from './comida-list/comida-list.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Todos los menús',
    canActivate: [AuthGuard]
  },
  {
    path: 'menu/create',
    component: MenuFormComponent,
    title: 'Crear un menú',
    canActivate: [AuthGuard]
  },
  {
    path: 'menu/edit/:id',
    component: MenuFormComponent,
    title: 'Editar un menú',
    canActivate: [AuthGuard]
  },
  {
    path: 'comidas',
    component: ComidaListComponent,
    title: 'Todas las comidas',
    canActivate: [AuthGuard]
  },
  {
    path: 'comida/create',
    component: ComidaFormComponent,
    title: 'Crear una comida',
    canActivate: [AuthGuard]
  },
  {
    path: 'comida/edit/:id',
    component: ComidaFormComponent,
    title: 'Editar una comida',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro de usuario'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'No encontrado'
  }
];
