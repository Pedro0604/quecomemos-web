import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu-list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './login/guards/auth.guards';
import {LayoutComponent} from './layout/layout.component';
import {MenuFormComponent} from './menu-form/menu-form.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'logout',
    component: LayoutComponent,
    redirectTo: 'login'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Todos los menús'
  },
  {
    path: 'menu/create',
    component: MenuFormComponent,
    title: 'Crear un menú',
  },
  {
    path: 'menu/edit/:id',
    component: MenuFormComponent,
    title: 'Editar un menú'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'No encontrado'
  }
];
